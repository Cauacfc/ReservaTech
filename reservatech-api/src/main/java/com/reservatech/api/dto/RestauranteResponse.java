package com.reservatech.api.dto;

import com.reservatech.api.model.Restaurante;

public record RestauranteResponse(Long id, Long gerenteId, String nome, String endereco, String cidade,
        String telefone) {

    public static RestauranteResponse de(Restaurante r) {
        return new RestauranteResponse(r.getId(), r.getGerente().getId(), r.getNome(), r.getEndereco(),
                r.getCidade(), r.getTelefone());
    }

}
