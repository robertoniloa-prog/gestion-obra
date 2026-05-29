import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../../lib/supabase'
import { useProyectos, useItemizado } from '../../hooks/useProyectos'
import { FormField, Input, Select, Textarea } from '../ui/FormField'

export default function FormAvance() {
  const { proyectos, loading } = useProyectos()
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
    const { error } = await supabase.from('avance_partidas').insert({
      proyecto_id: data.proyecto_id,
      fecha: data.fecha,
      actividad_id: data.actividad_id || null,
      cantidad_ejecutada: parseFloat(data.cantidad_ejecutada),
      responsable: data.responsable,
      observaciones: data.observaciones,
    })
    if (error) {
      setStatus({ type: 'error', msg: error.message })
    } else {
      setStatus({ type: 'success', msg: 'Avance registrado correctamente.' })
      reset({ fecha: new Date().toISOString().slice(0, 10) })
      setProyectoId('')
    }
  }

  if (loading) return <p>Cargando proyectos...</p>

  return (
    <div className="page">
      <h1 className="page-title">📊 Avance de Partidas</h1>
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Proyecto" required error={errors.proyecto_id}>
          <Select
            register={{
              ...register('proyecto_id', { required: 'Seleccione un proyecto' }),
              onChange: (e) => setProyectoId(e.target.value),
            }}
          >
            {proyectos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </Select>
        </FormField>

        <FormField label="Fecha" required error={errors.fecha}>
          <Input type="date" register={register('fecha', { required: 'Ingrese la fecha' })} />
        </FormField>

        <FormField label="Partida / Actividad" required error={errors.actividad_id}>
          <Select
            register={register('actividad_id', { required: 'Seleccione la partida' })}
            disabled={!proyectoId}
          >
            {itemizado.map((i) => (
              <option key={i.id} value={i.id}>
                {i.codigo} — {i.descripcion} ({i.unidad})
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Cantidad ejecutada hoy" required error={errors.cantidad_ejecutada}>
          <Input
            type="number"
            step="0.001"
            min="0"
            register={register('cantidad_ejecutada', { required: 'Ingrese la cantidad' })}
          />
        </FormField>

        <FormField label="Responsable" error={errors.responsable}>
          <Input register={register('responsable')} placeholder="Nombre del responsable" />
        </FormField>

        <FormField label="Observaciones">
          <Textarea register={register('observaciones')} />
        </FormField>

        {status && <div className={`alert alert-${status.type}`}>{status.msg}</div>}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Registrar avance'}
        </button>
      </form>
    </div>
  )
}
