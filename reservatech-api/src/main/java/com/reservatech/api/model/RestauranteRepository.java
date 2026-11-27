package com.reservatech.api.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RestauranteRepository extends JpaRepository<Restaurante, Long> {

    List<Restaurante> findAllByOrderByNomeAsc();

    List<Restaurante> findByCidadeIgnoreCaseOrderByNomeAsc(String cidade);

    List<Restaurante> findByGerenteId(Long gerenteId);

    boolean existsByGerenteId(Long gerenteId);

}
