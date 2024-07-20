package com.tallerwebi.dominio.MercadoPago;

import java.io.IOException;

public interface IMercadoPagoServicio {
    String pagarDeposito(Double saldo) throws IOException;
}
