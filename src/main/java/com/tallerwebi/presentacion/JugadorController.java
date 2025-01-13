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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;

@Controller
public class JugadorController {

    private final IJugadorServicio jugadorServicio;

    @Autowired
    public JugadorController(IJugadorServicio jugadorServicio) {
        this.jugadorServicio = jugadorServicio;
    }

    @RequestMapping(value = "/registrarse")
    public ModelAndView mostrarFormularioDeRegistro(HttpSession session, @ModelAttribute("jugador") Jugador jugador) {
        Boolean estadoDelJugador = (Boolean) session.getAttribute("estaLogueado");

        if (Boolean.TRUE.equals(estadoDelJugador)) {
            return new ModelAndView("redirect:/home");
        }

        String nombreVista = "registrarse";
        ModelMap model = new ModelMap();

        if (jugador == null || jugador.getEmail() == null) {
            jugador = new Jugador();
        }

        model.addAttribute("jugador", jugador);
        return new ModelAndView(nombreVista, model);
    }

    @RequestMapping(value = "/registrar")
    public ModelAndView registrarJugador(@ModelAttribute("jugador") Jugador jugador, RedirectAttributes redirectAttributes) {
        ModelMap model = new ModelMap();

        try {
            if (jugador == null) {
                throw new UsuarioInvalidoException("Hubo un error al registrar el usuario. Intente de nuevo");
            }

            Boolean emailExiste = this.jugadorServicio.validarEmailNuevoJugador(jugador);
            Boolean usuarioExiste = this.jugadorServicio.validarUsuarioNuevoJugador(jugador);
            Boolean dniExiste = this.jugadorServicio.validarDniNuevoJugador(jugador);

            if (!emailExiste && !usuarioExiste && !dniExiste) {
                this.jugadorServicio.registrarJugador(jugador);
                return new ModelAndView("redirect:/home");
            } else if (usuarioExiste) {
                redirectAttributes.addFlashAttribute("jugador", jugador);
                redirectAttributes.addFlashAttribute("errorUsuario", "Ya existe un usuario con el mismo nombre de usuario");
                return new ModelAndView("redirect:/registrarse");
            } else if (emailExiste) {
                redirectAttributes.addFlashAttribute("jugador", jugador);
                redirectAttributes.addFlashAttribute("errorEmail", "Ya existe un usuario con el mismo email");
                return new ModelAndView("redirect:/registrarse");
            } else {
                redirectAttributes.addFlashAttribute("jugador", jugador);
                redirectAttributes.addFlashAttribute("errorDni", "Ya existe un usuario con el mismo DNI");
                return new ModelAndView("redirect:/registrarse");
            }
        } catch (UsuarioInvalidoException e) {
            redirectAttributes.addFlashAttribute("error", "Ocurrio un problema al registrar el usuario. Por favor intente mas tarde");
            return new ModelAndView("redirect:/registrarse");
        }
    }
}