package com.tallerwebi.infraestructura;

import com.tallerwebi.dominio.Jugador.IJugadorRepositorio;
import com.tallerwebi.dominio.Jugador.Jugador;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
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

    @Override
    public Jugador validarEmailJugador(Jugador jugador) {
        Session session = this.sessionFactory.getCurrentSession();
        String hql = "FROM Jugador WHERE email = :email";
        Query<Jugador> query = session.createQuery(hql, Jugador.class);
        query.setParameter("email", jugador.getEmail());
        return query.uniqueResult();
    }

    @Override
    public Jugador validarUsuarioJugador(Jugador jugador) {
        Session session = this.sessionFactory.getCurrentSession();
        String hql = "FROM Jugador WHERE usuario = :usuario";
        Query<Jugador> query = session.createQuery(hql, Jugador.class);
        query.setParameter("usuario", jugador.getUsuario());
        return query.uniqueResult();
    }

    @Override
    public Jugador validarDniJugador(Jugador jugador) {
        Session session = this.sessionFactory.getCurrentSession();
        String hql = "FROM Jugador WHERE dni = :dni";
        Query<Jugador> query = session.createQuery(hql, Jugador.class);
        query.setParameter("dni", jugador.getDni());
        return query.uniqueResult();
    }

}