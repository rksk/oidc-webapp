# Simple OIDC Webapp

This is a simple Java application to test OIDC flows.

## How to use the app
- Setup Java 11 and set PATH variable
- Close this Github repo and execute below command from the repo root
    ```
    mvn jetty:run -Djetty.http.port=9999
    ```
- Open `http://localhost:9999/simple/` in browser. You should see OIDC configs panel in the page returned by the browser.
- You have to use the value shown in the `Callback URI` field for the callback uri field of the application/service-provider
registered on your Identity Server.
- Fill filed such as clientId, clientSecret, scope accordingly and click on `Start OAuth Flow` button.

