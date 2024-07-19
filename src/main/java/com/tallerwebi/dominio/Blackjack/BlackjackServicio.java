package com.tallerwebi.dominio.Blackjack;

import com.tallerwebi.dominio.Cartas.Carta;
import com.tallerwebi.infraestructura.BlackjackRepositorio;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BlackjackServicio implements IBlackjackServicio {

    private BlackjackRepositorio blackjackRepositorio;

    public BlackjackServicio(BlackjackRepositorio blackjackRepositorio) {
        this.blackjackRepositorio = blackjackRepositorio;
    }

    @Override
    @Transactional
    public List<Carta> obtenerElMazoDeCartas() {
        return this.blackjackRepositorio.obtenerTodasLasCartas();
    }
}