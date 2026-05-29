import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useProyectos } from '../hooks/useProyectos'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

export default function Dashboard() {
  const { proyectos } = useProyectos()
  const [proyectoId, setProyectoId] = useState('')
  const [stats, setStats] = useState(null)
  const [avanceData, setAvanceData] = useState([])

  useEffect(() => {
    if (!proyectoId) return
    fetchStats(proyectoId)
  }, [proyectoId])

  async function fetchStats(pid) {
    const [{ count: totalHH }, { count: totalMat }, { count: totalReportes }, { data: avances }] =
      await Promise.all([
        supabase.from('parte_diario_mano_obra').select('*', { count: 'exact', head: true }).eq('proyecto_id', pid),
        supabase.from('consumo_materiales').select('*', { count: 'exact', head: true }).eq('proyecto_id', pid),
        supabase.from('reporte_diario').select('*', { count: 'exact', head: true }).eq('proyecto_id', pid),
        supabase
          .from('avance_partidas')
          .select('cantidad_ejecutada, itemizado(descripcion, cantidad_contrato)')
          .eq('proyecto_id', pid),
      ])

    setStats({ totalHH, totalMat, totalReportes })

    const agrupado = {}
    ;(avances || []).forEach((a) => {
      const desc = a.itemizado?.descripcion || 'Sin partida'
      agrupado[desc] = (agrupado[desc] || 0) + (a.cantidad_ejecutada || 0)
    })
    setAvanceData(
      Object.entries(agrupado).map(([partida, ejecutado]) => ({ partida, ejecutado }))
    )
  }

  return (
    <div className="page">
      <h1 className="page-title">📈 Dashboard</h1>

      <div className="form-field">
        <label className="form-label">Seleccionar proyecto</label>
        <select className="form-select" value={proyectoId} onChange={(e) => setProyectoId(e.target.value)}>
          <option value="">-- Seleccionar --</option>
          {proyectos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
      </div>

      {stats && (
        <>
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-value">{stats.totalHH}</span>
              <span className="kpi-label">Registros HH</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-value">{stats.totalMat}</span>
              <span className="kpi-label">Consumos materiales</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-value">{stats.totalReportes}</span>
              <span className="kpi-label">Reportes diarios</span>
            </div>
          </div>

          {avanceData.length > 0 && (
            <div className="chart-card">
              <h2 className="chart-title">Avance por partida</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={avanceData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="partida" angle={-35} textAnchor="end" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ejecutado" fill="#f97316" name="Cantidad ejecutada" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {!proyectoId && (
        <p className="empty-state">Selecciona un proyecto para ver los KPIs.</p>
      )}
    </div>
  )
}
