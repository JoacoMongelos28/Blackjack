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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;
import java.io.IOException;

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
    public ModelAndView mostrarHome(HttpSession session) {
        String nombreVista = "home";
        ModelMap model = new ModelMap();
        Boolean estadoDelJugador = (Boolean) session.getAttribute("estaLogueado");

        if (estadoDelJugador == null) {
            estadoDelJugador = false;
            session.setAttribute("estaLogueado", estadoDelJugador);
        }

        if (estadoDelJugador) {
            Integer idJugador = (Integer) session.getAttribute("idJugador");
            Jugador jugadorObtenido = casinoServicio.obtenerJugadorPorId(idJugador);
            model.put("saldoJugador", jugadorObtenido.getSaldo());
            model.put("nombreUsuario", jugadorObtenido.getUsuario());
        }

        model.put("jugador", new Jugador());
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

        Jugador jugadorObtenido = this.casinoServicio.obtenerJugadorPorId((Integer) session.getAttribute("idJugador"));

        if (jugadorObtenido != null) {
            model.put("saldoJugador", jugadorObtenido.getSaldo());
            model.put("nombreUsuario", jugadorObtenido.getUsuario());
        }

        model.put("estaLogueado", estadoDelJugador);

        return new ModelAndView(nombreVista, model);
    }

    @RequestMapping("/procesar-deposito")
    public ModelAndView procesarDeposito(@RequestParam("saldo") Double saldo, RedirectAttributes redirectAttributes) throws IOException {
        if (saldo == null || saldo < 0) {
            redirectAttributes.addFlashAttribute("error", "Saldo a depositar inválido");
            return new ModelAndView("redirect:/deposito");
        } else if (saldo < 500.0 | saldo > 2000000.0) {
            redirectAttributes.addFlashAttribute("error", "El limite de saldo a depositar es entre 500 y 2000000");
            return new ModelAndView("redirect:/deposito");
        }

        String url = mercadoPagoServicio.pagarDeposito(saldo);
        return new ModelAndView("redirect:" + url);
    }

    @RequestMapping(value = "/depositar", method = RequestMethod.GET)
    public ModelAndView cargarSaldoAlJugador(HttpSession session, @RequestParam(value = "payment", required = false) String payment, @RequestParam(value = "saldo", required = false) Double saldo) {
        ModelMap model = new ModelMap();

        try {
            if (payment.equals("success")) {
                Jugador jugadorActual = this.casinoServicio.obtenerJugadorPorId((Integer) session.getAttribute("idJugador"));
                this.casinoServicio.cargarSaldo(jugadorActual, saldo);
                return new ModelAndView("redirect:/deposito");
            }
            return new ModelAndView("redirect:/deposito");
        } catch (Exception e) {
            model.put("error", e.getMessage());
            return new ModelAndView("redirect:/home", model);
        }
    }

    @RequestMapping("/cerrar-sesion")
    public ModelAndView cerrarSesion(HttpSession session) {
        session.invalidate();
        return new ModelAndView("redirect:/home");
    }
}