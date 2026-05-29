import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../../lib/supabase'
import { useProyectos } from '../../hooks/useProyectos'
import { FormField, Input, Select, Textarea } from '../ui/FormField'

const CLIMAS = ['Despejado', 'Parcialmente nublado', 'Nublado', 'Lluvia leve', 'Lluvia fuerte', 'Viento', 'Helada']

export default function FormReporteDiario() {
  const { proyectos, loading } = useProyectos()
  const [status, setStatus] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { fecha: new Date().toISOString().slice(0, 10) } })

  const onSubmit = async (data) => {
    setStatus(null)
    const { error } = await supabase.from('reporte_diario').insert({
      proyecto_id: data.proyecto_id,
      fecha: data.fecha,
      clima: data.clima,
      temperatura: data.temperatura ? parseFloat(data.temperatura) : null,
      personal_total: data.personal_total ? parseInt(data.personal_total) : null,
      actividades_realizadas: data.actividades_realizadas,
      incidentes: data.incidentes,
      observaciones: data.observaciones,
      registrado_por: data.registrado_por,
    })
    if (error) {
      setStatus({ type: 'error', msg: error.message })
    } else {
      setStatus({ type: 'success', msg: 'Reporte diario guardado correctamente.' })
      reset({ fecha: new Date().toISOString().slice(0, 10) })
    }
  }

  if (loading) return <p>Cargando proyectos...</p>

  return (
    <div className="page">
      <h1 className="page-title">📋 Reporte Diario</h1>
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Proyecto" required error={errors.proyecto_id}>
          <Select register={register('proyecto_id', { required: 'Seleccione un proyecto' })}>
            {proyectos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </Select>
        </FormField>

        <FormField label="Fecha" required error={errors.fecha}>
          <Input type="date" register={register('fecha', { required: 'Ingrese la fecha' })} />
        </FormField>

        <div className="form-row">
          <FormField label="Condición climática">
            <Select register={register('clima')}>
              {CLIMAS.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormField>
          <FormField label="Temperatura (°C)">
            <Input type="number" step="0.1" register={register('temperatura')} placeholder="Ej: 18.5" />
          </FormField>
        </div>

        <FormField label="Personal total en obra">
          <Input type="number" min="0" register={register('personal_total')} placeholder="N° de personas" />
        </FormField>

        <FormField label="Actividades realizadas hoy" required error={errors.actividades_realizadas}>
          <Textarea
            register={register('actividades_realizadas', { required: 'Describa las actividades' })}
            placeholder="Describe las actividades del día..."
          />
        </FormField>

        <FormField label="Incidentes / Accidentes">
          <Textarea register={register('incidentes')} placeholder="Sin novedad, o descripción del incidente..." />
        </FormField>

        <FormField label="Observaciones generales">
          <Textarea register={register('observaciones')} />
        </FormField>

        <FormField label="Registrado por" error={errors.registrado_por}>
          <Input register={register('registrado_por')} placeholder="Nombre de quien registra" />
        </FormField>

        {status && <div className={`alert alert-${status.type}`}>{status.msg}</div>}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar reporte'}
        </button>
      </form>
    </div>
  )
}
