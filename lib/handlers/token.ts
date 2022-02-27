import OAuth2Service from "..";
import { OAuth2ServiceOptionsInternal, TokenRequest, TokenResponse } from "../types";

function handleTokenrequest(server: OAuth2Service, request: TokenRequest, options?: OAuth2ServiceOptionsInternal): TokenResponse {
  throw new Error('not implemented');
}

export {
  handleTokenrequest
};
