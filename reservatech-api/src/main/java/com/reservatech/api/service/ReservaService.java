package com.reservatech.api.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reservatech.api.dto.PainelResponse;
import com.reservatech.api.dto.RelatorioResponse;
import com.reservatech.api.dto.RelatorioResponse.RelatorioDia;
import com.reservatech.api.dto.ReservaRequest;
import com.reservatech.api.dto.ReservaResponse;
import com.reservatech.api.exception.ApiException;
import com.reservatech.api.exception.RecursoNaoEncontradoException;
import com.reservatech.api.model.Mesa;
import com.reservatech.api.model.MesaRepository;
import com.reservatech.api.model.Notificacao;
import com.reservatech.api.model.Reserva;
import com.reservatech.api.model.ReservaRepository;
import com.reservatech.api.model.Usuario;
import com.reservatech.api.model.UsuarioRepository;

@Service
public class ReservaService {

    // US04 - o cliente so pode cancelar ate 1 hora antes do horario reservado.
    private static final Duration ANTECEDENCIA_CANCELAMENTO = Duration.ofHours(1);

    private final ReservaRepository reservaRepository;
    private final MesaRepository mesaRepository;
    private final UsuarioRepository usuarioRepository;
    private final RestauranteService restauranteService;
    private final NotificacaoService notificacaoService;

    public ReservaService(ReservaRepository reservaRepository, MesaRepository mesaRepository,
            UsuarioRepository usuarioRepository, RestauranteService restauranteService,
            NotificacaoService notificacaoService) {
        this.reservaRepository = reservaRepository;
        this.mesaRepository = mesaRepository;
        this.usuarioRepository = usuarioRepository;
        this.restauranteService = restauranteService;
        this.notificacaoService = notificacaoService;
    }

    // US03 - cria a reserva validando data futura, capacidade e conflito de horario.
    @Transactional
    public ReservaResponse criar(ReservaRequest dados) {
        Usuario cliente = usuarioRepository.findById(dados.clienteId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário", dados.clienteId()));
        Mesa mesa = mesaRepository.findById(dados.mesaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Mesa", dados.mesaId()));

        if (!LocalDateTime.of(dados.dataReserva(), dados.horario()).isAfter(LocalDateTime.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "A reserva deve ser feita para uma data e horário futuros.");
        }
        if (dados.numeroPessoas() > mesa.getCapacidade()) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "A mesa " + mesa.getNumero() + " comporta no máximo " + mesa.getCapacidade() + " pessoas.");
        }
        boolean ocupada = mesaRepository
                .findDisponiveis(mesa.getRestaurante().getId(), dados.dataReserva(), dados.horario(), 1).stream()
                .noneMatch(m -> m.getId().equals(mesa.getId()));
        if (ocupada) {
            throw new ApiException(HttpStatus.CONFLICT, "Esta mesa já está reservada para o dia e horário escolhidos.");
        }

        Reserva reserva = reservaRepository.save(new Reserva(cliente, mesa, dados.dataReserva(), dados.horario(),
                dados.numeroPessoas(), Reserva.STATUS_PENDENTE));
        notificacaoService.registrar(reserva, Notificacao.TIPO_CONFIRMACAO);
        return ReservaResponse.de(reserva);
    }

    @Transactional(readOnly = true)
    public List<ReservaResponse> listarDoCliente(Long clienteId) {
        return reservaRepository.findByClienteIdOrderByDataReservaDescHorarioDesc(clienteId).stream()
                .map(ReservaResponse::de).toList();
    }

    // US04 - cancelamento. O cliente respeita a antecedencia minima; o gerente do restaurante nao.
    @Transactional
    public ReservaResponse cancelar(Long id, Long usuarioId) {
        Reserva reserva = buscarOuFalhar(id);
        boolean gerente = ehGerenteDoRestaurante(reserva, usuarioId);
        boolean dono = reserva.getCliente().getId().equals(usuarioId);
        if (!gerente && !dono) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Você não tem permissão para cancelar esta reserva.");
        }
        if (Reserva.STATUS_CANCELADA.equals(reserva.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Esta reserva já foi cancelada.");
        }
        if (!gerente && LocalDateTime.now().isAfter(reserva.inicio().minus(ANTECEDENCIA_CANCELAMENTO))) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "O cancelamento só é permitido até 1 hora antes do horário reservado.");
        }
        reserva.setStatus(Reserva.STATUS_CANCELADA);
        reservaRepository.save(reserva);
        notificacaoService.registrar(reserva, Notificacao.TIPO_CANCELAMENTO);
        return ReservaResponse.de(reserva);
    }

    // O gerente confirma as reservas pendentes do seu restaurante.
    @Transactional
    public ReservaResponse confirmar(Long id, Long usuarioId) {
        Reserva reserva = buscarOuFalhar(id);
        if (!ehGerenteDoRestaurante(reserva, usuarioId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Apenas o gerente do restaurante pode confirmar reservas.");
        }
        if (!Reserva.STATUS_PENDENTE.equals(reserva.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Apenas reservas pendentes podem ser confirmadas.");
        }
        reserva.setStatus(Reserva.STATUS_CONFIRMADA);
        return ReservaResponse.de(reservaRepository.save(reserva));
    }

    // US06 - painel com as reservas do dia ordenadas por horario.
    @Transactional(readOnly = true)
    public PainelResponse painel(Long restauranteId, LocalDate data) {
        restauranteService.buscarOuFalhar(restauranteId);
        LocalDate dia = data != null ? data : LocalDate.now();
        List<Reserva> doDia = reservaRepository.findDoDia(restauranteId, dia);
        List<Reserva> ativas = doDia.stream().filter(r -> !Reserva.STATUS_CANCELADA.equals(r.getStatus())).toList();

        long mesasTotal = mesaRepository.countByRestauranteId(restauranteId);
        Set<Long> mesasReservadas = ativas.stream().map(r -> r.getMesa().getId()).collect(Collectors.toSet());
        long mesasLivres = Math.max(0, mesasTotal - mesasReservadas.size());
        int ocupacao = mesasTotal == 0 ? 0 : (int) Math.round(mesasReservadas.size() * 100.0 / mesasTotal);

        return new PainelResponse(dia, ativas.size(), mesasTotal, mesasLivres, ocupacao,
                doDia.stream().map(ReservaResponse::de).toList());
    }

    // US08 - relatorio de reservas e ocupacao por periodo.
    @Transactional(readOnly = true)
    public RelatorioResponse relatorio(Long restauranteId, LocalDate inicio, LocalDate fim) {
        restauranteService.buscarOuFalhar(restauranteId);
        if (fim.isBefore(inicio)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "A data final não pode ser anterior à data inicial.");
        }
        List<Reserva> reservas = reservaRepository.findDoPeriodo(restauranteId, inicio, fim);

        Map<LocalDate, List<Reserva>> porData = new TreeMap<>(
                reservas.stream().collect(Collectors.groupingBy(Reserva::getDataReserva)));
        List<RelatorioDia> porDia = porData.entrySet().stream()
                .map(e -> new RelatorioDia(e.getKey(), e.getValue().size(),
                        contar(e.getValue(), Reserva.STATUS_CONFIRMADA),
                        contar(e.getValue(), Reserva.STATUS_PENDENTE),
                        contar(e.getValue(), Reserva.STATUS_CANCELADA)))
                .toList();

        return new RelatorioResponse(restauranteId, inicio, fim, reservas.size(),
                contar(reservas, Reserva.STATUS_CONFIRMADA), contar(reservas, Reserva.STATUS_PENDENTE),
                contar(reservas, Reserva.STATUS_CANCELADA), mesaRepository.countByRestauranteId(restauranteId),
                porDia);
    }

    private long contar(List<Reserva> reservas, String status) {
        return reservas.stream().filter(r -> status.equals(r.getStatus())).count();
    }

    private boolean ehGerenteDoRestaurante(Reserva reserva, Long usuarioId) {
        return reserva.getMesa().getRestaurante().getGerente().getId().equals(usuarioId);
    }

    private Reserva buscarOuFalhar(Long id) {
        return reservaRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Reserva", id));
    }

}
