package com.tallerwebi.dominio.Login;

import com.tallerwebi.dominio.Jugador.Jugador;

public interface ILoginRepositorio {
    Jugador obtenerJugadorPorEmailYContrasenia(String email, String contrasenia);
}
