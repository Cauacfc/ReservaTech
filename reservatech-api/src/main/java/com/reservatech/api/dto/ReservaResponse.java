package com.reservatech.api.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.reservatech.api.model.Reserva;

public record ReservaResponse(
        Long id,
        Long clienteId,
        String clienteNome,
        Long mesaId,
        Integer mesaNumero,
        Integer capacidade,
        String localizacao,
        Long restauranteId,
        String restauranteNome,
        LocalDate dataReserva,
        LocalTime horario,
        Integer numeroPessoas,
        String status) {

    public static ReservaResponse de(Reserva r) {
        return new ReservaResponse(
                r.getId(),
                r.getCliente().getId(),
                r.getCliente().getNome(),
                r.getMesa().getId(),
                r.getMesa().getNumero(),
                r.getMesa().getCapacidade(),
                r.getMesa().getLocalizacao(),
                r.getMesa().getRestaurante().getId(),
                r.getMesa().getRestaurante().getNome(),
                r.getDataReserva(),
                r.getHorario(),
                r.getNumeroPessoas(),
                r.getStatus());
    }

}
