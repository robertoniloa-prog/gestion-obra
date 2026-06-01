import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useProyectos } from '../hooks/useProyectos'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts'

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#f43f5e']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1e293b', color: '#f8fafc', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { proyectos } = useProyectos()
  const [proyectoId, setProyectoId] = useState('')
  const [stats, setStats] = useState(null)
  const [avanceData, setAvanceData] = useState([])
  const [hhData, setHhData] = useState([])

  useEffect(() => {
    if (!proyectoId) return
    fetchStats(proyectoId)
  }, [proyectoId])

  async function fetchStats(pid) {
    const [
      { count: totalHH },
      { count: totalMat },
      { count: totalReportes },
      { data: avances },
      { data: partes },
    ] = await Promise.all([
      supabase.from('parte_diario_mano_obra').select('*', { count: 'exact', head: true }).eq('proyecto_id', pid),
      supabase.from('consumo_materiales').select('*', { count: 'exact', head: true }).eq('proyecto_id', pid),
      supabase.from('reporte_diario').select('*', { count: 'exact', head: true }).eq('proyecto_id', pid),
      supabase.from('avance_partidas').select('cantidad_ejecutada, itemizado(descripcion, cantidad_contrato)').eq('proyecto_id', pid),
      supabase.from('parte_diario_mano_obra').select('horas_trabajadas, fecha').eq('proyecto_id', pid).order('fecha'),
    ])

    // Sumar horas totales
    const totalHoras = (partes || []).reduce((s, r) => s + (r.horas_trabajadas || 0), 0)
    setStats({ totalHH, totalMat, totalReportes, totalHoras })

    // Avance por partida: ejecutado vs contrato
    const agrupado = {}
    ;(avances || []).forEach((a) => {
      const desc = a.itemizado?.descripcion?.split(' ').slice(0, 3).join(' ') || 'Sin partida'
      const contrato = a.itemizado?.cantidad_contrato || 0
      if (!agrupado[desc]) agrupado[desc] = { ejecutado: 0, contrato }
      agrupado[desc].ejecutado += a.cantidad_ejecutada || 0
    })
    setAvanceData(
      Object.entries(agrupado).map(([partida, d]) => ({
        partida,
        ejecutado: Math.round(d.ejecutado * 10) / 10,
        contrato: d.contrato,
        pct: d.contrato > 0 ? Math.round((d.ejecutado / d.contrato) * 100) : 0,
      }))
    )

    // HH por fecha
    const hhPorFecha = {}
    ;(partes || []).forEach((p) => {
      const f = p.fecha
      hhPorFecha[f] = (hhPorFecha[f] || 0) + (p.horas_trabajadas || 0)
    })
    setHhData(
      Object.entries(hhPorFecha)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([fecha, horas]) => ({ fecha: fecha.slice(5), horas }))
    )
  }

  const proyecto = proyectos.find(p => p.id === proyectoId)

  return (
    <div style={{ maxWidth: 1000 }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-icon">📈</div>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">KPIs y métricas del proyecto en tiempo real</p>
        </div>
      </div>

      {/* Selector proyecto */}
      <div className="proyecto-selector">
        <label>Proyecto:</label>
        <select
          className="form-select"
          value={proyectoId}
          onChange={(e) => setProyectoId(e.target.value)}
        >
          <option value="">-- Seleccionar proyecto --</option>
          {proyectos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
        {proyecto && (
          <span className="badge badge-green" style={{ marginLeft: 'auto' }}>● Activo</span>
        )}
      </div>

      {!proyectoId && (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>Selecciona un proyecto para ver las métricas</p>
        </div>
      )}

      {stats && (
        <>
          {/* KPIs */}
          <div className="dashboard-grid">
            <div className="kpi-card orange">
              <span className="kpi-icon">👷</span>
              <span className="kpi-value">{stats.totalHoras}</span>
              <span className="kpi-label">Horas Hombre totales</span>
              <span className="kpi-change">↑ {stats.totalHH} registros</span>
            </div>
            <div className="kpi-card blue">
              <span className="kpi-icon">📦</span>
              <span className="kpi-value">{stats.totalMat}</span>
              <span className="kpi-label">Consumos de materiales</span>
            </div>
            <div className="kpi-card green">
              <span className="kpi-icon">📊</span>
              <span className="kpi-value">{avanceData.length}</span>
              <span className="kpi-label">Partidas con avance</span>
            </div>
            <div className="kpi-card purple">
              <span className="kpi-icon">📋</span>
              <span className="kpi-value">{stats.totalReportes}</span>
              <span className="kpi-label">Reportes diarios</span>
            </div>
          </div>

          {/* Gráficos */}
          {avanceData.length > 0 && (
            <div className="charts-grid">
              {/* Avance por partida */}
              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <div className="chart-title">Avance por partida</div>
                    <div className="chart-subtitle">Ejecutado vs cantidad contratada</div>
                  </div>
                  <span className="chart-badge">Cantidades</span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={avanceData} margin={{ top: 5, right: 10, left: -10, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="partida" angle={-30} textAnchor="end" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 40 }} />
                    <Bar dataKey="contrato" fill="#e2e8f0" name="Contrato" radius={[4,4,0,0]} />
                    <Bar dataKey="ejecutado" fill="#f97316" name="Ejecutado" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* % Avance por partida */}
              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <div className="chart-title">% de avance</div>
                    <div className="chart-subtitle">Por partida</div>
                  </div>
                  <span className="chart-badge">Porcentaje</span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={avanceData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="partida" tick={{ fontSize: 10, fill: '#64748b' }} width={80} />
                    <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v}%`, '% Avance']} />
                    <Bar dataKey="pct" name="% Avance" radius={[0,4,4,0]}>
                      {avanceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* HH por día */}
          {hhData.length > 0 && (
            <div className="chart-card" style={{ marginBottom: 16 }}>
              <div className="chart-header">
                <div>
                  <div className="chart-title">Horas Hombre por día</div>
                  <div className="chart-subtitle">Evolución de HH trabajadas</div>
                </div>
                <span className="chart-badge">Tendencia</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={hhData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="horas" stroke="#f97316" strokeWidth={2.5}
                    dot={{ fill: '#f97316', r: 4 }} name="HH" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {avanceData.length === 0 && (
            <div className="chart-card">
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <p>Aún no hay registros de avance. Usa el módulo <strong>Avance de Obras</strong> para ingresar datos.</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
