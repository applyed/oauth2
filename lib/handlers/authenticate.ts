import OAuth2Service from "..";
import { AuthenticationRequest, AuthenticationResponse, OAuth2ServiceOptionsInternal } from "../types";

function handleAuthenticationrequest(server: OAuth2Service, request: AuthenticationRequest, options?: OAuth2ServiceOptionsInternal): AuthenticationResponse {
  throw new Error('not implemented');
}

export {
  handleAuthenticationrequest
};
