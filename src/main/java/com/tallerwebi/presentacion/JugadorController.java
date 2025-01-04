package com.tallerwebi.presentacion;

import com.tallerwebi.dominio.Excepciones.UsuarioInvalidoException;
import com.tallerwebi.dominio.Jugador.IJugadorServicio;
import com.tallerwebi.dominio.Jugador.Jugador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@Controller
public class JugadorController {

    private final IJugadorServicio jugadorServicio;

    @Autowired
    public JugadorController(IJugadorServicio jugadorServicio) {
        this.jugadorServicio = jugadorServicio;
    }

    @RequestMapping(value = "/registrarse")
    public ModelAndView mostrarFormularioDeRegistro(HttpSession session) {
        Boolean estadoDelJugador = (Boolean) session.getAttribute("estaLogueado");

        if (Boolean.TRUE.equals(estadoDelJugador)) {
            return new ModelAndView("redirect:/home");
        }

        String nombreVista = "registrarse";
        ModelMap model = new ModelMap();
        model.put("jugador", new Jugador());
        return new ModelAndView(nombreVista, model);
    }

    @RequestMapping(value = "/registrar")
    public ModelAndView registrarJugador(@ModelAttribute("jugador") Jugador jugador) {
        ModelMap model = new ModelMap();

        try {
            if (jugador == null) {
                throw new UsuarioInvalidoException("Hubo un error al registrar el usuario. Intente de nuevo");
            }

            this.jugadorServicio.registrarJugador(jugador);
            return new ModelAndView("redirect:/home");
        } catch (UsuarioInvalidoException e) {
            model.put("error", e.getMessage());
            return new ModelAndView("redirect:/error", model);
        }
    }
}