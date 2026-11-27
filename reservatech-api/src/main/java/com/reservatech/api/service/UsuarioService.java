package com.reservatech.api.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reservatech.api.dto.CadastroRequest;
import com.reservatech.api.dto.LoginRequest;
import com.reservatech.api.dto.UsuarioResponse;
import com.reservatech.api.exception.ApiException;
import com.reservatech.api.model.Usuario;
import com.reservatech.api.model.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // US01 - cadastro de clientes e gerentes.
    @Transactional
    public UsuarioResponse cadastrar(CadastroRequest dados) {
        String email = dados.email().trim().toLowerCase();
        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Já existe um usuário cadastrado com este e-mail.");
        }
        String tipo = dados.tipo() == null ? Usuario.TIPO_CLIENTE : dados.tipo();
        Usuario usuario = new Usuario(dados.nome().trim(), email, passwordEncoder.encode(dados.senha()),
                dados.telefone(), tipo);
        return UsuarioResponse.de(usuarioRepository.save(usuario));
    }

    // US01 - login com e-mail e senha.
    @Transactional(readOnly = true)
    public UsuarioResponse login(LoginRequest dados) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(dados.email().trim())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos."));
        if (!passwordEncoder.matches(dados.senha(), usuario.getSenhaHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos.");
        }
        return UsuarioResponse.de(usuario);
    }

}
