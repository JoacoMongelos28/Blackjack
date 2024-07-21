package com.tallerwebi.presentacion;

import com.tallerwebi.dominio.Blackjack.IBlackjackServicio;
import com.tallerwebi.dominio.Cartas.Carta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/blackjack")
public class BlackjackController {

    private final IBlackjackServicio blackjackServicio;

    @Autowired
    public BlackjackController(IBlackjackServicio blackjackServicio) {
        this.blackjackServicio = blackjackServicio;
    }

    @GetMapping("/cartas")
    public List<Carta> obtenerTodasLasCartas() {
        return this.blackjackServicio.obtenerElMazoDeCartas();
    }

    @PostMapping("/actualizarSaldo")
    public ResponseEntity<?> actualizarSaldo(@RequestBody Map<String, Object> jugador, HttpSession session) {
        try {
            Integer idJugador = (Integer) session.getAttribute("idJugador");
            Double nuevoSaldo = ((Number) jugador.get("saldo")).doubleValue();
            this.blackjackServicio.actualizarNuevoSaldo(idJugador, nuevoSaldo);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al actualizar el saldo");
        }
    }
}