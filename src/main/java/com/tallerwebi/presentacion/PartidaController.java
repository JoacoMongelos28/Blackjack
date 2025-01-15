package com.tallerwebi.presentacion;

import com.tallerwebi.dominio.Partida.IPartidaServicio;
import com.tallerwebi.dominio.Partida.Partida;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/partida")
public class PartidaController {

    private final IPartidaServicio partidaServicio;

    public PartidaController(IPartidaServicio partidaServicio) {
        this.partidaServicio = partidaServicio;
    }

    @PostMapping("/guardar")
    public ResponseEntity<String> guardarCartas(@RequestBody Partida partida) {
        Partida partidaGuardada = partidaServicio.buscarSiElJugadorTienePartidaPendiente(partida.getJugador().getIdJugador());
        System.out.println("PARTIDA ENCONTRADA Guardar " + partidaGuardada);
        if (partidaGuardada != null) {
            System.out.println("Partida no nula " + partidaGuardada);
            partidaServicio.borrarPartida(partidaGuardada);
            System.out.println(partida.getNumeroDeLaCartaDelCrupier());
            partidaServicio.guardar(partida);
            return ResponseEntity.ok("Partida guardada con éxito.");
        } else {
            System.out.println("Partida nula " + partida.getNumeroDeLaCartaDelCrupier());
            partidaServicio.guardar(partida);
            return ResponseEntity.ok("Ocurrió un error inesperado.");
        }
    }

    @GetMapping("/cargar")
    public ResponseEntity<Map<String, Object>> obtenerPartida(HttpSession session) {
        Partida partida = partidaServicio.buscarSiElJugadorTienePartidaPendiente((Integer) session.getAttribute("idJugador"));
        Map<String, Object> response = new HashMap<>();
        response.put("existe", partida != null);
        if (partida != null) {
            response.put("partida", partida);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/borrar")
    public void borrarPartida(HttpSession session) {
        Partida partida = partidaServicio.buscarSiElJugadorTienePartidaPendiente((Integer) session.getAttribute("idJugador"));
        System.out.println("PARTIDA ENCONTRADA Borrar " + partida);
        partidaServicio.borrarPartida(partida);
    }
}
