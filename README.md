# @applyed/oauth2-service

A framework and datastore agnostic oAuth2 service implementation for creating oAuth2 authorization servers using NodeJS. This service derives heavy influences from [oauth2-server](https://github.com/oauthjs/node-oauth2-server). This library will provide drop-in compatibility with oauth2-server via a compatibility layer.

## Motivation

As a consumer of the oauth2-server, I have waited for a while hoping for feature updates (pkce) and security fixes to be added to the original project. The security warnings from git and npm have driven home the futility of wait at this point.

I have considered forking the library, and adding incremental fixes. However, the code is significantly old, and IMHO any respectible 'fix' that I could justify to my soul would inevitibly be a complete re-write of the library.

And so, here we go...

## Development goals

I am setting these developement goals mainly for my reference, and to stop myself from lazying out later. If more people join in, we should definitely revisit these.

1. Full compatibility with [original oAuth2 spec RFC6749](https://datatracker.ietf.org/doc/html/rfc6749.html), [pkce for oAuth2 spec RFC7636](https://datatracker.ietf.org/doc/html/rfc7636), and [oAuth2 authorization spec RFC6750](https://datatracker.ietf.org/doc/html/rfc6750.html).
2. Scenario based tests, covering all use-cases not just lines of code.
3. Creation of compatibility layer with original oauth2-package.
4. Middleware implementations for express and koa frameworks in separate package.

## Notable differences

As a aspiring successor to [oauth2-server](https://github.com/oauthjs/node-oauth2-server), this library will intend to keep the public API as close as possible to the existing functionality in the original library. The name and spec would be allowed to diverge where appropriate, as long as it can be bridged within the compatibility layer.

Additionally, as the name indicates, this library intends to be a service rather than a server. We will explicitly leave the network mechanisms to the implementor (the compat layer, express middleware, and koa middleware will implement network mechanisms).

## Contributing

For now I am the only developer here. If you have suggestions feel free to email me or open an issue. Pull requests for bug fixes or new features are welcome.
