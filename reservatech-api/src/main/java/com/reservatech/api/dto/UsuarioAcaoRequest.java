package com.reservatech.api.dto;

import jakarta.validation.constraints.NotNull;

// Corpo enviado ao cancelar ou confirmar uma reserva: quem esta fazendo a acao.
public record UsuarioAcaoRequest(@NotNull(message = "O usuário é obrigatório.") Long usuarioId) {
}
