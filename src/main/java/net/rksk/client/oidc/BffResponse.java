package net.rksk.client.oidc;

/**
 * Represents the response from the BFF (Backend for Frontend) request.
 */
public class BffResponse {
    private final String body;
    private final int statusCode;

    public BffResponse(String body, int statusCode) {
        this.body = body;
        this.statusCode = statusCode;
    }

    public String getBody() {
        return body;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
