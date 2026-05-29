import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/ui/Layout'
import Inicio from './pages/Inicio'
import Dashboard from './pages/Dashboard'
import FormParteDiario from './components/forms/FormParteDiario'
import FormMateriales from './components/forms/FormMateriales'
import FormAvance from './components/forms/FormAvance'
import FormReporteDiario from './components/forms/FormReporteDiario'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="parte-diario" element={<FormParteDiario />} />
          <Route path="materiales" element={<FormMateriales />} />
          <Route path="avance" element={<FormAvance />} />
          <Route path="reporte-diario" element={<FormReporteDiario />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
