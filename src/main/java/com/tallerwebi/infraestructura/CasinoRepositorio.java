package com.tallerwebi.infraestructura;

import com.tallerwebi.dominio.Casino.ICasinoRepositorio;
import com.tallerwebi.dominio.Jugador.Jugador;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

@Repository
public class CasinoRepositorio implements ICasinoRepositorio {

    private final SessionFactory sessionFactory;

    public CasinoRepositorio(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public Jugador obtenerJugadorPorSuId(Integer idJugador) {
        return (Jugador) sessionFactory.getCurrentSession().createCriteria(Jugador.class).add(Restrictions.eq("idJugador", idJugador)).uniqueResult();
    }

    @Override
    public void actualizarJugador(Jugador jugadorObtenido) {
        this.sessionFactory.getCurrentSession().saveOrUpdate(jugadorObtenido);
    }
}