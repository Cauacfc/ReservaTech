package com.reservatech.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Tabela "mesas": mesas de cada restaurante, com capacidade e localizacao.
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "mesas", uniqueConstraints = @UniqueConstraint(name = "uq_mesa_numero", columnNames = { "restaurante_id", "numero" }))
public class Mesa {

    public static final String LOCAL_INTERNA = "interna";
    public static final String LOCAL_EXTERNA = "externa";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "restaurante_id", nullable = false)
    private Restaurante restaurante;

    @Column(nullable = false)
    private Integer numero;

    @Column(nullable = false)
    private Integer capacidade;

    @Column(nullable = false, length = 20)
    private String localizacao = LOCAL_INTERNA;

    public Mesa(Restaurante restaurante, Integer numero, Integer capacidade, String localizacao) {
        this.restaurante = restaurante;
        this.numero = numero;
        this.capacidade = capacidade;
        this.localizacao = localizacao;
    }

}
