import {
  AuthorizeRequest,
  CodeAuthorizeResponse,
  TokenAuthorizeResponse,
} from './types/endpoints';
import {
  AccessTokenTypeEnum,
  ResponseTypeEnum,
  TokenTypeEnum,
} from './types/models';
import {
  OAuthServerConfiguration,
  OAuthServerQueryInterfaces,
} from './types/server';
import { generateRandomBytes, getApplicableScope } from './utils';

export function createAuthorizer(
  queryInterfaces: OAuthServerQueryInterfaces,
  config: OAuthServerConfiguration
) {
  const getScope = async (request: AuthorizeRequest): Promise<string> => {
    const allowedScopes = (
      await queryInterfaces.client.getClient({
        clientId: request.clientId,
      })
    ).client.scopes;

    return getApplicableScope(allowedScopes, request.scope);
  };

  const codeAuthorization = async (
    request: AuthorizeRequest
  ): Promise<CodeAuthorizeResponse> => {
    const scope = await getScope(request);
    const code = generateRandomBytes(
      config.tokensByteLength,
      config.binaryEncoding
    );
    await queryInterfaces.code.issueAuthorizationCode({
      code,
      scope,
      clientId: request.clientId,
      resoureOwnerId: request.resourceOwnerId,
      codeChallenge: request.codeChallenge,
      codeChallengeMethod: request.codeChallengeMethod,
      redirectURI: request.redirectURI,
    });

    return {
      code,
      state: request.state,
    };
  };

  const tokenAuthorization = async (
    request: AuthorizeRequest
  ): Promise<TokenAuthorizeResponse> => {
    const scope = await getScope(request);
    const accessToken = generateRandomBytes(
      config.tokensByteLength,
      config.binaryEncoding
    );
    await queryInterfaces.token.issueToken({
      token: accessToken,
      scope,
      clientId: request.clientId,
      expiresAt: Date.now() + config.accessTokenExpiry,
      resourceOwnerId: request.resourceOwnerId,
      type: TokenTypeEnum.ACCESS_TOKEN,
    });

    return {
      accessToken,
      scope,
      tokenType: AccessTokenTypeEnum.BEARER,
      expiresIn: config.accessTokenExpiry,
      state: request.state,
    };
  };

  const authorize = (request: AuthorizeRequest) => {
    if (request.responseType === ResponseTypeEnum.CODE) {
      return codeAuthorization({
        ...request,
        responseType: ResponseTypeEnum.CODE,
      });
    }

    if (request.responseType === ResponseTypeEnum.TOKEN) {
      return tokenAuthorization({
        ...request,
        responseType: ResponseTypeEnum.TOKEN,
      });
    }

    return null as never;
  };

  return { authorize };
}
