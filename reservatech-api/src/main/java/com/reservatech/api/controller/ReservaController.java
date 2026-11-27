package com.reservatech.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reservatech.api.dto.ReservaRequest;
import com.reservatech.api.dto.ReservaResponse;
import com.reservatech.api.dto.UsuarioAcaoRequest;
import com.reservatech.api.service.ReservaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping // CREATE -> faz uma reserva.
    @ResponseStatus(HttpStatus.CREATED)
    public ReservaResponse criar(@Valid @RequestBody ReservaRequest dados) {
        return reservaService.criar(dados);
    }

    @GetMapping // READ -> reservas de um cliente.
    public List<ReservaResponse> listarDoCliente(@RequestParam Long clienteId) {
        return reservaService.listarDoCliente(clienteId);
    }

    @PutMapping("/{id}/cancelar")
    public ReservaResponse cancelar(@PathVariable Long id, @Valid @RequestBody UsuarioAcaoRequest dados) {
        return reservaService.cancelar(id, dados.usuarioId());
    }

    @PutMapping("/{id}/confirmar")
    public ReservaResponse confirmar(@PathVariable Long id, @Valid @RequestBody UsuarioAcaoRequest dados) {
        return reservaService.confirmar(id, dados.usuarioId());
    }

}
