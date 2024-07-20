package com.tallerwebi.dominio.Casino;

import com.tallerwebi.dominio.Jugador.Jugador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CasinoServicio implements ICasinoServicio{

    private ICasinoRepositorio casinoRepositorio;

    @Autowired
    public CasinoServicio(ICasinoRepositorio casinoRepositorio) {
        this.casinoRepositorio = casinoRepositorio;
    }

    @Override
    @Transactional
    public Jugador obtenerJugadorPorId(Integer idJugador) {
        return this.casinoRepositorio.obtenerJugadorPorSuId(idJugador);
    }

    @Override
    @Transactional
    public void cargarSaldo(Jugador jugadorActual, Double saldo) {
        Jugador jugadorObtenido = this.casinoRepositorio.obtenerJugadorPorSuId(jugadorActual.getIdJugador());
        Double saldoActualizado = jugadorObtenido.getSaldo() + saldo;
        jugadorObtenido.setSaldo(saldoActualizado);
        this.casinoRepositorio.actualizarJugador(jugadorObtenido);
    }
}