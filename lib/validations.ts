import {
  AuthorizeRequest,
  AuthorizeAccessTokenRequest,
  TokenRequest,
} from './types/endpoints';
import { GrantTypeEnum } from './types/models';
import { OAuthServerConfiguration } from './types/server';

export function validateTokenRequest(
  config: OAuthServerConfiguration,
  request: TokenRequest
) {
  if (!config.allowedGrants.includes(request.grantType)) {
    // throw invalid grant error;
  }
  if (request.grantType === GrantTypeEnum.AUTHORIZATION_CODE) {
    if (!request.authClaim && !request.clientId) {
      // throw authClaim or clientId is required error;
    }
    if (!request.code) {
      // throw code required error;
    }

    // Should we require PKCE for public clients?
    if (
      !request.authClaim &&
      config.PKCERequiredForPublicClients &&
      !request.codeVerifier
    ) {
      // throw public clients must use PKCE
    }
  }
  if (
    request.grantType === GrantTypeEnum.CLIENT_CREDENTIALS &&
    !request.authClaim
  ) {
    // throw credentials required for client credentials error;
  }
  if (request.grantType === GrantTypeEnum.PASSWORD) {
    if (!request.authClaim && !request.clientId) {
      // throw authClaim or clientId is required error;
    }
    if (!request.username || !request.password) {
      // throw user credentials required error;
    }
  }
  if (request.grantType === GrantTypeEnum.REFRESH_TOKEN) {
    if (!request.authClaim && !request.clientId) {
      // throw authClaim or clientId is required error;
    }
    if (!request.refreshToken) {
      // throw refresh token required error;
    }
  }
}

export function validateAuthotizationRequest(
  config: OAuthServerConfiguration,
  request: AuthorizeRequest
) {
  if (!config.allowedResponseTypes.includes(request.responseType)) {
    // throw invalid response type error;
  }
}

export function validateAuthorizeTokenRequest(
  config: OAuthServerConfiguration,
  request: AuthorizeAccessTokenRequest
) {
  if (!request.token) {
    // throw invalid token error;
  }
}
