package com.tallerwebi.dominio.MercadoPago;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.io.OutputStream;
import java.net.URL;
import org.json.JSONObject;
import org.springframework.transaction.annotation.Transactional;

@Service
@PropertySource("classpath:application.properties")
public class MercadoPagoServicio implements IMercadoPagoServicio{

    @Value("${mercadopago.api.key}")
    private String apiKey;

    @Value("${mercadopago.api.url}")
    private String apiUrl;

    @Transactional
    public String pagarDeposito(Double saldo) throws IOException {
        URL url = new URL(apiUrl);

        // Configura la conexión HTTP
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Authorization", "Bearer " + apiKey);
        con.setDoOutput(true);

        // Construye el JSON para enviar a Mercado Pago
        JSONObject item = new JSONObject();
        item.put("title", "Deposito Casino");
        item.put("description", "Servicio del Casino");
        item.put("category_id", "saldo");
        item.put("quantity", 1);
        item.put("currency_id", "ARS");
        item.put("unit_price", saldo);

        // Configura las URLs de retorno
        JSONObject backUrls = new JSONObject();
        backUrls.put("success", "http://localhost:8080/depositar?payment=success&saldo=" + saldo);

        JSONObject jsonBody = new JSONObject();
        jsonBody.put("items", new JSONObject[]{item});
        jsonBody.put("back_urls", backUrls);
        jsonBody.put("auto_return", "approved");

        // Envia la solicitud a Mercado Pago
        try (OutputStream os = con.getOutputStream()) {
            byte[] input = jsonBody.toString().getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        // Lee la respuesta de Mercado Pago
        try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }

            // Parsea la respuesta JSON
            JSONObject jsonResponse = new JSONObject(response.toString());

            // Obtiene el ID de preferencia de la respuesta y forma la URL de redirección
            String preferenceId = jsonResponse.getString("id");
            return "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=" + preferenceId;
        }
    }
}