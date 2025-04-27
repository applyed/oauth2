import {
  ClientModel,
  CodeModel,
  Owner,
  OwnerId,
  Timestamp,
  TokenModel,
  TokenType,
} from './models';

export type GetClientRequest = {
  clientId: string;
  clientSecret?: string;
  includeOwner?: boolean;
};

export type GetClientResponse<T extends GetClientRequest> = {
  client: Omit<ClientModel, 'clientSecret'>;
} & (T extends { includeOwner: true } ? { owner: Owner } : unknown);

export interface ClientQueryInterface {
  getClient<T extends GetClientRequest = GetClientRequest>(
    request: T
  ): Promise<GetClientResponse<T>>;
}

export type IssueTokenRequest = {
  token?: string;
  type: TokenType;
  clientId: string;
  resourceOwnerId: OwnerId;
  expiresAt: Timestamp;
  scope: string;
};

export type IssueTokenResponse = {
  token: TokenModel;
};

export type GetTokenRequest = {
  token: string;
  type: TokenType;
  includeClient: boolean;
  includeResourceOwner: boolean;
};

export type GetTokenResponse<T extends GetTokenRequest> = {
  token: TokenModel;
} & (T extends { includeClient: true } ? { client: ClientModel } : unknown) &
  (T extends { includeResourceOwner: true }
    ? { resourceOwner: Owner }
    : unknown);

export type RevokeTokenRequest =
  | {
      token: string;
    }
  | {
      code: string;
    };

export interface TokenQueryInterface {
  issueToken(request: IssueTokenRequest): Promise<IssueTokenResponse>;
  getToken<T extends GetTokenRequest = GetTokenRequest>(
    request: T
  ): Promise<GetTokenResponse<T>>;
  revokeToken(request: RevokeTokenRequest): Promise<boolean>;
}

export type IssueAuthorizationCodeRequest = {
  code?: string;
  clientId: string;
  resoureOwnerId: OwnerId;
  scope?: string;
  redirectURI?: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
};

export type IssueAuthorizationCodeResponse = {
  code: CodeModel;
};

export type GetAuthorizationCodeRequest = {
  code: string;
  clientId: string;
  returnURI?: string;
  codeVerifier?: string;
  includeClient?: boolean;
  includeResourceOwner?: boolean;
};
export type GetAuthorizationCodeResponse<
  T extends GetAuthorizationCodeRequest
> = {
  code: CodeModel;
} & (T extends { includeClient: true } ? { client: ClientModel } : unknown) &
  (T extends { includeResourceOwner: true }
    ? { resourceOwner: Owner }
    : unknown);

export interface CodeQueryInterface {
  issueAuthorizationCode(
    request: IssueAuthorizationCodeRequest
  ): Promise<IssueAuthorizationCodeResponse>;
  getAuthorizationCode<
    T extends GetAuthorizationCodeRequest = GetAuthorizationCodeRequest
  >(
    request: T
  ): Promise<GetAuthorizationCodeResponse<T>>;
  revokeAuthorizationCode(code: string): Promise<boolean>;
}

export interface OwnerQueryInterface {
  getOwner(id: OwnerId): Promise<Owner>;
  getOwnerIdByCredentials(username: string, password: string): Promise<OwnerId>;
}
