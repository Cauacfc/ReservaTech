package com.reservatech.api.exception;

import org.springframework.http.HttpStatus;

// Erro previsto pela API (regra de negocio, nao encontrado, login invalido...).
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String mensagem) {
        super(mensagem);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

}
