import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Inicio', icon: '🏠' },
  { to: '/parte-diario', label: 'Parte Diario', icon: '👷' },
  { to: '/materiales', label: 'Materiales', icon: '📦' },
  { to: '/avance', label: 'Avance', icon: '📊' },
  { to: '/reporte-diario', label: 'Reporte Diario', icon: '📋' },
  { to: '/dashboard', label: 'Dashboard', icon: '📈' },
]

export default function Layout() {
  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">🏗️</span>
          <span className="sidebar-title">GestionObra</span>
        </div>
        <ul className="nav-list">
          {navItems.map((item) => (
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
          ))}
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
