import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Inicio', icon: '🏠' },
  { section: 'Ingreso de datos' },
  { to: '/parte-diario', label: 'Parte Diario', icon: '👷' },
  { to: '/materiales', label: 'Materiales', icon: '📦' },
  { to: '/avance', label: 'Avance de Obras', icon: '📊' },
  { to: '/reporte-diario', label: 'Reporte Diario', icon: '📋' },
  { section: 'Análisis' },
  { to: '/dashboard', label: 'Dashboard', icon: '📈' },
]

export default function Layout() {
  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">🏗️</span>
          <div>
            <div className="sidebar-title">GestionObra</div>
            <div className="sidebar-subtitle">v1.0 — MVP</div>
          </div>
        </div>
        <ul className="nav-list">
          {navItems.map((item, i) =>
            item.section ? (
              <li key={i}>
                <div className="nav-section">{item.section}</div>
              </li>
            ) : (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            )
          )}
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
