import { createAccessTokenAuthorizer } from './access-token-authorization';
import { createAuthorizer } from './authorize';
import { createTokenizer } from './token';
import {
  AuthorizeRequest,
  AuthorizeResponse,
  Endpoints,
  TokenRequest,
  TokenResponse,
  AuthorizeAccessTokenRequest,
  AuthorizeAccessTokenResponse,
} from './types/endpoints';
import {
  OAuthServerConfiguration,
  OAuthServerInitOptions,
  OAuthServerQueryInterfaces,
} from './types/server';
import { normalizeServerConfig } from './utils';
import {
  validateAuthorizeTokenRequest,
  validateAuthotizationRequest,
  validateTokenRequest,
} from './validations';

export class OAuth2Server implements Endpoints {
  config: OAuthServerConfiguration;
  queryInterfaces: OAuthServerQueryInterfaces;

  authorizer: ReturnType<typeof createAuthorizer>;
  accessTokenAuthorizer: ReturnType<typeof createAccessTokenAuthorizer>;
  tokenizer: ReturnType<typeof createTokenizer>;

  constructor(init: OAuthServerInitOptions) {
    this.config = normalizeServerConfig(init.config);
    this.queryInterfaces = init.queryInterfaces;
    this.authorizer = createAuthorizer(this.queryInterfaces, this.config);
    this.accessTokenAuthorizer = createAccessTokenAuthorizer(
      this.queryInterfaces,
      this.config
    );
    this.tokenizer = createTokenizer(this.queryInterfaces, this.config);
  }

  async token<T extends TokenRequest = TokenRequest>(
    request: T
  ): Promise<TokenResponse<T>> {
    validateTokenRequest(this.config, request);
    return this.tokenizer.grantToken(request) as TokenResponse<T>;
  }

  async authorize<T extends AuthorizeRequest>(
    request: T
  ): Promise<AuthorizeResponse<T>> {
    validateAuthotizationRequest(this.config, request);
    return this.authorizer.authorize(request) as AuthorizeResponse<T>;
  }

  async authorizeAccessToken(
    request: AuthorizeAccessTokenRequest
  ): Promise<AuthorizeAccessTokenResponse> {
    validateAuthorizeTokenRequest(this.config, request);
    return this.accessTokenAuthorizer.authorizeAccessToken(request);
  }
}

export * from './types/models';
