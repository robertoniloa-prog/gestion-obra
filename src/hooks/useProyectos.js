import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProyectos() {
  const [proyectos, setProyectos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('proyectos')
      .select('*')
      .eq('estado', 'activo')
      .order('nombre')
      .then(({ data }) => {
        setProyectos(data || [])
        setLoading(false)
      })
  }, [])

  return { proyectos, loading }
}

export function useItemizado(proyectoId) {
  const [itemizado, setItemizado] = useState([])

  useEffect(() => {
    if (!proyectoId) return
    supabase
      .from('itemizado')
      .select('*')
      .eq('proyecto_id', proyectoId)
      .order('codigo')
      .then(({ data }) => setItemizado(data || []))
  }, [proyectoId])

  return itemizado
}

export function useTrabajadores() {
  const [trabajadores, setTrabajadores] = useState([])

  useEffect(() => {
    supabase
      .from('trabajadores')
      .select('*')
      .eq('activo', true)
      .order('nombre')
      .then(({ data }) => setTrabajadores(data || []))
  }, [])

  return trabajadores
}
