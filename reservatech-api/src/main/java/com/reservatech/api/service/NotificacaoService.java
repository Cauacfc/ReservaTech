package com.reservatech.api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.reservatech.api.model.Notificacao;
import com.reservatech.api.model.NotificacaoRepository;
import com.reservatech.api.model.Reserva;

// US07 - registra cada notificacao na tabela "notificacoes" e simula o envio do e-mail no log.
// Para enviar e-mails de verdade, basta trocar o conteudo do metodo enviarEmail por um servico
// de e-mail (por exemplo, JavaMailSender).
@Service
public class NotificacaoService {

    private static final Logger log = LoggerFactory.getLogger(NotificacaoService.class);

    private final NotificacaoRepository notificacaoRepository;

    public NotificacaoService(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
    }

    public void registrar(Reserva reserva, String tipo) {
        notificacaoRepository.save(new Notificacao(reserva, tipo));
        enviarEmail(reserva, tipo);
    }

    public boolean jaEnviada(Reserva reserva, String tipo) {
        return notificacaoRepository.existsByReservaIdAndTipo(reserva.getId(), tipo);
    }

    private void enviarEmail(Reserva reserva, String tipo) {
        log.info("[e-mail simulado] {} para {} - reserva #{} em {} no dia {} às {}",
                tipo,
                reserva.getCliente().getEmail(),
                reserva.getId(),
                reserva.getMesa().getRestaurante().getNome(),
                reserva.getDataReserva(),
                reserva.getHorario());
    }

}
