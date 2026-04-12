package cristina.mastellaro.BE_Capstone.configuration;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.util.Map;

public class AWSHandler implements RequestHandler<Map<String, Object>, String> {
    @Override
    public String handleRequest(Map<String, Object> input, Context context) {
        return "Ciao HNRG! Il backend Java è online.";
    }
}
