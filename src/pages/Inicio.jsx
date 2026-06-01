import { Link } from 'react-router-dom'

const modulos = [
  { to: '/parte-diario', icon: '👷', title: 'Parte Diario', desc: 'Registro diario de horas y actividades por trabajador', color: '#f97316' },
  { to: '/materiales', icon: '📦', title: 'Materiales', desc: 'Control de consumo de materiales por partida', color: '#3b82f6' },
  { to: '/avance', icon: '📊', title: 'Avance de Obras', desc: 'Registro de avance físico por partida del contrato', color: '#22c55e' },
  { to: '/reporte-diario', icon: '📋', title: 'Reporte Diario', desc: 'Condiciones climáticas, personal e incidentes del día', color: '#a855f7' },
  { to: '/dashboard', icon: '📈', title: 'Dashboard', desc: 'KPIs, gráficos de avance y resúmenes del proyecto', color: '#f97316' },
]

export default function Inicio() {
  return (
    <div style={{ maxWidth: 900 }}>
      <div className="home-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <div style={{
            width: 52, height: 52, background: '#fff7ed', borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem'
          }}>🏗️</div>
          <div>
            <h1 className="home-title">GestionObra</h1>
            <p className="home-subtitle">Sistema de reportabilidad para proyectos de construcción</p>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: 12, marginTop: 20,
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
          padding: '14px 20px', alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.2rem' }}>✅</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Sistema activo</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Datos sincronizados en tiempo real · Accesible desde PC y celular
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Proyecto activo</div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#f97316' }}>Edificio Habitacional Los Boldos</div>
          </div>
        </div>
      </div>

      <div className="module-grid">
        {modulos.map((m) => (
          <Link key={m.to} to={m.to} className="module-card">
            <div className="module-icon">{m.icon}</div>
            <h3 className="module-title">{m.title}</h3>
            <p className="module-desc">{m.desc}</p>
            <span className="module-arrow">Ir al módulo →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
