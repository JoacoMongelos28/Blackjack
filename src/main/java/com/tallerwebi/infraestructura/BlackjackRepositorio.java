package com.tallerwebi.infraestructura;

import com.tallerwebi.dominio.Blackjack.IBlackjackRepositorio;
import com.tallerwebi.dominio.Cartas.Carta;
import com.tallerwebi.dominio.Jugador.Jugador;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BlackjackRepositorio implements IBlackjackRepositorio {

    private SessionFactory sessionFactory;

    public BlackjackRepositorio (SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public List<Carta> obtenerTodasLasCartas() {
        return this.sessionFactory.getCurrentSession().createQuery("FROM Carta", Carta.class).getResultList();
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