package com.tallerwebi.dominio.Casino;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class CasinoController {

    @RequestMapping("/home")
    public ModelAndView mostrarHome() {
        String nombreVista = "home";
        return new ModelAndView(nombreVista);
    }
}