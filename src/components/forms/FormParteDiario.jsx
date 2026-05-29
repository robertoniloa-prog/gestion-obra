import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../../lib/supabase'
import { useProyectos, useItemizado, useTrabajadores } from '../../hooks/useProyectos'
import { FormField, Input, Select, Textarea } from '../ui/FormField'

export default function FormParteDiario() {
  const { proyectos, loading } = useProyectos()
  const trabajadores = useTrabajadores()
  const [proyectoId, setProyectoId] = useState('')
  const itemizado = useItemizado(proyectoId)
  const [status, setStatus] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { fecha: new Date().toISOString().slice(0, 10) } })

  const onSubmit = async (data) => {
    setStatus(null)
    const { error } = await supabase.from('parte_diario_mano_obra').insert({
      proyecto_id: data.proyecto_id,
      fecha: data.fecha,
      trabajador_id: data.trabajador_id || null,
      actividad_id: data.actividad_id || null,
      horas_trabajadas: parseFloat(data.horas_trabajadas),
      observaciones: data.observaciones,
      registrado_por: data.registrado_por,
    })
    if (error) {
      setStatus({ type: 'error', msg: error.message })
    } else {
      setStatus({ type: 'success', msg: 'Registro guardado correctamente.' })
      reset({ fecha: new Date().toISOString().slice(0, 10) })
      setProyectoId('')
    }
  }

  if (loading) return <p>Cargando proyectos...</p>

  return (
    <div className="page">
      <h1 className="page-title">👷 Parte Diario — Mano de Obra</h1>
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Proyecto" required error={errors.proyecto_id}>
          <Select
            register={{
              ...register('proyecto_id', { required: 'Seleccione un proyecto' }),
              onChange: (e) => setProyectoId(e.target.value),
            }}
          >
            {proyectos.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="Fecha" required error={errors.fecha}>
          <Input
            type="date"
            register={register('fecha', { required: 'Ingrese la fecha' })}
          />
        </FormField>

        <FormField label="Trabajador" error={errors.trabajador_id}>
          <Select register={register('trabajador_id')}>
            {trabajadores.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre} — {t.cargo}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="Actividad / Partida" error={errors.actividad_id}>
          <Select register={register('actividad_id')} disabled={!proyectoId}>
            {itemizado.map((i) => (
              <option key={i.id} value={i.id}>{i.codigo} — {i.descripcion}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="Horas trabajadas" required error={errors.horas_trabajadas}>
          <Input
            type="number"
            step="0.5"
            min="0"
            max="24"
            register={register('horas_trabajadas', {
              required: 'Ingrese las horas',
              min: { value: 0.5, message: 'Mínimo 0.5 horas' },
            })}
          />
        </FormField>

        <FormField label="Registrado por" error={errors.registrado_por}>
          <Input register={register('registrado_por')} placeholder="Nombre de quien registra" />
        </FormField>

        <FormField label="Observaciones">
          <Textarea register={register('observaciones')} placeholder="Opcional" />
        </FormField>

        {status && (
          <div className={`alert alert-${status.type}`}>{status.msg}</div>
        )}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar registro'}
        </button>
      </form>
    </div>
  )
}
