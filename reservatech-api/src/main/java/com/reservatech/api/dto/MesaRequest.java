package com.reservatech.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public record MesaRequest(
        @NotNull(message = "O número da mesa é obrigatório.")
        @Positive(message = "O número da mesa deve ser maior que zero.")
        Integer numero,

        @NotNull(message = "A capacidade é obrigatória.")
        @Positive(message = "A capacidade deve ser maior que zero.")
        Integer capacidade,

        @NotBlank(message = "A localização é obrigatória.")
        @Pattern(regexp = "interna|externa", message = "A localização deve ser 'interna' ou 'externa'.")
        String localizacao) {
}
