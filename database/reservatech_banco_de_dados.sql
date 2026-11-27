drop database if exists reservatech;

create database reservatech
  character set utf8mb4
  collate utf8mb4_unicode_ci;

use reservatech;

create table usuarios (
    id bigint auto_increment primary key,
    nome varchar(150) not null,
    email varchar(150) not null unique,
    senha_hash varchar(255) not null,
    telefone varchar(20),
    tipo varchar(20) not null default 'cliente',
    criado_em datetime(6) not null default current_timestamp(6),
    constraint ck_usuarios_tipo check (tipo in ('cliente', 'gerente'))
) engine=innodb;

create table restaurantes (
    id bigint auto_increment primary key,
    gerente_id bigint not null,
    nome varchar(150) not null,
    endereco varchar(255) not null,
    cidade varchar(100) not null,
    telefone varchar(20),
    criado_em datetime(6) not null default current_timestamp(6),
    constraint fk_restaurantes_gerente
        foreign key (gerente_id) references usuarios(id)
        on delete restrict
        on update cascade
) engine=innodb;

create table mesas (
    id bigint auto_increment primary key,
    restaurante_id bigint not null,
    numero int not null,
    capacidade int not null,
    localizacao varchar(20) not null default 'interna',
    constraint fk_mesas_restaurante
        foreign key (restaurante_id) references restaurantes(id)
        on delete cascade
        on update cascade,
    constraint uq_mesa_numero unique (restaurante_id, numero),
    constraint ck_mesa_capacidade check (capacidade > 0),
    constraint ck_mesa_localizacao check (localizacao in ('interna', 'externa'))
) engine=innodb;

create table reservas (
    id bigint auto_increment primary key,
    cliente_id bigint not null,
    mesa_id bigint not null,
    data_reserva date not null,
    horario time not null,
    numero_pessoas int not null,
    status varchar(20) not null default 'pendente',
    criado_em datetime(6) not null default current_timestamp(6),
    constraint fk_reservas_cliente
        foreign key (cliente_id) references usuarios(id)
        on delete cascade
        on update cascade,
    constraint fk_reservas_mesa
        foreign key (mesa_id) references mesas(id)
        on delete cascade
        on update cascade,
    constraint ck_reserva_pessoas check (numero_pessoas > 0),
    constraint ck_reserva_status check (status in ('pendente', 'confirmada', 'cancelada'))
) engine=innodb;

create table notificacoes (
    id bigint auto_increment primary key,
    reserva_id bigint not null,
    tipo varchar(20) not null,
    enviado_em datetime(6) not null default current_timestamp(6),
    constraint fk_notificacoes_reserva
        foreign key (reserva_id) references reservas(id)
        on delete cascade
        on update cascade,
    constraint ck_notificacao_tipo check (tipo in ('confirmacao', 'lembrete', 'cancelamento'))
) engine=innodb;

create index idx_restaurantes_cidade on restaurantes(cidade);
create index idx_mesas_restaurante on mesas(restaurante_id);
create index idx_reservas_cliente on reservas(cliente_id);
create index idx_reservas_mesa_data on reservas(mesa_id, data_reserva, horario);
create index idx_notificacoes_reserva on notificacoes(reserva_id);

delimiter $$

create trigger trg_reservas_evita_conflito
before insert on reservas
for each row
begin
    if exists (
        select 1
        from reservas
        where mesa_id = new.mesa_id
          and data_reserva = new.data_reserva
          and horario = new.horario
          and status <> 'cancelada'
    ) then
        signal sqlstate '45000'
            set message_text = 'mesa ja reservada para este dia e horario';
    end if;
end$$

create trigger trg_reservas_valida_capacidade
before insert on reservas
for each row
begin
    declare cap int;
    select capacidade into cap from mesas where id = new.mesa_id;
    if new.numero_pessoas > cap then
        signal sqlstate '45000'
            set message_text = 'numero de pessoas maior que a capacidade da mesa';
    end if;
end$$

delimiter ;

insert into usuarios (nome, email, senha_hash, telefone, tipo) values
    ('maria souza', 'maria@email.com', '$2a$10$B0NgT8t4qMmaPor13LvDoeqkYlujeE2ah8HUac1bi4DygdQ38xa1W', '(11) 90000-0001', 'cliente'),
    ('joao lima', 'joao@email.com', '$2a$10$B0NgT8t4qMmaPor13LvDoeqkYlujeE2ah8HUac1bi4DygdQ38xa1W', '(11) 90000-0002', 'cliente'),
    ('ana pereira', 'ana@email.com', '$2a$10$B0NgT8t4qMmaPor13LvDoeqkYlujeE2ah8HUac1bi4DygdQ38xa1W', '(11) 90000-0003', 'cliente'),
    ('carlos mendes', 'carlos@sabordacasa.com', '$2a$10$B0NgT8t4qMmaPor13LvDoeqkYlujeE2ah8HUac1bi4DygdQ38xa1W', '(11) 98888-0001', 'gerente'),
    ('fernanda rocha', 'fernanda@cantinabella.com', '$2a$10$B0NgT8t4qMmaPor13LvDoeqkYlujeE2ah8HUac1bi4DygdQ38xa1W', '(11) 98888-0002', 'gerente');

insert into restaurantes (gerente_id, nome, endereco, cidade, telefone) values
    (4, 'sabor da casa', 'rua das flores, 120', 'sao paulo', '(11) 3000-0001'),
    (5, 'cantina bella', 'av. central, 450', 'sao paulo', '(11) 3000-0002');

insert into mesas (restaurante_id, numero, capacidade, localizacao) values
    (1, 1, 2, 'interna'),
    (1, 2, 4, 'interna'),
    (1, 3, 6, 'externa'),
    (2, 1, 2, 'interna'),
    (2, 2, 4, 'externa'),
    (2, 3, 8, 'interna');

insert into reservas (cliente_id, mesa_id, data_reserva, horario, numero_pessoas, status) values
    (1, 1, date_add(curdate(), interval 1 day), '19:30:00', 2, 'confirmada'),
    (2, 2, date_add(curdate(), interval 1 day), '20:00:00', 4, 'pendente'),
    (3, 3, date_add(curdate(), interval 1 day), '20:30:00', 3, 'confirmada'),
    (1, 4, date_add(curdate(), interval 2 day), '19:00:00', 2, 'confirmada'),
    (2, 6, date_add(curdate(), interval 2 day), '21:00:00', 7, 'pendente');

insert into notificacoes (reserva_id, tipo) values
    (1, 'confirmacao'),
    (2, 'confirmacao'),
    (3, 'confirmacao'),
    (4, 'confirmacao'),
    (5, 'confirmacao');

create view vw_reservas_detalhadas as
select
    r.id as reserva_id,
    r.data_reserva,
    r.horario,
    r.numero_pessoas,
    r.status,
    u.nome as cliente,
    u.email as email_cliente,
    m.numero as mesa,
    m.capacidade,
    m.localizacao,
    rest.id as restaurante_id,
    rest.nome as restaurante
from reservas r
join usuarios u on u.id = r.cliente_id
join mesas m on m.id = r.mesa_id
join restaurantes rest on rest.id = m.restaurante_id;

create view vw_ocupacao_diaria as
select
    rest.id as restaurante_id,
    rest.nome as restaurante,
    r.data_reserva,
    count(*) as total_reservas,
    sum(r.status = 'confirmada') as confirmadas,
    sum(r.status = 'pendente') as pendentes,
    sum(r.status = 'cancelada') as canceladas
from reservas r
join mesas m on m.id = r.mesa_id
join restaurantes rest on rest.id = m.restaurante_id
group by rest.id, rest.nome, r.data_reserva;
