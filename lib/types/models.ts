export enum ClientTypeEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
}
export type ClientType = `${ClientTypeEnum}`;

export enum GrantTypeEnum {
  AUTHORIZATION_CODE = 'authorization_code',
  CLIENT_CREDENTIALS = 'client_credentials',
  PASSWORD = 'password',
  IMPLICIT = 'implicit',
  REFRESH_TOKEN = 'refresh_token',
}
export type GrantType = `${GrantTypeEnum}`;

export enum ResponseTypeEnum {
  CODE = 'code',
  TOKEN = 'token',
}
export type ResponseType = `${ResponseTypeEnum}`;

export enum AccessTokenTypeEnum {
  BEARER = 'Bearer',
}
export type AccessTokenType = `${AccessTokenTypeEnum}`;

export enum CodeChallengeMethodEnum {
  PLAIN = 'plain',
  S256 = 's256',
}
export type CodeChallengeMethod = `${CodeChallengeMethodEnum}`;

export enum TokenTypeEnum {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}
export type TokenType = `${TokenTypeEnum}`;

export type Owner = unknown;
export type OwnerId = unknown;
export type Timestamp = number;

export interface ClientModel {
  name: string;
  clientId: string;
  clientSecret?: string;
  clientType: ClientType;
  grantTypes: GrantType[];
  redirectURIs: string[];
  scopes: string;
  ownerId: OwnerId;
  accessTokenExpiry: number; // Time period in seconds
  refreshTokenExpiry: number; // Time period in seconds

  /**
   * Negative value - Refresh token isn't rotated for entirity of its lifetime.
   * Zero - The refresh token is rotated at every exchange.
   * Positive vlue - The refresh token is rotated after specified number of seconds.
   */
  refreshTokenRotation: number; // Time period in seconds
  createdAt: Timestamp; // Epoch timestamp
  updatedAt: Timestamp; // Epoch timestamp
}

export interface CodeModel {
  clientId: string;
  code: string;
  redirectURI: string;
  scope: string;
  codeChallenge: string;
  codeChallengeMethod: CodeChallengeMethod;
  resourceOwnerId: OwnerId;
  createdAt: Timestamp;
  expiresAt: Timestamp;
}

export interface TokenModel {
  token: string;
  type: TokenType;
  code: string;
  scope: string;
  clientId: string;
  resourceOwnerId: OwnerId;
  expiresAt: Timestamp;
  createdAt: Timestamp;
}
