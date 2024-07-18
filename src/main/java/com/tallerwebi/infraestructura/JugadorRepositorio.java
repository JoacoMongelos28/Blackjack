package com.tallerwebi.infraestructura;

import com.tallerwebi.dominio.Jugador.IJugadorRepositorio;
import com.tallerwebi.dominio.Jugador.Jugador;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

@Repository
public class JugadorRepositorio implements IJugadorRepositorio {

    private final SessionFactory sessionFactory;

    public JugadorRepositorio(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public void guardarJugador(Jugador jugador) {
        this.sessionFactory.getCurrentSession().save(jugador);
    }
}