# Endpoints

## Authorization Endpoint

This endpoint should be exposed by the server.

#### Request

| Field                 | Type                             | Comments                                                                   |
| --------------------- | -------------------------------- | -------------------------------------------------------------------------- |
| response_type         | 'code' &#124; 'token'            | Reponse type expected on successful authorization                          |
| client_id             | String                           | Id of the client requesting authorization                                  |
| redirect_uri          | String                           | URL to redirect to after successful authorization                          |
| scope                 | String (optional)                | Scope(s) being authorized                                                  |
| state                 | String (optional)                | Opaque value used by client to maintain state between request and callback |
| code_challenge        | String (optional)                | used for PKCE                                                              |
| code_challenge_method | 'plain' &#124; 's256' (optional) | used for PKCE                                                              |

#### Response

| Field | Type              | Comments                                                 |
| ----- | ----------------- | -------------------------------------------------------- |
| code  | String            | The authorization code (in case of response_type 'code') |
| state | String (optional) | Required if state was provided in request.               |

## Token endpoint

This endpoint should be exposed by the server.

#### Request

| Field         | Type                                                                                                        | Comment                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| grant_type    | ‘refresh_token’ &#124; ‘authorization_code’ &#124; ‘client_credentials’ &#124; ‘password’ &#124; ‘implicit’ |                                               |
| redirects     | String (optional)                                                                                           | Required if provided in authorization request |
| client_id     | String(optional)                                                                                            | Required for public clients                   |
| code          | String (optional)                                                                                           |                                               |
| refresh_token | String (optional)                                                                                           |                                               |
| username      | String (optional)                                                                                           |                                               |
| password      | String (optional)                                                                                           |                                               |
| scope         | String                                                                                                      |                                               |

#### Response

| Field         | Type              | Comment                                                                                    |
| ------------- | ----------------- | ------------------------------------------------------------------------------------------ |
| access_token  | String            |                                                                                            |
| token_type    | ‘Bearer’          |                                                                                            |
| expires_in    | Number            | Expiry in seconds                                                                          |
| refresh_token | String (optional) | Required when rotating refresh token. Typically issued in implicit, code & password grants |
| scope         | String            | Scopes issued to the token                                                                 |

## TokenValidation Endpoint

Endpoint to validate the authenticity of a token, and get token metadata (resoure owner, client details etc). This endpoint likely only needs to be exposed to the resource servers.

#### Request

| Field | Type   | Comments           |
| ----- | ------ | ------------------ |
| Token | String | Token to validate  |
| Scope | String | Scope(s) to expect |

#### Response

| Field                   | Type                                                                       | Comments                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Token                   | Token                                                                      | The validated Token Model                                                                                         |
| ResourceOwner           | Owner                                                                      | The owner Model that authorized the token                                                                         |
| Client                  | Client                                                                     | The client that the token was issued to                                                                           |
| X-OAUTH-AUTH-PARAMS     | { Token: Token, ImmediateActor: Owner, Client: Client, Timestamp: number } | Single struct with details in case of successful authentication. Thsi can be useful for implementing ForwardAuth. |
| X-OAUTH-AUTH-PARAMS-SIG | String                                                                     | Cryptographic signature of the auth params header value                                                           |
