package com.reservatech.api.dto;

import java.time.LocalDate;
import java.util.List;

public record RelatorioResponse(
        Long restauranteId,
        LocalDate inicio,
        LocalDate fim,
        long totalReservas,
        long confirmadas,
        long pendentes,
        long canceladas,
        long mesasTotal,
        List<RelatorioDia> porDia) {

    public record RelatorioDia(LocalDate data, long total, long confirmadas, long pendentes, long canceladas) {
    }

}
