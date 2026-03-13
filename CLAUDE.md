# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the app (http://localhost:9999/)
mvn jetty:run -Djetty.http.port=9999

# Build WAR
mvn clean package

# Run all tests
mvn test

# Run a single test class
mvn test -Dtest=UtilsTest

# Run a single test method
mvn test -Dtest=UtilsTest#testDoPost
```

Requirements: Java 11, Maven 3.x.

## Architecture

This is a **BFF (Backend For Frontend)** pattern servlet webapp that acts as an OIDC/OAuth 2.0 client for testing purposes.

**Key design principle:** The browser never handles client secrets. All token endpoint calls go through `/bff`, which proxies the POST to the real OAuth endpoint server-side.

### Request Flow

1. `index.jsp` renders the UI shell; all logic is in `script.js`
2. User configures OAuth parameters (saved to browser cookies for persistence)
3. For authorization code flow: JS redirects the browser to the IdP authorization URL directly
4. For all token endpoint calls (token exchange, refresh, revocation, introspection): JS POSTs to `/bff` with an extra `endpoint` param
5. `BFFServlet` strips the `endpoint` param, proxies the POST to that URL, returns the response
6. JS displays the response and parses JWTs client-side

### Backend (`src/main/java/net/rksk/client/oidc/`)

- **`BFFServlet.java`** — Servlet mapped to `/bff`. Reads `endpoint` from params, forwards remaining params as a form POST to that URL, returns raw response.
- **`Utils.java`** — Executes HTTPS POSTs using Apache HttpClient. Configured to trust all SSL certificates (intentional — supports testing against servers with self-signed certs).
- **`BffResponse.java`** — Simple wrapper holding response body (String) and HTTP status code.

### Frontend (`src/main/webapp/`)

- **`index.jsp`** — Bootstrap 5 HTML shell. Loads `script.js` with a timestamp cache-buster.
- **`script.js`** — All OAuth flow logic: PKCE code generation/verification, authorization URL construction, token requests, refresh, revocation, introspection, OIDC logout, JWT decoding for display.

### Testing

Tests are in `src/test/java/net/rksk/client/oidc/`. `UtilsTest` mocks the Apache HttpClient to verify `Utils.doPost()` response handling. When adding tests for `BFFServlet`, inject dependencies rather than relying on a running container.
