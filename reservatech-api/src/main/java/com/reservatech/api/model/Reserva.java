package com.reservatech.api.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Tabela "reservas": liga um cliente a uma mesa em uma data e horario.
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "reservas")
public class Reserva {

    public static final String STATUS_PENDENTE = "pendente";
    public static final String STATUS_CONFIRMADA = "confirmada";
    public static final String STATUS_CANCELADA = "cancelada";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "mesa_id", nullable = false)
    private Mesa mesa;

    @Column(name = "data_reserva", nullable = false)
    private LocalDate dataReserva;

    @Column(nullable = false)
    private LocalTime horario;

    @Column(name = "numero_pessoas", nullable = false)
    private Integer numeroPessoas;

    @Column(nullable = false, length = 20)
    private String status = STATUS_PENDENTE;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    public Reserva(Usuario cliente, Mesa mesa, LocalDate dataReserva, LocalTime horario, Integer numeroPessoas,
            String status) {
        this.cliente = cliente;
        this.mesa = mesa;
        this.dataReserva = dataReserva;
        this.horario = horario;
        this.numeroPessoas = numeroPessoas;
        this.status = status;
    }

    @Transient
    public LocalDateTime inicio() {
        return LocalDateTime.of(dataReserva, horario);
    }

}
