package net.rksk.client.oidc;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;

@WebServlet(name = "BFFServlet", urlPatterns = {"/bff"})
public class BFFServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HashMap<String, String> args = getRequestParamMap(req);
        args.remove("endpoint");
        if ("undefined".equals(args.get("client_secret"))) {
            args.remove("client_secret");
        }
        String[] response = Utils.doPost(req.getParameter("endpoint"), args);
        resp.setStatus(Integer.parseInt(response[1]));
        resp.setContentType("application/json");
        resp.getWriter().write(response[0]);
    }

    public static HashMap<String, String> getRequestParamMap(HttpServletRequest request) {
        HashMap<String, String> params = new HashMap<>();
        request.getParameterMap().forEach((key, values) -> params.put(key, values[0]));
        return params;
    }
}
