package com.reservatech.api.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reservatech.api.dto.MesaRequest;
import com.reservatech.api.dto.MesaResponse;
import com.reservatech.api.dto.PainelResponse;
import com.reservatech.api.dto.RelatorioResponse;
import com.reservatech.api.dto.RestauranteRequest;
import com.reservatech.api.dto.RestauranteResponse;
import com.reservatech.api.service.MesaService;
import com.reservatech.api.service.RestauranteService;
import com.reservatech.api.service.ReservaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/restaurantes")
public class RestauranteController {

    private final RestauranteService restauranteService;
    private final MesaService mesaService;
    private final ReservaService reservaService;

    public RestauranteController(RestauranteService restauranteService, MesaService mesaService,
            ReservaService reservaService) {
        this.restauranteService = restauranteService;
        this.mesaService = mesaService;
        this.reservaService = reservaService;
    }

    // US02 - busca de restaurantes (todos os filtros sao opcionais).
    @GetMapping
    public List<RestauranteResponse> buscar(
            @RequestParam(required = false) String cidade,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime horario,
            @RequestParam(required = false) Integer pessoas,
            @RequestParam(required = false) Long gerenteId) {
        return restauranteService.buscar(cidade, data, horario, pessoas, gerenteId);
    }

    @GetMapping("/{id}")
    public RestauranteResponse buscarPorId(@PathVariable Long id) {
        return restauranteService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RestauranteResponse criar(@Valid @RequestBody RestauranteRequest dados) {
        return restauranteService.criar(dados);
    }

    // US05 - mesas do restaurante.
    @GetMapping("/{id}/mesas")
    public List<MesaResponse> listarMesas(@PathVariable Long id) {
        return mesaService.listar(id);
    }

    @PostMapping("/{id}/mesas")
    @ResponseStatus(HttpStatus.CREATED)
    public MesaResponse criarMesa(@PathVariable Long id, @Valid @RequestBody MesaRequest dados) {
        return mesaService.criar(id, dados);
    }

    // US03 - mesas livres em um dia e horario, para o cliente reservar.
    @GetMapping("/{id}/mesas-disponiveis")
    public List<MesaResponse> mesasDisponiveis(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime horario,
            @RequestParam Integer pessoas) {
        return mesaService.disponiveis(id, data, horario, pessoas);
    }

    // US06 - painel do dia.
    @GetMapping("/{id}/painel")
    public PainelResponse painel(@PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return reservaService.painel(id, data);
    }

    // US08 - relatorio por periodo.
    @GetMapping("/{id}/relatorio")
    public RelatorioResponse relatorio(@PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        return reservaService.relatorio(id, inicio, fim);
    }

}
