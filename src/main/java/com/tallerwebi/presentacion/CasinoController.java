package com.tallerwebi.presentacion;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@Controller
public class CasinoController {

    @RequestMapping("/home")
    public ModelAndView mostrarHome() {
        String nombreVista = "home";
        return new ModelAndView(nombreVista);
    }

    @RequestMapping("/blackjack")
    public ModelAndView mostrarJuegosDeBlackjack(HttpSession session) {
        String nombreVista = "blackjack";
        ModelMap model = new ModelMap();
        Boolean estadoDelJugador = (Boolean) session.getAttribute("estaLogueado");

        if (estadoDelJugador == null) {
            estadoDelJugador = false;
            session.setAttribute("estaLogueado", estadoDelJugador);
        }

        model.put("estaLogueado", estadoDelJugador);
        return new ModelAndView(nombreVista, model);
    }

    @RequestMapping("/mesa-blackjack")
    public ModelAndView mostrarMesaBlackjack() {
        return new ModelAndView("mesa-blackjack");
    }
}