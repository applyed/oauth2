# Storage Models

## Client

| Field                | Type                                                                                                               | Comments                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Name                 | String                                                                                                             | Client name to display to user                                                                |
| ClientId             | String                                                                                                             | Identifier for the client                                                                     |
| ClientSecret         | String (optional)                                                                                                  | Hashed / Bcrypt                                                                               |
| CilentType           | Array<'public' &#124; 'private'>                                                                                   | public clients will not have have a secret. Such clients can only use a subset of grant types |
| GrantTypes           | Array<'implicit' &#124; 'authorization_code' &#124; 'password' &#124; 'client_credentials' &#124; 'refresh_token'> | Allowed grant types for this client                                                           |
| RedirectURIs         | Array<string>                                                                                                      | Allowed redirect URIs for this client                                                         |
| Scope                | String                                                                                                             | Allowed scope(s) for this client                                                              |
| OwnerId              | any (optional)                                                                                                     | Opaque identifier for the owner of this client                                                |
| AccessTokenExpiry    | number                                                                                                             | Lifetime (in seconds) of access tokens issued to this client                                  |
| RefreshTokenExpiry   | number                                                                                                             | Lifetime (in seconds) of refresh tokens issued to this client                                 |
| RefreshTokenRotation | number                                                                                                             | < 0: Never rotate <br> = 0: Rotate during every exchange<br> > 0: Rotate if refresh tokne     |
| CreatedAt            | number                                                                                                             | Epoch timestamp of this client's creation                                                     |
| UpdatedAt            | number                                                                                                             | Epoch timestamp of this client's update                                                       |

## Code

| Field               | Type                  | Comments                                                           |
| ------------------- | --------------------- | ------------------------------------------------------------------ |
| ClientId            | String                | The client id that this code was issued to                         |
| Code                | String                | The generated authorization code                                   |
| RedirectURI         | String                | Redirection URI that this code will be sent to                     |
| Scope               | String                |                                                                    |
| CodeChallenge       | String                | Code challenge provided for PKCE                                   |
| CodeChallengeMethod | 'plain' &#124; 's256' | Transformation used for code challenge                             |
| ResourceOwnerId     | any                   | Opaque identifier for the resource owner that issued authorization |
| CreatedAt           | number                | Epoch timestamp of this code's creation                            |
| ExpiresAt           | number                | Epoch timestamp of this code’s expiry                              |

## Token

| Field           | Type                                  | Comments                                                                                                                               |
| --------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Token           | String                                |                                                                                                                                        |
| Type            | 'access_token' &#124; 'refresh_token' |                                                                                                                                        |
| Code            | String (optional)                     | The authorization code exchanged for generating this token                                                                             |
| Scope           | String                                | Scopes issued to this token                                                                                                            |
| ExpiresAt       | Number                                | Epoch timestamp of this token's expiration                                                                                             |
| ClientId        | String                                | ID of the client that this token was issued to                                                                                         |
| ResourceOwnerId | any                                   | Opaque identifier for the resource owner that originally authorized this token. Client's owner id, in case of client credentials grant |
| CreatedAt       | Number                                | Epoch timestamp of this token's creation                                                                                               |

## Owner

Opaque struct to represent resource owners. Should have primary key for use as Foreign Key in Client.OwnerId, Code.ResourceOwnerId and Token.ResourceOwnerId fields.
