package com.reservatech.api.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MesaRepository extends JpaRepository<Mesa, Long> {

    List<Mesa> findByRestauranteIdOrderByNumeroAsc(Long restauranteId);

    boolean existsByRestauranteIdAndNumero(Long restauranteId, Integer numero);

    long countByRestauranteId(Long restauranteId);

    // Mesas do restaurante que comportam o grupo e nao tem reserva ativa naquele dia e horario.
    // Reservas canceladas liberam a mesa.
    @Query("""
            select m from Mesa m
            where m.restaurante.id = :restauranteId
              and m.capacidade >= :pessoas
              and not exists (
                select 1 from Reserva r
                where r.mesa = m
                  and r.dataReserva = :data
                  and r.horario = :horario
                  and r.status <> 'cancelada')
            order by m.capacidade asc, m.numero asc
            """)
    List<Mesa> findDisponiveis(@Param("restauranteId") Long restauranteId,
            @Param("data") LocalDate data,
            @Param("horario") LocalTime horario,
            @Param("pessoas") Integer pessoas);

}
