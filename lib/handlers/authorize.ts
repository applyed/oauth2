import OAuth2Service from "..";
import { AuthorizationRequest, CodeAuthorizationRequest, AuthorizationResponse, OAuth2ServiceOptionsInternal, TokenResponse } from "../types";

function handleAuthorizationrequest<T extends AuthorizationRequest>(server: OAuth2Service, request: T, options?: OAuth2ServiceOptionsInternal): T extends CodeAuthorizationRequest ? AuthorizationResponse : TokenResponse {
  throw new Error('not implemented');
}

export {
  handleAuthorizationrequest
};
