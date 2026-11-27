package com.reservatech.api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Tabela "notificacoes": registro dos e-mails de confirmacao, lembrete e cancelamento.
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "notificacoes")
public class Notificacao {

    public static final String TIPO_CONFIRMACAO = "confirmacao";
    public static final String TIPO_LEMBRETE = "lembrete";
    public static final String TIPO_CANCELAMENTO = "cancelamento";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;

    @Column(nullable = false, length = 20)
    private String tipo;

    @Column(name = "enviado_em", nullable = false)
    private LocalDateTime enviadoEm = LocalDateTime.now();

    public Notificacao(Reserva reserva, String tipo) {
        this.reserva = reserva;
        this.tipo = tipo;
    }

}
