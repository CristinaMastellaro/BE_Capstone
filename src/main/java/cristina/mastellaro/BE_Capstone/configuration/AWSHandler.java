package cristina.mastellaro.BE_Capstone.configuration;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.util.HashMap;
import java.util.Map;

public class AWSHandler implements RequestHandler<Map<String, Object>, Map<String, Object>> {

    @Override
    public Map<String, Object> handleRequest(Map<String, Object> input, Context context) {
        Map<String, Object> response = new HashMap<>();

        // Imposta gli header CORS manualmente qui per sicurezza
        Map<String, String> headers = new HashMap<>();
        headers.put("Access-Control-Allow-Origin", "https://capstonemusicapp.netlify.app");
        headers.put("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        headers.put("Access-Control-Allow-Headers", "Content-Type,Authorization");
        headers.put("Access-Control-Allow-Credentials", "true");

        // 2. Se è una richiesta OPTIONS (Preflight), rispondi subito OK senza logica
        if (input.toString().contains("OPTIONS")) {
            Map<String, Object> preflightResponse = new HashMap<>();
            preflightResponse.put("statusCode", 200);
            preflightResponse.put("headers", headers);
            return preflightResponse;
        }

        response.put("isBase64Encoded", false);
        response.put("statusCode", 200);
        response.put("headers", headers);
        response.put("body", "{\"message\": \"Ciao HNRG! Il backend Java è online.\"}");

        return response;
    }
}