import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../../lib/supabase'
import { useProyectos, useItemizado } from '../../hooks/useProyectos'
import { FormField, Input, Select, Textarea } from '../ui/FormField'

export default function FormMateriales() {
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
    const { error } = await supabase.from('consumo_materiales').insert({
      proyecto_id: data.proyecto_id,
      fecha: data.fecha,
      material: data.material,
      cantidad: parseFloat(data.cantidad),
      unidad: data.unidad,
      actividad_id: data.actividad_id || null,
      responsable: data.responsable,
      observaciones: data.observaciones,
    })
    if (error) {
      setStatus({ type: 'error', msg: error.message })
    } else {
      setStatus({ type: 'success', msg: 'Consumo registrado correctamente.' })
      reset({ fecha: new Date().toISOString().slice(0, 10) })
      setProyectoId('')
    }
  }

  if (loading) return <p>Cargando proyectos...</p>

  return (
    <div className="page">
      <h1 className="page-title">📦 Consumo de Materiales</h1>
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

        <FormField label="Material / Ítem" required error={errors.material}>
          <Input
            register={register('material', { required: 'Ingrese el material' })}
            placeholder="Ej: Hormigón H25, Acero A63-42H"
          />
        </FormField>

        <div className="form-row">
          <FormField label="Cantidad" required error={errors.cantidad}>
            <Input
              type="number"
              step="0.001"
              min="0"
              register={register('cantidad', { required: 'Ingrese la cantidad' })}
            />
          </FormField>
          <FormField label="Unidad" required error={errors.unidad}>
            <Select register={register('unidad', { required: 'Seleccione unidad' })}>
              {['m³','m²','ml','kg','ton','un','gl','l','saco'].map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </Select>
          </FormField>
        </div>

        <FormField label="Partida asociada" error={errors.actividad_id}>
          <Select register={register('actividad_id')} disabled={!proyectoId}>
            {itemizado.map((i) => (
              <option key={i.id} value={i.id}>{i.codigo} — {i.descripcion}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="Responsable" error={errors.responsable}>
          <Input register={register('responsable')} placeholder="Nombre del responsable" />
        </FormField>

        <FormField label="Observaciones">
          <Textarea register={register('observaciones')} />
        </FormField>

        {status && <div className={`alert alert-${status.type}`}>{status.msg}</div>}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Registrar consumo'}
        </button>
      </form>
    </div>
  )
}
