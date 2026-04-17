import { Routes, Route, Navigate } from 'react-router-dom'
import Topbar from './components/Topbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Instituciones from './pages/Instituciones.jsx'
import Generaciones from './pages/Generaciones.jsx'
import Grupos from './pages/Grupos.jsx'
import AlumnosList from './pages/AlumnosList.jsx'
import AlumnoDetail from './pages/AlumnoDetail.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Topbar />
      <main>
        <Routes>
          {/* Level 1 — Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Level 2 — Instituciones */}
          <Route path="/instituciones" element={<Instituciones />} />

          {/* Level 3 — Generaciones de una institución */}
          <Route path="/instituciones/:instId" element={<Generaciones />} />

          {/* Level 3.5 — Grupos de un proyecto */}
          <Route path="/instituciones/:instId/proyectos/:proyId" element={<Grupos />} />

          {/* Level 4 — Lista alumnos de un grupo */}
          <Route path="/instituciones/:instId/proyectos/:proyId/grupos/:grupoId" element={<AlumnosList />} />

          {/* Level 5 — Detalle de un alumno */}
          <Route path="/instituciones/:instId/proyectos/:proyId/grupos/:grupoId/alumnos/:alumnoId" element={<AlumnoDetail />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
