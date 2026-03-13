package net.rksk.client.oidc;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "BFFServlet", urlPatterns = { "/bff" })
public class BFFServlet extends HttpServlet {

    private static final String ENDPOINT_PARAM = "endpoint";
    private static final String CLIENT_SECRET_PARAM = "client_secret";

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Map<String, String> args = getRequestParamMap(req);
        args.remove(ENDPOINT_PARAM);
        if ("undefined".equals(args.get(CLIENT_SECRET_PARAM))) {
            args.remove(CLIENT_SECRET_PARAM);
        }

        String endpoint = req.getParameter(ENDPOINT_PARAM);
        if (endpoint == null || endpoint.isEmpty()) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing endpoint parameter");
            return;
        }

        BffResponse response = Utils.doPost(endpoint, args);
        resp.setStatus(response.getStatusCode());
        resp.setContentType("application/json");
        resp.getWriter().write(response.getBody());
    }

    public static Map<String, String> getRequestParamMap(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        request.getParameterMap().forEach((key, values) -> params.put(key, values[0]));
        return params;
    }
}
