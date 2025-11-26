# Simple OIDC Webapp

This is a simple Java application to test OIDC flows.

## How to use the app
- Set up Java 11 and set the PATH variable
- Clone this GitHub repo and execute the command below from the repo root
    ```
    mvn jetty:run -Djetty.http.port=9999
    ```
- Open `http://localhost:9999/` in the browser. You should see the OIDC configs panel in the page returned by the browser.
- You have to use the value shown in the `Callback URI` field for the callback URI field of the application/service-provider
registered on your Identity Server.
- Fill in fields such as clientId, clientSecret, and scope accordingly, and click on the  `Start OAuth Flow` button.

