package com.tallerwebi.dominio.Cartas;

import com.tallerwebi.dominio.Enums.TipoPalo;

import javax.persistence.*;

@Entity
public class Carta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCarta;

    @Column(name = "numero")
    private String numero;

    @Column(name = "palo")
    private TipoPalo palo;

    public Carta() {

    }

    public Carta(String numero, TipoPalo palo) {
        this.numero = numero;
        this.palo = palo;
    }

    public Integer getIdCarta() {
        return idCarta;
    }

    public void setIdCarta(Integer idCarta) {
        this.idCarta = idCarta;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public TipoPalo getPalo() {
        return palo;
    }

    public void setPalo(TipoPalo palo) {
        this.palo = palo;
    }
}