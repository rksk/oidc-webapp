package net.rksk.client.oidc;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.apache.http.HttpEntity;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;

class UtilsTest {

    @Test
    void testDoPostSuccess() throws IOException {
        // Arrange
        String url = "http://example.com/api";
        Map<String, String> args = new HashMap<>();
        args.put("key", "value");

        String expectedBody = "{\"success\":true}";
        int expectedStatus = 200;

        CloseableHttpClient mockClient = mock(CloseableHttpClient.class);
        CloseableHttpResponse mockResponse = mock(CloseableHttpResponse.class);
        StatusLine mockStatusLine = mock(StatusLine.class);
        HttpEntity mockEntity = mock(HttpEntity.class); // Standard mock

        when(mockClient.execute(any(HttpPost.class))).thenReturn(mockResponse);
        when(mockResponse.getStatusLine()).thenReturn(mockStatusLine);
        when(mockStatusLine.getStatusCode()).thenReturn(expectedStatus);
        when(mockResponse.getEntity()).thenReturn(mockEntity);
        // EntityUtils checks content type, if null it uses default.
        when(mockEntity.getContentType()).thenReturn(null);
        when(mockEntity.getContent()).thenReturn(new java.io.ByteArrayInputStream(expectedBody.getBytes()));

        // Act
        BffResponse response = Utils.doPost(url, args, mockClient);

        // Assert
        assertEquals(expectedStatus, response.getStatusCode());
        assertEquals(expectedBody, response.getBody());
    }
}
