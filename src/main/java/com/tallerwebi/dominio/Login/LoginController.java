package com.tallerwebi.dominio.Login;

import com.tallerwebi.dominio.Excepciones.UsuarioInvalidoException;
import com.tallerwebi.dominio.Jugador.Jugador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@Controller
public class LoginController {

    private ILoginServicio loginServicio;

    @Autowired
    public LoginController(ILoginServicio loginServicio) {
        this.loginServicio = loginServicio;
    }

    @RequestMapping("login")
    public ModelAndView mostrarLogin() {
        String nombreVista = "login";
        ModelMap model = new ModelMap();
        model.put("jugador", new Jugador());
        return new ModelAndView(nombreVista, model);
    }

    @RequestMapping(value = "/loguear", method = RequestMethod.POST)
    public ModelAndView loguearJugador(@ModelAttribute ("jugador") Jugador jugador, HttpSession session) {
        ModelMap model = new ModelMap();

        try {
            if (jugador == null) {
                throw new UsuarioInvalidoException("Ocurrio un error al loguearse. Intente nuevamente");
            }

            Jugador jugadorObtenido = this.loginServicio.obtenerJugador(jugador);

            if (jugadorObtenido == null) {
                model.put("error", true);
                return new ModelAndView("login", model);
            }

            session.setAttribute("idJugador", jugadorObtenido);
            return new ModelAndView("redirect:/home");

        } catch (UsuarioInvalidoException e) {
            model.put("error", e.getMessage());
            return new ModelAndView("redirect:/error", model);
        }
    }
}