package com.tallerwebi.presentacion;

import com.tallerwebi.dominio.Casino.ICasinoServicio;
import com.tallerwebi.dominio.Jugador.Jugador;
import com.tallerwebi.dominio.MercadoPago.IMercadoPagoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@Controller
public class CasinoController {

    private final IMercadoPagoServicio mercadoPagoServicio;
    private final ICasinoServicio casinoServicio;

    @Autowired
    public CasinoController(IMercadoPagoServicio mercadoPagoServicio, ICasinoServicio casinoServicio) {
        this.mercadoPagoServicio = mercadoPagoServicio;
        this.casinoServicio = casinoServicio;
    }

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
    public ModelAndView mostrarMesaBlackjack(HttpSession session) {
        ModelMap model = new ModelMap();
        Jugador jugadorActual = this.casinoServicio.obtenerJugadorPorId((Integer) session.getAttribute("idJugador"));
        Double saldoDelJugador = jugadorActual.getSaldo();
        model.put("saldo", saldoDelJugador);
        model.put("estaLogueado", session.getAttribute("estaLogueado"));
        return new ModelAndView("mesa-blackjack", model);
    }

    @RequestMapping("/deposito")
    public ModelAndView formDepositar(HttpSession session) {
        String nombreVista = "deposito";
        ModelMap model = new ModelMap();

        Boolean estadoDelJugador = (Boolean) session.getAttribute("estaLogueado");
        if (estadoDelJugador == null) {
            estadoDelJugador = false;
            session.setAttribute("estaLogueado", estadoDelJugador);
        }

        model.put("estaLogueado", estadoDelJugador);
        return new ModelAndView(nombreVista, model);
    }

    @RequestMapping(value = "/depositar", method = RequestMethod.POST)
    public ModelAndView cargarSaldoAlJugador(@RequestParam("saldo") Double saldo, HttpSession session) {
        ModelMap model = new ModelMap();

        if (saldo == null || saldo < 0) {
            model.put("error", "Saldo a depositar invalido");
            return new ModelAndView("redirect:/deposito", model);
        }

        try {
            String url = mercadoPagoServicio.pagarDeposito(saldo);
            Jugador jugadorActual = this.casinoServicio.obtenerJugadorPorId((Integer) session.getAttribute("idJugador"));
            this.casinoServicio.cargarSaldo(jugadorActual, saldo);
            return new ModelAndView("redirect:" + url);
        } catch (Exception e) {
            model.put("error", e.getMessage());
            return new ModelAndView("redirect:/home", model);
        }
    }
}