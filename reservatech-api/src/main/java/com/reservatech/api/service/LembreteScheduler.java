package com.reservatech.api.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.reservatech.api.model.Notificacao;
import com.reservatech.api.model.Reserva;
import com.reservatech.api.model.ReservaRepository;

// US07 - a cada minuto, envia o lembrete das reservas confirmadas que comecam em ate 2 horas.
@Component
public class LembreteScheduler {

    private static final Duration ANTECEDENCIA_LEMBRETE = Duration.ofHours(2);

    private final ReservaRepository reservaRepository;
    private final NotificacaoService notificacaoService;

    public LembreteScheduler(ReservaRepository reservaRepository, NotificacaoService notificacaoService) {
        this.reservaRepository = reservaRepository;
        this.notificacaoService = notificacaoService;
    }

    @Scheduled(fixedDelay = 60_000, initialDelay = 30_000)
    @Transactional
    public void enviarLembretes() {
        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime limite = agora.plus(ANTECEDENCIA_LEMBRETE);
        LocalDate hoje = agora.toLocalDate();

        for (Reserva reserva : reservaRepository.findByDataReservaBetweenAndStatus(hoje, limite.toLocalDate(),
                Reserva.STATUS_CONFIRMADA)) {
            boolean naJanela = reserva.inicio().isAfter(agora) && !reserva.inicio().isAfter(limite);
            if (naJanela && !notificacaoService.jaEnviada(reserva, Notificacao.TIPO_LEMBRETE)) {
                notificacaoService.registrar(reserva, Notificacao.TIPO_LEMBRETE);
            }
        }
    }

}
