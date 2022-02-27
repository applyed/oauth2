/* Service interface types */
export interface OAuth2ServiceOptionsInternal {
  accessTokenLifetime?: number,
  refreshTokenLifetime?: number,
}
export interface OAuth2ServiceOptions extends OAuth2ServiceOptionsInternal {
  model: OAuth2ServiceModel,
}

export interface AuthenticationRequest {
  token: string
  scope?: ScopeType // Authenticate for this/these scopes.
  hydrateClient?: boolean
  hydrateUser?: boolean
}

export interface AuthenticationResponse {
  token: Object // Token object.
  scope: string // Space separated list of all authorized scopes.
}

export type ResponseTypeCode = 'code';
export type ResponsetypeToken = 'token';

export interface BaseAuthorizationRequest {
  clientId: string
  redirectUri?: string
  scope?: ScopeType
  state: string
}

export interface CodeAuthorizationRequest extends BaseAuthorizationRequest {
  responseType: ResponseTypeCode
}

export interface TokenAuthorizationRequest extends BaseAuthorizationRequest {
  responseType: ResponsetypeToken
}

export type AuthorizationRequest = CodeAuthorizationRequest | TokenAuthorizationRequest;

export interface AuthorizationResponse {
  code: string
  state: string
}

type AuthzGrantType = 'authorization_code';
type PasswordGrantType = 'password';
type ClientCredsGrantType = 'client_credentials';

export interface BaseTokenRequest {
  clientId: string
  clientSecret?: string
}

export interface AuthzTokenRequest extends BaseTokenRequest {
  redirectUri: string
  grantType: AuthzGrantType
  code: string
}

export interface PasswordTokenRequest extends BaseTokenRequest {
  grantType: PasswordGrantType
  username: string
  password: string
  scope?: ScopeType
}

export interface ClientCredsTokenRequest extends BaseTokenRequest {
  grantType: ClientCredsGrantType
  clientSecret: string
}

export type TokenRequest = AuthzTokenRequest | PasswordTokenRequest | ClientCredsTokenRequest;

export interface TokenResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  refreshToken?: string
  scope?: ScopeType
}

/* Model interface types */
export type ScopeType = string | Array<string>;
export type GrantType = Array<string>;

/* Transparent to this library, objects of any shape would be accepted */
export interface UserModel {
  [key: string]: any
}

export interface ClientModel {
  id: string
  grants: GrantType
  redirectUris: Array<string>
  scopes?: ScopeType
  accessTokenLifetime?: number
  refreshTokenLifetime?: number
  user?: UserModel
}

export interface BaseTokenModel {
  scope?: ScopeType,
  client: ClientModel,
  user: UserModel
}

export interface AccessTokenModel extends BaseTokenModel {
  accessToken: string
  accessTokenExpiresAt: Date
}

export interface RefreshTokenModel extends BaseTokenModel {
  refreshToken: string
  refreshTokenExpiresAt: Date
}

export interface TokenModel extends AccessTokenModel, RefreshTokenModel {}

export interface OAuth2ServiceModel {
  getClient: (clientId: string, clientSecret?: string) => ClientModel,
  getAccessToken
}
