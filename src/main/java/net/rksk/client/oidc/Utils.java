package net.rksk.client.oidc;

import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.HttpEntity;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.ssl.SSLContextBuilder;

import javax.net.ssl.SSLContext;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;



public class Utils {

    public static String[] doPost(String url, HashMap<String, String> args) {
        String responseString = "";
        int statusCode = 0;

        List<NameValuePair> params = new ArrayList<>();
        for (Map.Entry<String, String> entry : args.entrySet()) {
            params.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
        }
        CloseableHttpResponse response = null;
        try {

            // Create URI with parameters
            URIBuilder builder = new URIBuilder(url);
//            builder.addParameters(params);
            URI uri = builder.build();

            // Create HTTP client and POST request
            CloseableHttpClient httpClient = createUnsafeHttpClient();
            HttpPost httpPost = new HttpPost(uri);

            // Set content type
            httpPost.setHeader("Content-Type", "application/x-www-form-urlencoded");

            // Add the form data
            httpPost.setEntity(new UrlEncodedFormEntity(params));

            // Execute the request
            response = httpClient.execute(httpPost);

            statusCode = response.getStatusLine().getStatusCode();
            if (statusCode >= 200 && statusCode < 500) {
                HttpEntity entity = response.getEntity();
                responseString = EntityUtils.toString(entity);
            } else {
                // Handle error
                System.err.println("Error: Status code " + statusCode);
            }
        } catch (Throwable e) {
            e.printStackTrace();
        } finally {
            if (response != null) {
                try {
                    response.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
//        System.out.println("URL: " + url);
//        System.out.println("Status Code: " + statusCode);
//        System.out.println("Response String: " + responseString);
        return new String[]{responseString, String.valueOf(statusCode)};
    }

    public static CloseableHttpClient createUnsafeHttpClient() throws KeyManagementException, NoSuchAlgorithmException, KeyStoreException {
        SSLContext sslContext = SSLContextBuilder.create()
                .loadTrustMaterial(null, (cert, authType) -> true) // Trust all certificates
                .build();
        SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext);
        return HttpClients.custom().setSSLSocketFactory(sslsf).build();
    }
}
