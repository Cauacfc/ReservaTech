package com.reservatech.api.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice // Transforma as exceções da API em respostas JSON com o status HTTP correto.
public class ApiExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErroResponse> erroDaApi(ApiException ex) {
        return ResponseEntity.status(ex.getStatus()).body(new ErroResponse(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class) // Falha do @Valid.
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErroResponse dadosInvalidos(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(erro -> erros.putIfAbsent(erro.getField(), erro.getDefaultMessage()));
        return new ErroResponse("Dados inválidos.", erros);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class) // JSON ausente ou mal formado.
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErroResponse corpoInvalido(HttpMessageNotReadableException ex) {
        return new ErroResponse("O corpo da requisição está ausente ou não é um JSON válido.");
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class) // Ex.: data ou horario em formato errado.
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErroResponse parametroInvalido(MethodArgumentTypeMismatchException ex) {
        return new ErroResponse("O parâmetro '" + ex.getName() + "' está em um formato inválido.");
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErroResponse parametroAusente(MissingServletRequestParameterException ex) {
        return new ErroResponse("O parâmetro '" + ex.getParameterName() + "' é obrigatório.");
    }

}
