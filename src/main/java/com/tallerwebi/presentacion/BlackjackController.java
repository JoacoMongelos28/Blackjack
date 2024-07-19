package com.tallerwebi.presentacion;

import com.tallerwebi.dominio.Blackjack.IBlackjackServicio;
import com.tallerwebi.dominio.Cartas.Carta;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/blackjack/cartas")
public class BlackjackController {

    private IBlackjackServicio blackjackServicio;

    public BlackjackController(IBlackjackServicio blackjackServicio) {
        this.blackjackServicio = blackjackServicio;
    }

    @GetMapping
    public List<Carta> obtenerTodasLasCartas() {
        return this.blackjackServicio.obtenerElMazoDeCartas();
    }
}