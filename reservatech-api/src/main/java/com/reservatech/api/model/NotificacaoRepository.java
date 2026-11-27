package com.reservatech.api.model;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    boolean existsByReservaIdAndTipo(Long reservaId, String tipo);

}
