package com.reservatech.api.dto;

import com.reservatech.api.model.Mesa;

public record MesaResponse(Long id, Long restauranteId, Integer numero, Integer capacidade, String localizacao) {

    public static MesaResponse de(Mesa m) {
        return new MesaResponse(m.getId(), m.getRestaurante().getId(), m.getNumero(), m.getCapacidade(),
                m.getLocalizacao());
    }

}
