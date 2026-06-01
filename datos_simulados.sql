-- ============================================================
-- DATOS SIMULADOS — Para poblar el Dashboard con gráficos
-- Ejecutar en Supabase → SQL Editor → New query → Run
-- ============================================================

-- Avances de partidas (varios días)
insert into avance_partidas (proyecto_id, fecha, actividad_id, cantidad_ejecutada, responsable, observaciones)
select
  p.id,
  av.fecha::date,
  i.id,
  av.cantidad,
  'Roberto Niloa',
  'Avance simulado'
from proyectos p
cross join (values
  ('2026-05-01', '1.1', 45.0),
  ('2026-05-05', '1.1', 60.0),
  ('2026-05-10', '1.1', 80.0),
  ('2026-05-15', '2.1', 20.0),
  ('2026-05-18', '2.1', 35.0),
  ('2026-05-20', '3.1', 2400.0),
  ('2026-05-22', '3.1', 3800.0),
  ('2026-05-25', '4.1', 120.0),
  ('2026-05-27', '4.1', 210.0),
  ('2026-05-28', '5.1', 95.0)
) as av(fecha, codigo, cantidad)
join itemizado i on i.proyecto_id = p.id and i.codigo = av.codigo
where p.nombre = 'Edificio Habitacional Los Boldos';

-- Partes diarios de mano de obra (varias fechas y trabajadores)
insert into parte_diario_mano_obra (proyecto_id, fecha, trabajador_id, actividad_id, horas_trabajadas, registrado_por)
select
  p.id,
  pd.fecha::date,
  t.id,
  i.id,
  pd.horas,
  'Roberto Niloa'
from proyectos p
cross join (values
  ('2026-05-20', 'Carlos Muñoz Rojas',   '1.1', 8.0),
  ('2026-05-20', 'Pedro Soto González',  '2.1', 8.0),
  ('2026-05-20', 'Juan Díaz Morales',    '3.1', 9.0),
  ('2026-05-21', 'Carlos Muñoz Rojas',   '1.1', 8.0),
  ('2026-05-21', 'Pedro Soto González',  '2.1', 7.5),
  ('2026-05-22', 'Juan Díaz Morales',    '3.1', 8.0),
  ('2026-05-22', 'Carlos Muñoz Rojas',   '4.1', 8.0),
  ('2026-05-23', 'Pedro Soto González',  '4.1', 8.0),
  ('2026-05-23', 'Juan Díaz Morales',    '5.1', 8.0),
  ('2026-05-26', 'Carlos Muñoz Rojas',   '1.1', 9.0),
  ('2026-05-26', 'Pedro Soto González',  '2.1', 8.0),
  ('2026-05-27', 'Juan Díaz Morales',    '3.1', 8.0),
  ('2026-05-27', 'Carlos Muñoz Rojas',   '4.1', 7.0),
  ('2026-05-28', 'Pedro Soto González',  '5.1', 8.0),
  ('2026-05-28', 'Juan Díaz Morales',    '2.1', 8.0)
) as pd(fecha, nombre_trab, codigo, horas)
join trabajadores t on t.nombre = pd.nombre_trab
join itemizado i on i.proyecto_id = p.id and i.codigo = pd.codigo
where p.nombre = 'Edificio Habitacional Los Boldos';

-- Consumo de materiales
insert into consumo_materiales (proyecto_id, fecha, material, cantidad, unidad, actividad_id, responsable)
select
  p.id,
  cm.fecha::date,
  cm.material,
  cm.cantidad,
  cm.unidad,
  i.id,
  'Roberto Niloa'
from proyectos p
cross join (values
  ('2026-05-15', 'Hormigón H25',        18.5, 'm³',   '2.1'),
  ('2026-05-18', 'Hormigón H25',        22.0, 'm³',   '2.1'),
  ('2026-05-20', 'Acero A63-42H',      850.0, 'kg',   '3.1'),
  ('2026-05-22', 'Acero A63-42H',     1200.0, 'kg',   '3.1'),
  ('2026-05-23', 'Ladrillo fiscal',    1500.0, 'un',   '4.1'),
  ('2026-05-25', 'Mortero 1:3',         12.0, 'saco',  '4.1'),
  ('2026-05-27', 'Madera moldaje 2x4',  45.0, 'un',   '5.1')
) as cm(fecha, material, cantidad, unidad, codigo)
join itemizado i on i.proyecto_id = p.id and i.codigo = cm.codigo
where p.nombre = 'Edificio Habitacional Los Boldos';

-- Reportes diarios
insert into reporte_diario (proyecto_id, fecha, clima, temperatura, personal_total, actividades_realizadas, incidentes, registrado_por)
select p.id, rd.fecha::date, rd.clima, rd.temp, rd.personal, rd.actividades, 'Sin novedad', 'Roberto Niloa'
from proyectos p
cross join (values
  ('2026-05-20', 'Despejado',        22.0, 12, 'Excavación sector norte, hormigonado fundaciones eje A'),
  ('2026-05-21', 'Parcialmente nublado', 18.5, 11, 'Continuación excavación, enfierradura losa'),
  ('2026-05-22', 'Despejado',        24.0, 13, 'Albañilería muro sur, moldajes losa primer piso'),
  ('2026-05-23', 'Nublado',          16.0, 10, 'Enfierradura vigas, instalación moldajes'),
  ('2026-05-26', 'Despejado',        21.0, 13, 'Hormigonado losa primer piso, curado'),
  ('2026-05-27', 'Lluvia leve',      14.0,  8, 'Trabajos interiores, enfierradura segundo piso'),
  ('2026-05-28', 'Despejado',        20.0, 12, 'Albañilería segundo piso, avance moldajes')
) as rd(fecha, clima, temp, personal, actividades)
where p.nombre = 'Edificio Habitacional Los Boldos';
