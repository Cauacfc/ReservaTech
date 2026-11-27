package com.reservatech.api.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reservatech.api.dto.MesaRequest;
import com.reservatech.api.dto.MesaResponse;
import com.reservatech.api.exception.ApiException;
import com.reservatech.api.exception.RecursoNaoEncontradoException;
import com.reservatech.api.model.Mesa;
import com.reservatech.api.model.MesaRepository;
import com.reservatech.api.model.ReservaRepository;
import com.reservatech.api.model.Restaurante;

// US05 - cadastro e gerenciamento de mesas pelo restaurante.
@Service
public class MesaService {

    private final MesaRepository mesaRepository;
    private final ReservaRepository reservaRepository;
    private final RestauranteService restauranteService;

    public MesaService(MesaRepository mesaRepository, ReservaRepository reservaRepository,
            RestauranteService restauranteService) {
        this.mesaRepository = mesaRepository;
        this.reservaRepository = reservaRepository;
        this.restauranteService = restauranteService;
    }

    @Transactional(readOnly = true)
    public List<MesaResponse> listar(Long restauranteId) {
        restauranteService.buscarOuFalhar(restauranteId);
        return mesaRepository.findByRestauranteIdOrderByNumeroAsc(restauranteId).stream()
                .map(MesaResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public List<MesaResponse> disponiveis(Long restauranteId, LocalDate data, LocalTime horario, Integer pessoas) {
        restauranteService.buscarOuFalhar(restauranteId);
        return mesaRepository.findDisponiveis(restauranteId, data, horario, pessoas).stream()
                .map(MesaResponse::de).toList();
    }

    @Transactional
    public MesaResponse criar(Long restauranteId, MesaRequest dados) {
        Restaurante restaurante = restauranteService.buscarOuFalhar(restauranteId);
        if (mesaRepository.existsByRestauranteIdAndNumero(restauranteId, dados.numero())) {
            throw new ApiException(HttpStatus.CONFLICT, "Já existe a mesa " + dados.numero() + " neste restaurante.");
        }
        Mesa mesa = new Mesa(restaurante, dados.numero(), dados.capacidade(), dados.localizacao());
        return MesaResponse.de(mesaRepository.save(mesa));
    }

    @Transactional
    public MesaResponse atualizar(Long id, MesaRequest dados) {
        Mesa mesa = buscarOuFalhar(id);
        boolean mudouNumero = !mesa.getNumero().equals(dados.numero());
        if (mudouNumero
                && mesaRepository.existsByRestauranteIdAndNumero(mesa.getRestaurante().getId(), dados.numero())) {
            throw new ApiException(HttpStatus.CONFLICT, "Já existe a mesa " + dados.numero() + " neste restaurante.");
        }
        mesa.setNumero(dados.numero());
        mesa.setCapacidade(dados.capacidade());
        mesa.setLocalizacao(dados.localizacao());
        return MesaResponse.de(mesaRepository.save(mesa));
    }

    @Transactional
    public void excluir(Long id) {
        Mesa mesa = buscarOuFalhar(id);
        if (reservaRepository.existsByMesaId(id)) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "A mesa " + mesa.getNumero() + " possui reservas e não pode ser excluída.");
        }
        mesaRepository.delete(mesa);
    }

    private Mesa buscarOuFalhar(Long id) {
        return mesaRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Mesa", id));
    }

}
