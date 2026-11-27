package com.reservatech.api.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ReservaRequest(
        @NotNull(message = "O cliente é obrigatório.")
        Long clienteId,

        @NotNull(message = "A mesa é obrigatória.")
        Long mesaId,

        @NotNull(message = "A data é obrigatória.")
        LocalDate dataReserva,

        @NotNull(message = "O horário é obrigatório.")
        LocalTime horario,

        @NotNull(message = "O número de pessoas é obrigatório.")
        @Positive(message = "O número de pessoas deve ser maior que zero.")
        Integer numeroPessoas) {
}
