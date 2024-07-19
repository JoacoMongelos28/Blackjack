package com.tallerwebi.infraestructura;

import com.tallerwebi.dominio.Blackjack.IBlackjackRepositorio;
import com.tallerwebi.dominio.Cartas.Carta;
import org.hibernate.SessionFactory;
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
}