import {
  AuthorizeAccessTokenRequest,
  AuthorizeAccessTokenResponse,
} from './types/endpoints';
import { TokenTypeEnum } from './types/models';
import {
  OAuthServerConfiguration,
  OAuthServerQueryInterfaces,
} from './types/server';
import { hasScope } from './utils';
import { sign } from 'node:crypto';

export function createAccessTokenAuthorizer(
  queryInterfaces: OAuthServerQueryInterfaces,
  config: OAuthServerConfiguration
) {
  const authorizeAccessToken = async (
    request: AuthorizeAccessTokenRequest
  ): Promise<AuthorizeAccessTokenResponse> => {
    const { token, scope = '' } = request;
    const tokenModel = await queryInterfaces.token.getToken({
      token,
      type: TokenTypeEnum.ACCESS_TOKEN,
      includeClient: true,
      includeResourceOwner: true,
    });

    const expectedScopes = scope.split(/\s+/).map((s) => s.trim());
    if (
      scope &&
      !expectedScopes.every((scope) => hasScope(tokenModel.token.scope, scope))
    ) {
      // throw missing scope authorization error.
      throw new Error();
    }

    const authParams = JSON.stringify(tokenModel);
    const authParamsSig = sign(
      'SHA256',
      Buffer.from(authParams),
      config.signingKey
    ).toString('base64');

    return {
      ...tokenModel,
      X_OAUTH_AUTH_PARAMS: authParams,
      X_OAUTH_AUTH_PARAMS_SIG: authParamsSig,
    };
  };

  return {
    authorizeAccessToken,
  };
}
