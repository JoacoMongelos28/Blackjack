package com.tallerwebi.infraestructura;

import com.tallerwebi.dominio.Jugador.Jugador;
import com.tallerwebi.dominio.Login.ILoginRepositorio;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

@Repository
public class LoginRepositorio implements ILoginRepositorio {

    private SessionFactory sessionFactory;

    public LoginRepositorio(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public Jugador obtenerJugadorPorEmailYContrasenia(String email, String contrasenia) {
        return (Jugador) sessionFactory.getCurrentSession().createCriteria(Jugador.class)
                .add(Restrictions.eq("email", email))
                .add(Restrictions.eq("contrasenia", contrasenia))
                .uniqueResult();
    }
}