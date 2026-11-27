# ReservaTech

Sistema de reservas de mesas em restaurantes (PI4). Clientes buscam restaurantes com mesa livre e reservam;
gerentes cadastram mesas, acompanham as reservas do dia e consultam relatórios.

O projeto segue a arquitetura dos exemplos das aulas: **app React Native (Expo)** consumindo uma **API REST Spring Boot**
com banco de dados **MySQL**.

```
reservatech/
├── reservatech-api/   API REST (Java 17 + Spring Boot + JPA + MySQL)   -> base: _api_produto
├── reservatech-app/   App React Native / Expo (funciona também no navegador) -> visual e estrutura: vollmed
└── database/          Script SQL completo do banco (tabelas, regras, dados de exemplo e views)
```

## Pré-requisitos

- JDK 17 ou superior
- MySQL 8 ou superior rodando em `localhost:3306`
- Node.js 20 ou superior

## 1. Subir a API

```bash
cd reservatech-api
./mvnw spring-boot:run          # no Windows: mvnw.cmd spring-boot:run
```

A API sobe em `http://localhost:8080`. Na primeira execução ela **cria o banco `reservatech`, as tabelas e os dados de exemplo**
automaticamente (usuário `root`, senha em branco, por padrão). Para usar outra conta do MySQL, defina variáveis de ambiente:

| Variável | Padrão | Para que serve |
| --- | --- | --- |
| `DB_HOST` | `localhost` | endereço do MySQL |
| `DB_PORT` | `3306` | porta do MySQL |
| `DB_NAME` | `reservatech` | nome do banco |
| `DB_USER` | `root` | usuário |
| `DB_PASSWORD` | (vazio) | senha |
| `DDL_AUTO` | `update` | `update` = o Hibernate cria as tabelas que faltam; `none` = não mexe na estrutura |

Exemplo: `DB_PASSWORD=minhasenha ./mvnw spring-boot:run`

**Sem MySQL?** Use o banco de teste em memória (igual ao `_api_produto`):

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```

Console do banco em `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:mem:reservatechdb`, usuário `sa`, senha em branco).

### Criar o banco pelo script SQL (opcional)

O arquivo `database/reservatech_banco_de_dados.sql` cria o mesmo banco com as regras também no MySQL (triggers contra
reserva duplicada e mesa pequena demais) e as views de relatório. Para usá-lo:

```bash
mysql -u root -p < database/reservatech_banco_de_dados.sql
DDL_AUTO=none ./mvnw spring-boot:run
```

### Testes da API

```bash
./mvnw test
```

## 2. Subir o app

```bash
cd reservatech-app
npm install
npx expo start          # pressione "w" para abrir no navegador
```

O app descobre sozinho o endereço do computador onde a API roda. No celular físico, o aparelho e o computador precisam estar
na mesma rede Wi-Fi. Para apontar para outro endereço, crie um arquivo `.env` na raiz do app com
`EXPO_PUBLIC_API_URL=http://SEU_IP:8080`.

## Estrutura do app

O app segue o padrão do projeto `vollmed` (mesmas cores, logo, campos, botões e organização de pastas):

```
reservatech-app/src/
├── App.jsx                    porta de entrada
└── App/
    ├── components/            Button, LabeledInput, Logo, ScreenContainer, Card...
    ├── screens/               Login, Cadastro (3 etapas), telas do cliente e do gerente
    ├── routes/                routes.js (nomes das rotas), AppNavigator e navegadores de cliente e gerente
    ├── theme/                 colors, spacing, typography, borderRadius
    ├── utils/                 masks.js e datetime.js
    ├── services/              api.js (comunicação com a API)
    └── contexts/              usuário logado, reservas do cliente e restaurante do gerente
```

- **Cadastro em 3 etapas:** dados básicos, telefone e escolha do perfil (cliente ou gerente, em tela preta como a de planos do Voll).
- **Cliente (abas):** Início, Explorar, Reservas e Perfil.
- **Gerente (abas):** Painel, Mesas, Relatório e Perfil.

## Contas de teste

Senha de todas: `123456`

| Perfil | E-mail |
| --- | --- |
| Cliente | `maria@email.com`, `joao@email.com`, `ana@email.com` |
| Gerente (Sabor da Casa) | `carlos@sabordacasa.com` |
| Gerente (Cantina Bella) | `fernanda@cantinabella.com` |

## Backlog implementado

| História | Onde está |
| --- | --- |
| US01 Cadastro e login | `AuthController` / `UsuarioService` — telas `LoginScreen`, `RegisterScreen` |
| US02 Buscar restaurantes por localização, data e horário | `GET /api/restaurantes` — tela `ExplorarScreen` |
| US03 Reservar mesa | `POST /api/reservas` — tela `NovaReservaScreen` |
| US04 Cancelar reserva (até 1 h antes) | `PUT /api/reservas/{id}/cancelar` — tela `ReservasScreen` |
| US05 Gerenciar mesas | `/api/restaurantes/{id}/mesas`, `/api/mesas/{id}` — telas `MesasScreen`, `MesaFormScreen` |
| US06 Painel com as reservas do dia | `GET /api/restaurantes/{id}/painel` — tela `GerenteHomeScreen` |
| US07 Confirmação e lembrete por e-mail | `NotificacaoService`, `LembreteScheduler` (e-mail simulado no log) |
| US08 Relatório de ocupação | `GET /api/restaurantes/{id}/relatorio` — tela `RelatorioScreen` |

## Endpoints

| Método | URL | O que faz |
| --- | --- | --- |
| `POST` | `/api/auth/cadastro` | Cadastra cliente ou gerente |
| `POST` | `/api/auth/login` | Login com e-mail e senha |
| `GET` | `/api/restaurantes?cidade=&data=&horario=&pessoas=&gerenteId=` | Lista/busca restaurantes (filtros opcionais) |
| `GET` | `/api/restaurantes/{id}` | Busca um restaurante |
| `POST` | `/api/restaurantes` | Gerente cadastra seu restaurante |
| `GET` / `POST` | `/api/restaurantes/{id}/mesas` | Lista / cadastra mesas |
| `GET` | `/api/restaurantes/{id}/mesas-disponiveis?data=&horario=&pessoas=` | Mesas livres no dia e horário |
| `GET` | `/api/restaurantes/{id}/painel?data=` | Painel do dia |
| `GET` | `/api/restaurantes/{id}/relatorio?inicio=&fim=` | Relatório por período |
| `PUT` / `DELETE` | `/api/mesas/{id}` | Altera / exclui mesa (recusa se tiver reservas) |
| `POST` | `/api/reservas` | Faz uma reserva |
| `GET` | `/api/reservas?clienteId=` | Reservas de um cliente |
| `PUT` | `/api/reservas/{id}/cancelar` | Cancela (corpo: `{"usuarioId": 1}`) |
| `PUT` | `/api/reservas/{id}/confirmar` | Gerente confirma (corpo: `{"usuarioId": 4}`) |

Datas no formato `aaaa-mm-dd` e horários em `hh:mm`. Erros voltam como JSON `{ "mensagem": "...", "erros": { campo: "..." } }`,
no mesmo padrão do `_api_produto`.

## Banco de dados

Tabelas: `usuarios`, `restaurantes`, `mesas`, `reservas`, `notificacoes`.

- Um gerente tem um restaurante; um restaurante tem várias mesas; uma reserva liga um cliente a uma mesa em um dia e horário.
- Uma mesa não pode ter duas reservas ativas no mesmo dia e horário (reserva cancelada libera a mesa).
- O grupo não pode ser maior que a capacidade da mesa.
- As senhas são guardadas com hash BCrypt.

## Limitações conhecidas

- O login devolve os dados do usuário, sem token (JWT). A API confia no `usuarioId` enviado pelo app, o que serve para o
  projeto acadêmico, mas **não é seguro para produção**.
- O envio de e-mail é simulado: cada notificação é gravada na tabela `notificacoes` e escrita no log da API.
- Data e hora são digitadas com máscara (`dd/mm/aaaa`, `hh:mm`); não há seletor de calendário.
