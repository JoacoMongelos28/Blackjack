package com.tallerwebi.dominio.Login;

import com.tallerwebi.dominio.Jugador.Jugador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoginServicio implements ILoginServicio {

    private ILoginRepositorio loginRepositorio;

    @Autowired
    public LoginServicio(ILoginRepositorio loginRepositorio) {
        this.loginRepositorio = loginRepositorio;
    }

    @Override
    @Transactional
    public Jugador obtenerJugador(Jugador jugador) {
        return this.loginRepositorio.obtenerJugadorPorEmailYContrasenia(jugador.getEmail(), jugador.getContrasenia());
    }
}