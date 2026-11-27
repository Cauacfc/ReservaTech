package com.reservatech.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reservatech.api.dto.MesaRequest;
import com.reservatech.api.dto.MesaResponse;
import com.reservatech.api.service.MesaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/mesas")
public class MesaController {

    private final MesaService mesaService;

    public MesaController(MesaService mesaService) {
        this.mesaService = mesaService;
    }

    @PutMapping("/{id}") // UPDATE -> altera uma mesa.
    public MesaResponse atualizar(@PathVariable Long id, @Valid @RequestBody MesaRequest dados) {
        return mesaService.atualizar(id, dados);
    }

    @DeleteMapping("/{id}") // DELETE -> remove uma mesa sem reservas.
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        mesaService.excluir(id);
    }

}
