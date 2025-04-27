import {
  TokenAuthClaim,
  TokenRequest,
  TokenResponseTypesMap,
} from './types/endpoints';
import { IssueTokenRequest } from './types/interface';
import {
  AccessTokenTypeEnum,
  GrantTypeEnum,
  TokenTypeEnum,
} from './types/models';
import {
  OAuthServerConfiguration,
  OAuthServerQueryInterfaces,
} from './types/server';
import {
  generateRandomBytes,
  getApplicableScope,
  isPublicClient,
  validatePCKE,
} from './utils';

type ScopedTokenRequest<T extends GrantTypeEnum> = TokenRequest & {
  grantType: T;
};

export function createTokenizer(
  queryInterfaces: OAuthServerQueryInterfaces,
  config: OAuthServerConfiguration
) {
  const issueAccessToken = async (
    partialRequest: Pick<
      IssueTokenRequest,
      'clientId' | 'resourceOwnerId' | 'scope'
    >,
    issueRefreshToken: boolean = false,
    refreshTokenExpiry: number = Date.now() + config.refreshTokenExpiry,
    accessTokenExpiry: number = Date.now() + config.accessTokenExpiry
  ) => {
    const accessTokenStr = generateRandomBytes(
      config.tokensByteLength,
      config.binaryEncoding
    );
    const refreshTokenStr = issueRefreshToken
      ? generateRandomBytes(config.tokensByteLength, config.binaryEncoding)
      : undefined;

    await queryInterfaces.token.issueToken({
      ...partialRequest,
      expiresAt: accessTokenExpiry,
      type: TokenTypeEnum.ACCESS_TOKEN,
      token: accessTokenStr,
    });

    if (refreshTokenStr) {
      await queryInterfaces.token.issueToken({
        ...partialRequest,
        expiresAt: refreshTokenExpiry,
        type: TokenTypeEnum.REFRESH_TOKEN,
        token: refreshTokenStr,
      });
    }

    return {
      accessToken: accessTokenStr,
      scope: partialRequest.scope,
      tokenType: AccessTokenTypeEnum.BEARER,
      expiresIn: config.accessTokenExpiry,
      ...(issueRefreshToken ? { refreshToken: refreshTokenStr } : {}),
    };
  };

  const validateAuthClaimsAndGetClient = async (
    authClaim?: TokenAuthClaim,
    overrideClientId?: string,
    includeOwner?: boolean
  ) => {
    const clientId = authClaim?.clientId ?? overrideClientId;
    const clientSecret = authClaim?.clientSecret;

    if (!clientId) {
      // throw clientId mandatory error.
      throw new Error();
    }

    const clientModel = await queryInterfaces.client.getClient({
      clientId,
      clientSecret,
      includeOwner,
    });

    if (!clientSecret || clientModel.client.clientType !== 'public') {
      // throw client secret required for non public clients.
      throw new Error();
    }
    return clientModel;
  };

  /**
   * 1. Mandatorily expect & validate auth claims
   * 2. Remove requested scope(s) that are not present on the client. Throw error if no scopes remain
   * 3. Issue and return access token, do not issue refresh token
   */
  const clientCredentialsGrant = async <
    T extends ScopedTokenRequest<GrantTypeEnum.CLIENT_CREDENTIALS>
  >(
    request: T
  ): Promise<TokenResponseTypesMap[T['grantType']]> => {
    const { scope: requestedScope } = request;

    const clientModel = await validateAuthClaimsAndGetClient(
      request.authClaim,
      undefined,
      true
    );
    if (isPublicClient(clientModel.client)) {
      // throw client creds grant not allowed for public clients.
      throw new Error();
    }

    const scope = getApplicableScope(clientModel.client.scopes, requestedScope);
    return await issueAccessToken({
      clientId: clientModel.client.clientId,
      resourceOwnerId: clientModel.client.ownerId,
      scope,
    });
  };

  /**
   * 1. Mandatorily expect & validate auth claims if the client was issued credentials
   * 2. Remove requested scope(s) that are not present on the client. Throw error if no scopes remain
   * 3. Validate resource owner credentials.
   * 4. Issue and return acces token, issue refresh token as well.
   */
  const passwordGrant = async <
    T extends ScopedTokenRequest<GrantTypeEnum.PASSWORD>
  >(
    request: T
  ): Promise<TokenResponseTypesMap[T['grantType']]> => {
    const { username, password } = request;
    const clientModel = await validateAuthClaimsAndGetClient(
      request.authClaim,
      request.clientId
    );
    const resourceOwnerId = queryInterfaces.owner.getOwnerIdByCredentials(
      username,
      password
    );

    const scope = getApplicableScope(clientModel.client.scopes, request.scope);
    const shouldIssueRefreshToken =
      config.issueRefreshTokenForPasswordGrant &&
      (isPublicClient(clientModel.client)
        ? config.issueRefreshTokenForPublicClients
        : true);
    return await issueAccessToken(
      {
        clientId: clientModel.client.clientId,
        resourceOwnerId,
        scope,
      },
      shouldIssueRefreshToken
    );
  };

  /**
   * 1. Mandatorily expect & validate auth claims if the client was issued credentials
   * 2. Validate refresh token isn't expired.
   * 3. Remove requested scope(s) that are missing on the client or the (refresh) token. Throw error if no scopes remain
   * 4. Issue access token.
   * 5. If refresh token creation date is older than rotation period, issue a new refresh token as well.
   * 6. Return access token along with refresh token (if issued).
   */
  const refreshTokenGrant = async <
    T extends ScopedTokenRequest<GrantTypeEnum.REFRESH_TOKEN>
  >(
    request: T
  ): Promise<TokenResponseTypesMap[T['grantType']]> => {
    const { refreshToken } = request;
    const clientModel = await validateAuthClaimsAndGetClient(
      request.authClaim,
      request.clientId
    );

    const refreshTokenModel = await queryInterfaces.token.getToken({
      token: refreshToken,
      type: TokenTypeEnum.REFRESH_TOKEN,
      includeClient: false,
      includeResourceOwner: false,
    });

    if (!refreshTokenModel) {
      // Throw invalid refresh token.
      throw new Error();
    }

    const scope = getApplicableScope(clientModel.client.scopes, request.scope);
    const shouldIssueRefreshToken =
      refreshTokenModel.token.expiresAt >= Date.now();
    return await issueAccessToken(
      {
        clientId: clientModel.client.clientId,
        scope,
        resourceOwnerId: refreshTokenModel.token.resourceOwnerId,
      },
      shouldIssueRefreshToken,
      refreshTokenModel.token.expiresAt
    );
  };

  /**
   * 1. Mandatorily expect & validate auth claims if the client was issued credentials, else expect code_challenge to be present
   * 3. Validate that code isn't expired.
   * 2. Remove requested scope(s) that are missing on the client or the code. Throw error if no scopes remain
   * 4. Match redirectURI if present on Code model.
   * 5.
   */
  const authorizationCodeGrant = async <
    T extends ScopedTokenRequest<GrantTypeEnum.AUTHORIZATION_CODE>
  >(
    request: T
  ): Promise<TokenResponseTypesMap[T['grantType']]> => {
    const clientModel = await validateAuthClaimsAndGetClient(
      request.authClaim,
      request.clientId
    );
    const codeModel = await queryInterfaces.code.getAuthorizationCode({
      code: request.code,
      clientId: clientModel.client.clientId,
    });

    if (codeModel.code.redirectURI !== request.redirectURI) {
      // throw the redirect uri must match the one provided in authorization.
      throw new Error();
    }

    // PKCE
    if (isPublicClient(clientModel.client)) {
      const { codeVerifier } = request;
      const { codeChallenge, codeChallengeMethod } = codeModel.code;
      if (
        config.PKCERequiredForPublicClients &&
        (!codeVerifier || !codeChallenge || !codeChallengeMethod)
      ) {
        // throw PKCE required
      }

      if (
        codeVerifier &&
        codeChallenge &&
        !validatePCKE(codeVerifier, codeChallenge, codeChallengeMethod)
      ) {
        // throw PKCE failure error
        throw new Error();
      }
    }

    const scope = getApplicableScope(codeModel.code.scope, request.scope);
    return await issueAccessToken(
      {
        clientId: clientModel.client.clientId,
        scope,
        resourceOwnerId: codeModel.code.resourceOwnerId,
      },
      isPublicClient(clientModel.client)
        ? config.issueRefreshTokenForPublicClients
        : true
    );
  };

  const grantToken = <T extends TokenRequest>(
    request: T
  ): Promise<TokenResponseTypesMap[T['grantType']]> => {
    if (request.grantType === GrantTypeEnum.CLIENT_CREDENTIALS) {
      return clientCredentialsGrant(request);
    } else if (request.grantType === GrantTypeEnum.PASSWORD) {
      return passwordGrant(request);
    } else if (request.grantType === GrantTypeEnum.REFRESH_TOKEN) {
      return refreshTokenGrant(request);
    } else if (request.grantType === GrantTypeEnum.AUTHORIZATION_CODE) {
      return authorizationCodeGrant(request);
    }

    // Invalid or unhandled grantType
    throw new Error();
  };

  return { grantToken };
}
