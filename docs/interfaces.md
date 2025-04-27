# Query Interfaces

## Client Query Interface

Interface to interact with the client storage models.

### GetClient

#### Request

| Field        | Type              | Comments                              |
| ------------ | ----------------- | ------------------------------------- |
| ClientId     | String            |                                       |
| ClientSecret | String (optional) | Must match stored secret, if provided |
| IncludeOwner | Boolean           | Fetch and include owner               |

#### Response

| Field  | Type                         | Comments                          |
| ------ | ---------------------------- | --------------------------------- |
| Client | Omit<Client, 'ClientSecret'> |                                   |
| Owner  | Owner (optional)             | Required if IncludeOwner was true |

### GetClientsByOwnerId

Not required as part of oAuth flow itself, but required in scope of the over all app.

#### Request

| Field        | Type    | Comments                |
| ------------ | ------- | ----------------------- |
| OwnerId      | String  |                         |
| IncludeOwner | Boolean | Fetch and include owner |

#### Response

| Field   | Type                                                   | Comments |
| ------- | ------------------------------------------------------ | -------- |
| Clients | { Client: Omit<Client, 'ClientSecret'>, Owner?: Owner} |          |

### CreateClient

Not required as part of oAuth flow itself, but required in scope of the over all app.

### DeleteClient

Not required as part of oAuth flow itself, but required in scope of the over all app.

## Token query interface

Interface to interact with the token storage models.

### IssueToken

Should generate a random token if not provided in request

#### Request

| Field           | Type                                  | Comments                                 |
| --------------- | ------------------------------------- | ---------------------------------------- |
| Token           | String (optional)                     | Should be auto generated if not provided |
| Type            | ‘access_token’ &#124; ‘refresh_token’ |                                          |
| ClientId        | String                                |                                          |
| ResourceOwnerId | any                                   |                                          |
| ExpiresAt       | Number                                |                                          |

#### Response

| Field | Type  | Comments                         |
| ----- | ----- | -------------------------------- |
| Token | Token | The newly created token instance |

### GetToken

#### Request

| Field                | Type                                  | Comments |
| -------------------- | ------------------------------------- | -------- |
| Token                | String                                |          |
| Type                 | 'access_token' &#124; 'refresh_token' |          |
| IncludeClient        | Boolean                               |          |
| IncludeResourceOwner | Boolean                               |          |

#### Response

| Field  | Type   | Comments |
| ------ | ------ | -------- |
| Token  | Token  |          |
| Client | Client |          |
| Owner  | Owner  |          |

### RevokeToken

#### Request

| Field | Type   | Comments |
| ----- | ------ | -------- |
| Token | String |          |

## Code query interface

### IssueAuthorizationCode

#### Request

| Field           | Type              | Comments                             |
| --------------- | ----------------- | ------------------------------------ |
| Code            | String (optional) | Should be generated if not provided. |
| ClientId        | String            |                                      |
| ResourceOwnerId | Any               |                                      |

#### Response

| Field | Type | Comments |
| ----- | ---- | -------- |
| Code  | Code |          |

### GetAuthorizationCode

#### Request

| Field         | Type              | Comments                                                                                 |
| ------------- | ----------------- | ---------------------------------------------------------------------------------------- |
| Code          | String            |                                                                                          |
| ClientId      | String            | Must match the found Code                                                                |
| ReturnURI     | String            | Must match the found Code                                                                |
| CodeVerifier  | String (optional) | Required if CodeChallenge is present on the saved Code. Should validate before returning |
| IncludeOwner  | boolean           |                                                                                          |
| IncludeClient | boolean           |                                                                                          |

#### Response

| Field  | Type              | Comments |
| ------ | ----------------- | -------- |
| Code   | Code              |          |
| Client | Client (optional) |          |
| Owner  | Owner (optional)  |          |

### RevokeAuthorizationCode

#### Request

| Field | Type   | Comments       |
| ----- | ------ | -------------- |
| Code  | String | Code to expire |
