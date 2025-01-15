package com.tallerwebi.infraestructura;

import com.tallerwebi.dominio.Partida.IPartidaRepositorio;
import com.tallerwebi.dominio.Partida.Partida;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class PartidaRepositorio implements IPartidaRepositorio {

    private final SessionFactory sessionFactory;

    public PartidaRepositorio(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public void guardarPartida(Partida partida) {
        this.sessionFactory.getCurrentSession().saveOrUpdate(partida);
    }

    @Override
    public void eliminarPartidaExistente(Partida partidaExistente) {
        Session session = this.sessionFactory.getCurrentSession();
        String hql = "delete from Partida where idPartida = :idPartida";
        Query query = session.createQuery(hql);
        query.setParameter("idPartida", partidaExistente.getIdPartida());
        query.executeUpdate();
    }

    @Override
    public Partida buscarPartidaPorIdDelJugador(Integer idJugador) {
        Session session = this.sessionFactory.getCurrentSession();
        String hql = "FROM Partida WHERE jugador.id = :idJugador";
        Query<Partida> query = session.createQuery(hql, Partida.class);
        query.setParameter("idJugador", idJugador);
        return query.uniqueResult();
    }
}
