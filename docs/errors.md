# Errors

## Error

| Field             | Type              | Comments                                  |
| ----------------- | ----------------- | ----------------------------------------- |
| error             | ErrorCode         |                                           |
| error_description | String            | Humna readble error description           |
| error_uri         | String (optional) | URI to a page describing the error        |
| state             | String (optional) | Required if state was provided in request |

## Error Codes

| Error Code                | Description                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| invalid_request           | Missing or invalid parameter value (except for the fields with more specific error codes below) |
| invalid_client            | Missing or invalid client credentials                                                           |
| invalid_grant             | The provided grant (code / credentials / refresh_token) or redirect_uri is invalid.             |
| unauthorized_client       | The client is not allowed to use the grant_type                                                 |
| unsupported_grant_type    | The grant_type is not supported by the server                                                   |
| invalid_scope             | The requested scope(s) is invalid                                                               |
| access_denied             | The resource owner didn't authorize the client                                                  |
| unsupported_response_type | Returned when server doesn't support implict grant                                              |
| server_error              | An unexpected error prevented the server from completing this request                           |
| temporarily_unavailable   | The server is not avaialable to service requests                                                |
