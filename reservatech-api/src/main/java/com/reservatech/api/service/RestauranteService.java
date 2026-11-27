package com.reservatech.api.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reservatech.api.dto.RestauranteRequest;
import com.reservatech.api.dto.RestauranteResponse;
import com.reservatech.api.exception.ApiException;
import com.reservatech.api.exception.RecursoNaoEncontradoException;
import com.reservatech.api.model.MesaRepository;
import com.reservatech.api.model.Restaurante;
import com.reservatech.api.model.RestauranteRepository;
import com.reservatech.api.model.Usuario;
import com.reservatech.api.model.UsuarioRepository;

@Service
public class RestauranteService {

    private final RestauranteRepository restauranteRepository;
    private final UsuarioRepository usuarioRepository;
    private final MesaRepository mesaRepository;

    public RestauranteService(RestauranteRepository restauranteRepository, UsuarioRepository usuarioRepository,
            MesaRepository mesaRepository) {
        this.restauranteRepository = restauranteRepository;
        this.usuarioRepository = usuarioRepository;
        this.mesaRepository = mesaRepository;
    }

    // US02 - busca restaurantes por cidade. Quando data, horario e pessoas sao informados,
    // devolve apenas os restaurantes que ainda tem alguma mesa livre.
    @Transactional(readOnly = true)
    public List<RestauranteResponse> buscar(String cidade, LocalDate data, LocalTime horario, Integer pessoas,
            Long gerenteId) {
        List<Restaurante> restaurantes;
        if (gerenteId != null) {
            restaurantes = restauranteRepository.findByGerenteId(gerenteId);
        } else if (cidade != null && !cidade.isBlank()) {
            restaurantes = restauranteRepository.findByCidadeIgnoreCaseOrderByNomeAsc(cidade.trim());
        } else {
            restaurantes = restauranteRepository.findAllByOrderByNomeAsc();
        }

        boolean filtraDisponibilidade = data != null && horario != null && pessoas != null;
        return restaurantes.stream()
                .filter(r -> !filtraDisponibilidade
                        || !mesaRepository.findDisponiveis(r.getId(), data, horario, pessoas).isEmpty())
                .map(RestauranteResponse::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public RestauranteResponse buscarPorId(Long id) {
        return RestauranteResponse.de(buscarOuFalhar(id));
    }

    @Transactional
    public RestauranteResponse criar(RestauranteRequest dados) {
        Usuario gerente = usuarioRepository.findById(dados.gerenteId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário", dados.gerenteId()));
        if (!Usuario.TIPO_GERENTE.equals(gerente.getTipo())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Apenas gerentes podem cadastrar restaurantes.");
        }
        if (restauranteRepository.existsByGerenteId(gerente.getId())) {
            throw new ApiException(HttpStatus.CONFLICT, "Este gerente já possui um restaurante cadastrado.");
        }
        Restaurante restaurante = new Restaurante(gerente, dados.nome().trim(), dados.endereco().trim(),
                dados.cidade().trim(), dados.telefone());
        return RestauranteResponse.de(restauranteRepository.save(restaurante));
    }

    public Restaurante buscarOuFalhar(Long id) {
        return restauranteRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Restaurante", id));
    }

}
