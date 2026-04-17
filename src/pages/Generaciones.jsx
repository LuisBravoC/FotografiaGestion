import { Link, useParams } from 'react-router-dom'
import { CalendarDays, ArrowRight, AlertCircle } from 'lucide-react'
import { instituciones, proyectos, getResumenProyecto } from '../data.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import ProgressBar from '../components/ProgressBar.jsx'

const fmt = n => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

export default function Generaciones() {
  const { instId } = useParams()
  const inst = instituciones.find(i => i.id === Number(instId))
  if (!inst) return <NotFound />

  const misProyectos = proyectos
    .filter(p => p.institucion_id === inst.id)
    .sort((a, b) => b.año_ciclo.localeCompare(a.año_ciclo))

  const crumbs = [
    { label: 'Dashboard', to: '/' },
    { label: 'Instituciones', to: '/instituciones' },
    { label: inst.nombre },
  ]

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <div className="page">
        <h1 className="page-title"><CalendarDays size={22} /> {inst.nombre}</h1>
        <p className="section-heading">Generaciones / Ciclos</p>
        <div className="grid grid-auto">
          {misProyectos.map(proy => {
            const res = getResumenProyecto(proy.id)
            return (
              <Link
                key={proy.id}
                to={`/instituciones/${inst.id}/proyectos/${proy.id}`}
                className="card card-link"
              >
                <div className="card-header">
                  <div>
                    <div className="card-title">Generación {proy.año_ciclo}</div>
                    <div className="card-sub">{res.grupos} grupo(s) · {res.alumnos} alumnos</div>
                  </div>
                  <span className={`badge badge-${proy.estatus.toLowerCase()}`}>
                    {proy.estatus}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '.25rem' }}>
                  <span>Cobrado: <strong style={{ color: 'var(--liquidado)' }}>{fmt(res.totalCobrado)}</strong></span>
                  <span>Falta: <strong style={{ color: 'var(--abonado)' }}>{fmt(res.porCobrar)}</strong></span>
                </div>
                <ProgressBar value={res.totalCobrado} max={res.totalEsperado} />
                <div style={{ marginTop: '.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '.8rem', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: '.2rem' }}>
                    Ver grupos <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

function NotFound() {
  return (
    <div className="page empty">
      <AlertCircle size={48} />
      <p>Institución no encontrada.</p>
      <Link to="/instituciones" style={{ color: 'var(--accent-light)' }}>← Volver</Link>
    </div>
  )
}
