package com.reservatech.api.dto;

import java.time.LocalDate;
import java.util.List;

// Dados da tela "Painel do restaurante": indicadores e reservas do dia.
public record PainelResponse(
        LocalDate data,
        long reservasHoje,
        long mesasTotal,
        long mesasLivres,
        int ocupacao,
        List<ReservaResponse> reservas) {
}
