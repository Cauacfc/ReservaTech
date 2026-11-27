package com.reservatech.api;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.jayway.jsonpath.JsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class ReservaTechControllerTests {

    @Autowired
    private MockMvc mockMvc;

    private String json(String texto) {
        return texto.replace('\'', '"');
    }

    private Integer idDe(String resposta) {
        return JsonPath.read(resposta, "$.id");
    }

    @Test
    void cadastraEFazLogin() throws Exception {
        mockMvc.perform(post("/api/auth/cadastro").contentType(MediaType.APPLICATION_JSON)
                .content(json("{'nome':'Teste Cliente','email':'teste.login@email.com','senha':'abc123','tipo':'cliente'}")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.senha").doesNotExist())
                .andExpect(jsonPath("$.tipo").value("cliente"));

        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(json("{'email':'teste.login@email.com','senha':'abc123'}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Teste Cliente"));

        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(json("{'email':'teste.login@email.com','senha':'errada1'}")))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/auth/cadastro").contentType(MediaType.APPLICATION_JSON)
                .content(json("{'nome':'Outro','email':'teste.login@email.com','senha':'abc123'}")))
                .andExpect(status().isConflict());
    }

    @Test
    void rejeitaCadastroInvalido() throws Exception {
        mockMvc.perform(post("/api/auth/cadastro").contentType(MediaType.APPLICATION_JSON)
                .content(json("{'nome':'','email':'invalido','senha':'123'}")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erros.nome").exists())
                .andExpect(jsonPath("$.erros.email").exists())
                .andExpect(jsonPath("$.erros.senha").exists());
    }

    @Test
    void listaRestaurantesDeExemplo() throws Exception {
        mockMvc.perform(get("/api/restaurantes").param("cidade", "são paulo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))));
    }

    @Test
    void fluxoCompletoDeReserva() throws Exception {
        // gerente cria restaurante e mesa
        String gerente = mockMvc.perform(post("/api/auth/cadastro").contentType(MediaType.APPLICATION_JSON)
                .content(json("{'nome':'Gerente Teste','email':'gerente.teste@email.com','senha':'abc123','tipo':'gerente'}")))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        Integer gerenteId = idDe(gerente);

        String restaurante = mockMvc.perform(post("/api/restaurantes").contentType(MediaType.APPLICATION_JSON)
                .content(json("{'gerenteId':" + gerenteId + ",'nome':'Teste Grill','endereco':'Rua A, 1','cidade':'Campinas'}")))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        Integer restauranteId = idDe(restaurante);

        String mesa = mockMvc.perform(post("/api/restaurantes/{id}/mesas", restauranteId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json("{'numero':1,'capacidade':4,'localizacao':'interna'}")))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        Integer mesaId = idDe(mesa);

        // mesa repetida e rejeitada
        mockMvc.perform(post("/api/restaurantes/{id}/mesas", restauranteId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json("{'numero':1,'capacidade':2,'localizacao':'externa'}")))
                .andExpect(status().isConflict());

        // cliente reserva
        String cliente = mockMvc.perform(post("/api/auth/cadastro").contentType(MediaType.APPLICATION_JSON)
                .content(json("{'nome':'Cliente Teste','email':'cliente.teste@email.com','senha':'abc123'}")))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        Integer clienteId = idDe(cliente);

        String data = LocalDate.now().plusDays(5).toString();
        String corpoReserva = json("{'clienteId':" + clienteId + ",'mesaId':" + mesaId + ",'dataReserva':'" + data
                + "','horario':'20:00','numeroPessoas':3}");

        mockMvc.perform(get("/api/restaurantes").param("cidade", "Campinas").param("data", data)
                .param("horario", "20:00").param("pessoas", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        String reserva = mockMvc.perform(post("/api/reservas").contentType(MediaType.APPLICATION_JSON)
                .content(corpoReserva))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("pendente"))
                .andExpect(jsonPath("$.restauranteNome").value("Teste Grill"))
                .andReturn().getResponse().getContentAsString();
        Integer reservaId = idDe(reserva);

        // mesmo dia e horario: conflito
        mockMvc.perform(post("/api/reservas").contentType(MediaType.APPLICATION_JSON).content(corpoReserva))
                .andExpect(status().isConflict());

        // a mesa nao aparece mais como disponivel
        mockMvc.perform(get("/api/restaurantes/{id}/mesas-disponiveis", restauranteId)
                .param("data", data).param("horario", "20:00").param("pessoas", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        // grupo maior que a mesa
        mockMvc.perform(post("/api/reservas").contentType(MediaType.APPLICATION_JSON)
                .content(json("{'clienteId':" + clienteId + ",'mesaId':" + mesaId + ",'dataReserva':'" + data
                        + "','horario':'21:00','numeroPessoas':9}")))
                .andExpect(status().isBadRequest());

        // gerente confirma e o painel mostra a reserva
        mockMvc.perform(put("/api/reservas/{id}/confirmar", reservaId).contentType(MediaType.APPLICATION_JSON)
                .content(json("{'usuarioId':" + gerenteId + "}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("confirmada"));

        mockMvc.perform(get("/api/restaurantes/{id}/painel", restauranteId).param("data", data))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reservasHoje").value(1))
                .andExpect(jsonPath("$.ocupacao").value(100));

        // cliente cancela e a mesa volta a ficar livre
        mockMvc.perform(put("/api/reservas/{id}/cancelar", reservaId).contentType(MediaType.APPLICATION_JSON)
                .content(json("{'usuarioId':" + clienteId + "}")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("cancelada"));

        mockMvc.perform(get("/api/restaurantes/{id}/mesas-disponiveis", restauranteId)
                .param("data", data).param("horario", "20:00").param("pessoas", "2"))
                .andExpect(jsonPath("$", hasSize(1)));

        mockMvc.perform(get("/api/reservas").param("clienteId", clienteId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

}
