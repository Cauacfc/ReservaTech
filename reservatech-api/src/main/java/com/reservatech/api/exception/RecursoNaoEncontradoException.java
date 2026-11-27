package com.reservatech.api.exception;

import org.springframework.http.HttpStatus;

public class RecursoNaoEncontradoException extends ApiException {

    public RecursoNaoEncontradoException(String recurso, Long id) {
        super(HttpStatus.NOT_FOUND, recurso + " com id " + id + " não encontrado(a).");
    }

}
