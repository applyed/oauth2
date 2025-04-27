import { createHash, randomBytes } from 'node:crypto';
import { OAuthServerConfiguration } from './types/server';
import {
  ClientModel,
  CodeChallengeMethodEnum,
  GrantTypeEnum,
  ResponseTypeEnum,
} from './types/models';

/**
 *
 * @param allowed Space separated list of allowed scopes
 * @param expected single scope to test for presence in allowed scope.
 * @returns
 */
export function hasScope(allowed: string, expected: string): boolean {
  return (
    allowed === expected ||
    allowed.startsWith(`${expected} `) ||
    allowed.endsWith(` ${expected}`) ||
    allowed.includes(` ${expected} `)
  );
}

export function generateRandomBytes(
  size: number,
  encoding: 'hex' | 'base64' = 'base64'
) {
  return randomBytes(size).toString(encoding);
}

export function isPublicClient(client: ClientModel) {
  return client.clientType === 'public';
}

export function validatePCKE(
  codeVerifier: string,
  codeChallenge: string,
  codeChallengeMethod: string = CodeChallengeMethodEnum.PLAIN
) {
  if (codeChallengeMethod === CodeChallengeMethodEnum.PLAIN) {
    return codeVerifier === codeChallenge;
  } else if (codeChallengeMethod === CodeChallengeMethodEnum.S256) {
    return (
      createHash('sha256').update(codeVerifier).digest('base64') ===
      codeChallenge
    );
  }
  throw new Error('Invalid code verifier');
}

export function normalizeServerConfig(
  config: Partial<OAuthServerConfiguration>
): OAuthServerConfiguration {
  return {
    allowedGrants: Object.values(GrantTypeEnum),
    allowedResponseTypes: Object.values(ResponseTypeEnum),
    accessTokenExpiry: 60 * 60, // 1 hour
    refreshTokenExpiry: 0, // never
    PKCERequiredForPublicClients: true,
    signingKey: '',
    binaryEncoding: 'base64',
    clientIdentifiersByteLength: 63, // 104 bytes in base64
    tokensByteLength: 45, // 60 bytes in base64
    issueRefreshTokenForPasswordGrant: false,
    issueRefreshTokenForPublicClients: true,
    ...config,
  };
}

export function getApplicableScope(allowed: string, requested?: string) {
  if (!requested) {
    return allowed;
  }

  const allowedScopes = new Set(allowed.split(' '));
  return requested
    .split(' ')
    .filter((requestedScope) => allowedScopes.has(requestedScope))
    .join(' ');
}
