import {
  ClientQueryInterface,
  CodeQueryInterface,
  OwnerQueryInterface,
  TokenQueryInterface,
} from './interface';
import { GrantType, ResponseType } from './models';

export type OAuthServerConfiguration = {
  allowedGrants: GrantType[];
  allowedResponseTypes: ResponseType[];
  accessTokenExpiry: number; // in seconds
  refreshTokenExpiry: number; // in seconds; 0 for never
  PKCERequiredForPublicClients: boolean;
  signingKey: string;
  clientIdentifiersByteLength: number;
  tokensByteLength: number;
  binaryEncoding: 'hex' | 'base64';
  issueRefreshTokenForPasswordGrant: boolean;
  issueRefreshTokenForPublicClients: boolean;
};

export type OAuthServerQueryInterfaces = {
  code: CodeQueryInterface;
  token: TokenQueryInterface;
  client: ClientQueryInterface;
  owner: OwnerQueryInterface;
  // audit: AuditModelInterface;
};

export type OAuthServerInitOptions = {
  config: Partial<OAuthServerConfiguration>;
  queryInterfaces: OAuthServerQueryInterfaces;
};
