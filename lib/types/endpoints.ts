import {
  AccessTokenType,
  ClientModel,
  CodeChallengeMethod,
  GrantTypeEnum,
  Owner,
  OwnerId,
  ResponseType,
  ResponseTypeEnum,
  TokenModel,
} from './models';

// Provided a union of types (U), and a map from individual types in union to target types (M), this retuns the mapped target type.
export type PickReturnType<U, M> = U extends infer K
  ? K extends keyof M
    ? M[K]
    : never
  : never;

export type AuthorizeRequest = {
  responseType: ResponseType; // `json:response_type`
  clientId: string; // `json:client_id`
  redirectURI?: string; // `json:redirect_uri`
  scope?: string; // `json:scope`
  state?: string; // `json:state`
  codeChallenge?: string; // `json:code_challenge`
  codeChallengeMethod?: CodeChallengeMethod; //`json:code_challenege_method`
  resourceOwnerId: OwnerId;
};

export type CodeAuthorizeResponse = {
  code: string; // `json:code`
  state?: string; // `json:state`
};

export type TokenAuthorizeResponse = {
  accessToken: string; // `json:access_token`
  tokenType: AccessTokenType; // `json:token_type`
  expiresIn: number; // `json:expires_in`
  scope?: string; // `json:scope`
  state?: string; // `json:state`
};

export type AuthorizeResponse<T extends AuthorizeRequest> = PickReturnType<
  T['responseType'],
  {
    [ResponseTypeEnum.CODE]: CodeAuthorizeResponse;
    [ResponseTypeEnum.TOKEN]: TokenAuthorizeResponse;
  }
>;

export type TokenAuthClaim = {
  clientId: string;
  clientSecret: string;
};

export type TokenRequest = {
  scope?: string;
  authClaim?: TokenAuthClaim;
} & (
  | {
      grantType: GrantTypeEnum.CLIENT_CREDENTIALS; // `json:grant_type`
      authClaim: TokenAuthClaim;
    }
  | {
      grantType: GrantTypeEnum.REFRESH_TOKEN; // `json:grant_type`
      refreshToken: string; // `json:refresh_token`
      clientId?: string; // `json:client_id`
    }
  | {
      grantType: GrantTypeEnum.PASSWORD; // `json:grant_type`
      username: string; // `json:username`
      password: string; // `json:password`
      clientId?: string; // `json:client_id`
    }
  | {
      grantType: GrantTypeEnum.AUTHORIZATION_CODE; // `json:grant_type`
      code: string; // `json:code`
      redirectURI?: string; // `json:redirect_uri`
      clientId?: string; // `json:client_id`
      codeVerifier?: string; // `json:code_verfier`
    }
);

type BaseTokenResponse = {
  accessToken: string; // `json:access_token`
  tokenType: AccessTokenType; // `json:tokenType`
  expiresIn: number; // `json:expires_in`
  scope: string; // `json:scope`
};

type IncludingRefreshToken = {
  refreshToken?: string;
};

export type TokenResponseTypesMap = {
  [GrantTypeEnum.CLIENT_CREDENTIALS]: BaseTokenResponse;
  [GrantTypeEnum.PASSWORD]: BaseTokenResponse & IncludingRefreshToken;
  [GrantTypeEnum.REFRESH_TOKEN]: BaseTokenResponse & IncludingRefreshToken; // Refresh token can be included if we are rotating the refresh token.
  [GrantTypeEnum.AUTHORIZATION_CODE]: BaseTokenResponse & IncludingRefreshToken;
  [GrantTypeEnum.IMPLICIT]: never;
};

export type TokenResponse<T extends TokenRequest = TokenRequest> =
  PickReturnType<T['grantType'], TokenResponseTypesMap>;

export type AuthorizeAccessTokenRequest = {
  token: string;
  scope?: string;
};

export type AuthorizeAccessTokenResponse = {
  token: TokenModel;
  resourceOwner: Owner;
  client: ClientModel;
  X_OAUTH_AUTH_PARAMS: string; // Serialized Omit<AuthorizeAccessTokenResponse, 'X_OAUTH_AUTH_PARAMS' | 'X_OAUTH_AUTH_PARAMS_SIG'>
  X_OAUTH_AUTH_PARAMS_SIG: string;
};

export interface Endpoints {
  authorize<T extends AuthorizeRequest>(
    request: T
  ): Promise<AuthorizeResponse<T>>;
  token<T extends TokenRequest = TokenRequest>(
    request: T,
    authClaim: string
  ): Promise<TokenResponse<T>>;
  authorizeAccessToken(
    request: AuthorizeAccessTokenRequest
  ): Promise<AuthorizeAccessTokenResponse>;
}
