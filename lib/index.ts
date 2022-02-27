import _omit from 'lodash/omit.js';
import { handleAuthenticationrequest } from './handlers/authenticate';
import { handleAuthorizationrequest } from './handlers/authorize';
import { handleTokenrequest } from './handlers/token';
import { AuthenticationRequest, AuthenticationResponse, AuthorizationRequest, AuthorizationResponse, CodeAuthorizationRequest, OAuth2ServiceModel, OAuth2ServiceOptions, OAuth2ServiceOptionsInternal, TokenRequest, TokenResponse } from "./types";

class OAuth2Service {
  #model: OAuth2ServiceModel
  #options: OAuth2ServiceOptionsInternal

  constructor(options: OAuth2ServiceOptions) {
    this.#model = options.model;
    this.#options = _omit(options, 'model');
  }

  authorize<T extends AuthorizationRequest>(request: T, options?: OAuth2ServiceOptionsInternal): T extends CodeAuthorizationRequest ? AuthorizationResponse : TokenResponse {
    return handleAuthorizationrequest(this, request, options);
  }

  authenticate(request: AuthenticationRequest, options?: OAuth2ServiceOptionsInternal): AuthenticationResponse {
    return handleAuthenticationrequest(this, request, options);
  }

  token(request: TokenRequest, options?: OAuth2ServiceOptionsInternal): TokenResponse {
    return handleTokenrequest(this, request, options);
  }
}

export default OAuth2Service;
export {
  OAuth2Service
};
