package net.rksk.client.oidc;

import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;

import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.HttpEntity;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import java.util.Map;

import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.ssl.SSLContextBuilder;

import javax.net.ssl.SSLContext;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;

public class Utils {

    /**
     * Performs a POST request to the specified URL with the given arguments.
     *
     * @param url  The target URL.
     * @param args The form parameters.
     * @return BffResponse containing body and status code.
     * @throws IOException If the request fails.
     */
    public static BffResponse doPost(String url, Map<String, String> args) throws IOException {
        try (CloseableHttpClient httpClient = createUnsafeHttpClient()) {
            return doPost(url, args, httpClient);
        }
    }

    static BffResponse doPost(String url, Map<String, String> args, CloseableHttpClient httpClient) throws IOException {
        String responseString = "";
        int statusCode = 0;

        List<NameValuePair> params = new ArrayList<>();
        if (args != null) {
            for (Map.Entry<String, String> entry : args.entrySet()) {
                params.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
            }
        }

        HttpPost httpPost = new HttpPost(url);
        httpPost.setHeader("Content-Type", "application/x-www-form-urlencoded");
        httpPost.setEntity(new UrlEncodedFormEntity(params));

        try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
            statusCode = response.getStatusLine().getStatusCode();
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                responseString = EntityUtils.toString(entity);
            }
        } catch (Exception e) {
            throw new IOException("Failed to execute POST request", e);
        }

        return new BffResponse(responseString, statusCode);
    }

    public static BffResponse doGet(String url, String accessToken) throws IOException {
        try (CloseableHttpClient httpClient = createUnsafeHttpClient()) {
            return doGet(url, accessToken, httpClient);
        }
    }

    static BffResponse doGet(String url, String accessToken, CloseableHttpClient httpClient) throws IOException {
        HttpGet httpGet = new HttpGet(url);
        httpGet.setHeader("Authorization", "Bearer " + accessToken);

        try (CloseableHttpResponse response = httpClient.execute(httpGet)) {
            int statusCode = response.getStatusLine().getStatusCode();
            HttpEntity entity = response.getEntity();
            String body = entity != null ? EntityUtils.toString(entity) : "";
            return new BffResponse(body, statusCode);
        } catch (Exception e) {
            throw new IOException("Failed to execute GET request", e);
        }
    }

    /**
     * Creates an unsafe HTTP client that trusts all certificates.
     * WARNING: This should not be used in production environments with sensitive
     * data.
     */
    public static CloseableHttpClient createUnsafeHttpClient() {
        try {
            SSLContext sslContext = SSLContextBuilder.create()
                    .loadTrustMaterial(null, (cert, authType) -> true)
                    .build();
            SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext);
            return HttpClients.custom().setSSLSocketFactory(sslsf).build();
        } catch (KeyManagementException | NoSuchAlgorithmException | KeyStoreException e) {
            throw new RuntimeException("Failed to create unsafe HTTP client", e);
        }
    }
}
