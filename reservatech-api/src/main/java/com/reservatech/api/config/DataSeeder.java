package com.reservatech.api.config;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.reservatech.api.model.Mesa;
import com.reservatech.api.model.MesaRepository;
import com.reservatech.api.model.Reserva;
import com.reservatech.api.model.ReservaRepository;
import com.reservatech.api.model.Restaurante;
import com.reservatech.api.model.RestauranteRepository;
import com.reservatech.api.model.Usuario;
import com.reservatech.api.model.UsuarioRepository;

/**
 * Insere dados de exemplo apenas quando o banco esta vazio (primeira execucao).
 * Senha de todos os usuarios de exemplo: 123456
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarios;
    private final RestauranteRepository restaurantes;
    private final MesaRepository mesas;
    private final ReservaRepository reservas;
    private final PasswordEncoder encoder;

    public DataSeeder(UsuarioRepository usuarios, RestauranteRepository restaurantes, MesaRepository mesas,
            ReservaRepository reservas, PasswordEncoder encoder) {
        this.usuarios = usuarios;
        this.restaurantes = restaurantes;
        this.mesas = mesas;
        this.reservas = reservas;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (usuarios.count() > 0) {
            return;
        }
        String hash = encoder.encode("123456");

        Usuario maria = usuarios.save(new Usuario("Maria Souza", "maria@email.com", hash, "(11) 90000-0001", Usuario.TIPO_CLIENTE));
        Usuario joao = usuarios.save(new Usuario("João Lima", "joao@email.com", hash, "(11) 90000-0002", Usuario.TIPO_CLIENTE));
        Usuario ana = usuarios.save(new Usuario("Ana Pereira", "ana@email.com", hash, "(11) 90000-0003", Usuario.TIPO_CLIENTE));
        Usuario carlos = usuarios.save(new Usuario("Carlos Mendes", "carlos@sabordacasa.com", hash, "(11) 98888-0001", Usuario.TIPO_GERENTE));
        Usuario fernanda = usuarios.save(new Usuario("Fernanda Rocha", "fernanda@cantinabella.com", hash, "(11) 98888-0002", Usuario.TIPO_GERENTE));

        Restaurante sabor = restaurantes.save(new Restaurante(carlos, "Sabor da Casa", "Rua das Flores, 120", "São Paulo", "(11) 3000-0001"));
        Restaurante cantina = restaurantes.save(new Restaurante(fernanda, "Cantina Bella", "Av. Central, 450", "São Paulo", "(11) 3000-0002"));

        Mesa s1 = mesas.save(new Mesa(sabor, 1, 2, Mesa.LOCAL_INTERNA));
        Mesa s2 = mesas.save(new Mesa(sabor, 2, 4, Mesa.LOCAL_INTERNA));
        Mesa s3 = mesas.save(new Mesa(sabor, 3, 6, Mesa.LOCAL_EXTERNA));
        Mesa c1 = mesas.save(new Mesa(cantina, 1, 2, Mesa.LOCAL_INTERNA));
        mesas.save(new Mesa(cantina, 2, 4, Mesa.LOCAL_EXTERNA));
        Mesa c3 = mesas.save(new Mesa(cantina, 3, 8, Mesa.LOCAL_INTERNA));

        LocalDate hoje = LocalDate.now();
        LocalDate amanha = hoje.plusDays(1);
        reservas.save(new Reserva(maria, s1, amanha, LocalTime.of(19, 30), 2, Reserva.STATUS_CONFIRMADA));
        reservas.save(new Reserva(joao, s2, amanha, LocalTime.of(20, 0), 4, Reserva.STATUS_PENDENTE));
        reservas.save(new Reserva(ana, s3, amanha, LocalTime.of(20, 30), 3, Reserva.STATUS_CONFIRMADA));
        reservas.save(new Reserva(maria, c1, amanha.plusDays(1), LocalTime.of(19, 0), 2, Reserva.STATUS_CONFIRMADA));
        reservas.save(new Reserva(joao, c3, amanha.plusDays(1), LocalTime.of(21, 0), 7, Reserva.STATUS_PENDENTE));
    }

}
