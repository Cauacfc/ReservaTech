package com.reservatech.api.dto;

import com.reservatech.api.model.Usuario;

public record UsuarioResponse(Long id, String nome, String email, String telefone, String tipo) {

    public static UsuarioResponse de(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail(), u.getTelefone(), u.getTipo());
    }

}
