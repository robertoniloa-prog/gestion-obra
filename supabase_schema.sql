-- ============================================================
-- SCHEMA COMPLETO — App Gestión de Proyectos de Construcción
-- Ejecutar en Supabase → SQL Editor → New query → Run
-- ============================================================

create extension if not exists "uuid-ossp";

-- PROYECTOS
create table if not exists proyectos (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  descripcion text,
  fecha_inicio date,
  fecha_termino_programada date,
  contrato_monto numeric(14,2),
  estado text default 'activo' check (estado in ('activo','terminado','pausado')),
  created_at timestamptz default now()
);

-- ITEMIZADO (partidas del contrato)
create table if not exists itemizado (
  id uuid primary key default uuid_generate_v4(),
  proyecto_id uuid references proyectos(id) on delete cascade,
  codigo text,
  descripcion text not null,
  unidad text,
  cantidad_contrato numeric(12,3),
  precio_unitario numeric(14,2),
  created_at timestamptz default now()
);

-- TRABAJADORES
create table if not exists trabajadores (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  rut text,
  cargo text,
  empresa text,
  activo boolean default true
);

-- PARTE DIARIO MANO DE OBRA
create table if not exists parte_diario_mano_obra (
  id uuid primary key default uuid_generate_v4(),
  proyecto_id uuid references proyectos(id) on delete cascade,
  fecha date not null,
  trabajador_id uuid references trabajadores(id),
  actividad_id uuid references itemizado(id),
  horas_trabajadas numeric(5,2),
  observaciones text,
  registrado_por text,
  created_at timestamptz default now()
);

-- CONSUMO DE MATERIALES
create table if not exists consumo_materiales (
  id uuid primary key default uuid_generate_v4(),
  proyecto_id uuid references proyectos(id) on delete cascade,
  fecha date not null,
  material text not null,
  cantidad numeric(12,3),
  unidad text,
  actividad_id uuid references itemizado(id),
  responsable text,
  observaciones text,
  created_at timestamptz default now()
);

-- AVANCE DE PARTIDAS
create table if not exists avance_partidas (
  id uuid primary key default uuid_generate_v4(),
  proyecto_id uuid references proyectos(id) on delete cascade,
  fecha date not null,
  actividad_id uuid references itemizado(id),
  cantidad_ejecutada numeric(12,3),
  responsable text,
  observaciones text,
  foto_url text,
  created_at timestamptz default now()
);

-- REPORTE DIARIO
create table if not exists reporte_diario (
  id uuid primary key default uuid_generate_v4(),
  proyecto_id uuid references proyectos(id) on delete cascade,
  fecha date not null,
  clima text,
  temperatura numeric(4,1),
  personal_total integer,
  actividades_realizadas text,
  incidentes text,
  observaciones text,
  registrado_por text,
  created_at timestamptz default now()
);

-- ============================================================
-- DATOS DE EJEMPLO — 1 proyecto + 5 partidas + 3 trabajadores
-- ============================================================

-- Proyecto de ejemplo
insert into proyectos (nombre, descripcion, fecha_inicio, fecha_termino_programada, contrato_monto, estado)
values (
  'Edificio Habitacional Los Boldos',
  'Construcción de edificio de 4 pisos, 24 departamentos',
  '2026-01-15',
  '2026-12-30',
  850000000,
  'activo'
);

-- Partidas del itemizado (referenciando el proyecto recién creado)
insert into itemizado (proyecto_id, codigo, descripcion, unidad, cantidad_contrato, precio_unitario)
select
  p.id,
  partida.codigo,
  partida.descripcion,
  partida.unidad,
  partida.cantidad_contrato,
  partida.precio_unitario
from proyectos p,
(values
  ('1.1', 'Excavación y movimiento de tierra',    'm³',  450.0,   12500),
  ('2.1', 'Hormigón armado fundaciones',           'm³',  180.0,   95000),
  ('3.1', 'Enfierradura estructural',              'kg',  24000.0, 980),
  ('4.1', 'Albañilería de ladrillo',               'm²',  1200.0,  28000),
  ('5.1', 'Instalación de moldajes',               'm²',  850.0,   15000)
) as partida(codigo, descripcion, unidad, cantidad_contrato, precio_unitario)
where p.nombre = 'Edificio Habitacional Los Boldos';

-- Trabajadores de ejemplo
insert into trabajadores (nombre, rut, cargo, empresa, activo)
values
  ('Carlos Muñoz Rojas',   '12.345.678-9', 'Operador de Retroexcavadora', 'Constructora Los Boldos', true),
  ('Pedro Soto González',  '13.456.789-0', 'Maestro Hormigonero',         'Constructora Los Boldos', true),
  ('Juan Díaz Morales',    '14.567.890-1', 'Enfierrrador',                'Constructora Los Boldos', true);
