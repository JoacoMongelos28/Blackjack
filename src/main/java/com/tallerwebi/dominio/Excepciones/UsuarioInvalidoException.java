package com.tallerwebi.dominio.Excepciones;

public class UsuarioInvalidoException extends Exception {

    public UsuarioInvalidoException(String mensaje) {
        super(mensaje);
    }
}