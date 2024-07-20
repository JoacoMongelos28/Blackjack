package com.tallerwebi.dominio.MercadoPago;

import com.mercadopago.MercadoPagoConfig;
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
public class MercadoPagoServicio implements IMercadoPagoServicio{

    private final String API_URL = "https://api.mercadopago.com/checkout/preferences";
    private final String ACCESS_TOKEN = "TEST-2591301662628250-112013-bef180cd58f4d64d50d056542d3f0d85-151386142";

    static {
        MercadoPagoConfig.setAccessToken("APP_USR-6516945332441912-062213-33e68d63ba4f0fdd7ffb8678d2be0fa4-1867816013");
    }

    @Override
    @Transactional
    public String pagarDeposito(Double saldo) throws IOException {
        String apiKey = "APP_USR-6516945332441912-062213-33e68d63ba4f0fdd7ffb8678d2be0fa4-1867816013";

        URL url = new URL("https://api.mercadopago.com/checkout/preferences");

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

        JSONObject jsonBody = new JSONObject();
        jsonBody.put("items", new JSONObject[]{item});

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