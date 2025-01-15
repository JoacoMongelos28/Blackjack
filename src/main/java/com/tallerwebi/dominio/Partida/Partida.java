package com.tallerwebi.dominio.Partida;

import com.tallerwebi.dominio.Enums.TipoPalo;
import com.tallerwebi.dominio.Jugador.Jugador;

import javax.persistence.*;

@Entity
@Table(name = "partida")
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPartida")
    private Integer idPartida;

    @OneToOne
    @JoinColumn(name = "idJugador", referencedColumnName = "idJugador")
    private Jugador jugador;

    @Column(name = "numeroDeLaCartaDelCrupier")
    private String numeroDeLaCartaDelCrupier;

    @Column(name = "paloDeLaCartaDelCrupier")
    private TipoPalo paloDeLaCartaDelCrupier;

    @Column(name = "numeroDeLaCartaOcultaDelCrupier")
    private String numeroDeLaCartaOcultaDelCrupier;

    @Column(name = "paloDeLaCartaOcultaDelCrupier")
    private TipoPalo paloDeLaCartaOcultaDelCrupier;

    @Column(name = "numeroDeLaPrimeraCartaDelJugador")
    private String numeroDeLaPrimeraCartaDelJugador;

    @Column(name = "paloDeLaPrimeraCartaDelJugador")
    private TipoPalo paloDeLaPrimeraCartaDelJugador;

    @Column(name = "numeroDeLaSegundaCartaDelJugador")
    private String numeroDeLaSegundaCartaDelJugador;

    @Column(name = "paloDeLaSegundaCartaDelJugador")
    private TipoPalo paloDeLaSegundaCartaDelJugador;

    @Column(name = "apuesta")
    private Double apuesta;

    public Integer getIdPartida() {
        return idPartida;
    }

    public void setIdPartida(Integer idPartida) {
        this.idPartida = idPartida;
    }

    public Jugador getJugador() {
        return jugador;
    }

    public void setJugador(Jugador jugador) {
        this.jugador = jugador;
    }

    public String getNumeroDeLaCartaDelCrupier() {
        return numeroDeLaCartaDelCrupier;
    }

    public void setNumeroDeLaCartaDelCrupier(String numeroDeLaCartaDelCrupier) {
        this.numeroDeLaCartaDelCrupier = numeroDeLaCartaDelCrupier;
    }

    public TipoPalo getPaloDeLaCartaDelCrupier() {
        return paloDeLaCartaDelCrupier;
    }

    public void setPaloDeLaCartaDelCrupier(TipoPalo paloDeLaCartaDelCrupier) {
        this.paloDeLaCartaDelCrupier = paloDeLaCartaDelCrupier;
    }

    public String getNumeroDeLaCartaOcultaDelCrupier() {
        return numeroDeLaCartaOcultaDelCrupier;
    }

    public void setNumeroDeLaCartaOcultaDelCrupier(String numeroDeLaCartaOcultaDelCrupier) {
        this.numeroDeLaCartaOcultaDelCrupier = numeroDeLaCartaOcultaDelCrupier;
    }

    public TipoPalo getPaloDeLaCartaOcultaDelCrupier() {
        return paloDeLaCartaOcultaDelCrupier;
    }

    public void setPaloDeLaCartaOcultaDelCrupier(TipoPalo paloDeLaCartaOcultaDelCrupier) {
        this.paloDeLaCartaOcultaDelCrupier = paloDeLaCartaOcultaDelCrupier;
    }

    public String getNumeroDeLaPrimeraCartaDelJugador() {
        return numeroDeLaPrimeraCartaDelJugador;
    }

    public void setNumeroDeLaPrimeraCartaDelJugador(String numeroDeLaPrimeraCartaDelJugador) {
        this.numeroDeLaPrimeraCartaDelJugador = numeroDeLaPrimeraCartaDelJugador;
    }

    public TipoPalo getPaloDeLaPrimeraCartaDelJugador() {
        return paloDeLaPrimeraCartaDelJugador;
    }

    public void setPaloDeLaPrimeraCartaDelJugador(TipoPalo paloDeLaPrimeraCartaDelJugador) {
        this.paloDeLaPrimeraCartaDelJugador = paloDeLaPrimeraCartaDelJugador;
    }

    public String getNumeroDeLaSegundaCartaDelJugador() {
        return numeroDeLaSegundaCartaDelJugador;
    }

    public void setNumeroDeLaSegundaCartaDelJugador(String numeroDeLaSegundaCartaDelJugador) {
        this.numeroDeLaSegundaCartaDelJugador = numeroDeLaSegundaCartaDelJugador;
    }

    public TipoPalo getPaloDeLaSegundaCartaDelJugador() {
        return paloDeLaSegundaCartaDelJugador;
    }

    public void setPaloDeLaSegundaCartaDelJugador(TipoPalo paloDeLaSegundaCartaDelJugador) {
        this.paloDeLaSegundaCartaDelJugador = paloDeLaSegundaCartaDelJugador;
    }

    public Double getApuesta() {
        return apuesta;
    }

    public void setApuesta(Double apuesta) {
        this.apuesta = apuesta;
    }
}