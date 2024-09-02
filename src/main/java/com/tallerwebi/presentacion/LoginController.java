package com.tallerwebi.presentacion;

import com.tallerwebi.dominio.Excepciones.UsuarioInvalidoException;
import com.tallerwebi.dominio.Jugador.Jugador;
import com.tallerwebi.dominio.Login.ILoginServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpSession;

@Controller
public class LoginController {

    private final ILoginServicio loginServicio;

    @Autowired
    public LoginController(ILoginServicio loginServicio) {
        this.loginServicio = loginServicio;
    }

    @RequestMapping(value = "/loguear", method = RequestMethod.POST)
    public ResponseEntity<String> loguearJugador(@ModelAttribute("jugador") Jugador jugador, HttpSession session) {
        try {
            if (jugador == null) {
                throw new UsuarioInvalidoException("Ocurrió un error al loguearse. Intente nuevamente");
            }

            Jugador jugadorObtenido = this.loginServicio.obtenerJugador(jugador);

            if (jugadorObtenido == null) {
                return ResponseEntity.ok("Email o contraseña incorrecta");
            }

            session.setAttribute("idJugador", jugadorObtenido.getIdJugador());
            session.setAttribute("estaLogueado", true);
            return ResponseEntity.ok("success");

        } catch (UsuarioInvalidoException e) {
            return ResponseEntity.ok("Ocurrió un error: " + e.getMessage());
        }
    }
}