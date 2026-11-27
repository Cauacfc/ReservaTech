package com.reservatech.api.model;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByClienteIdOrderByDataReservaDescHorarioDesc(Long clienteId);

    boolean existsByMesaId(Long mesaId);

    List<Reserva> findByDataReservaBetweenAndStatus(LocalDate inicio, LocalDate fim, String status);

    @Query("""
            select r from Reserva r
            where r.mesa.restaurante.id = :restauranteId
              and r.dataReserva = :data
            order by r.horario asc
            """)
    List<Reserva> findDoDia(@Param("restauranteId") Long restauranteId, @Param("data") LocalDate data);

    @Query("""
            select r from Reserva r
            where r.mesa.restaurante.id = :restauranteId
              and r.dataReserva between :inicio and :fim
            order by r.dataReserva asc, r.horario asc
            """)
    List<Reserva> findDoPeriodo(@Param("restauranteId") Long restauranteId,
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim);

}
