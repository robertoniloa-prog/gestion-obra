import { Link } from 'react-router-dom'

const modulos = [
  { to: '/parte-diario', icon: '👷', title: 'Parte Diario', desc: 'Registro de horas y actividades de trabajadores' },
  { to: '/materiales', icon: '📦', title: 'Materiales', desc: 'Control de consumo de materiales por partida' },
  { to: '/avance', icon: '📊', title: 'Avance de Obras', desc: 'Registro de avance físico por partida' },
  { to: '/reporte-diario', icon: '📋', title: 'Reporte Diario', desc: 'Condiciones, personal e incidentes del día' },
  { to: '/dashboard', icon: '📈', title: 'Dashboard', desc: 'KPIs, gráficos y resúmenes del proyecto' },
]

export default function Inicio() {
  return (
    <div className="page">
      <h1 className="page-title">🏗️ GestionObra</h1>
      <p className="page-subtitle">Sistema de reportabilidad para proyectos de construcción</p>
      <div className="module-grid">
        {modulos.map((m) => (
          <Link key={m.to} to={m.to} className="module-card">
            <span className="module-icon">{m.icon}</span>
            <h3 className="module-title">{m.title}</h3>
            <p className="module-desc">{m.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
