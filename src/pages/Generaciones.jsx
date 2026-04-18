import { Link, useParams } from 'react-router-dom'
import { CalendarDays, ArrowRight, AlertCircle } from 'lucide-react'
import { useQuery } from '../lib/useQuery.js'
import * as q from '../lib/queries.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import LoadingSpinner, { ErrorMsg } from '../components/LoadingSpinner.jsx'

const fmt = n => Number(n).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

export default function Generaciones() {
  const { instId } = useParams()
  const instQ  = useQuery(() => q.getInstitucion(Number(instId)), [instId])
  const proyQ  = useQuery(() => q.getProyectosByInstitucion(Number(instId)), [instId])

  if (instQ.loading || proyQ.loading) return <LoadingSpinner text="Cargando generaciones…" />
  if (instQ.error) return <ErrorMsg message={instQ.error} />
  if (!instQ.data) return <NotFound />

  const inst = instQ.data
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
          {(proyQ.data ?? []).map(proy => (
            <ProyCard key={proy.id} proy={proy} inst={inst} />
          ))}
        </div>
      </div>
    </>
  )
}

function ProyCard({ proy, inst }) {
  const { data, loading } = useQuery(() => q.getResumenProyecto(proy.id), [proy.id])
  const res = data ?? { grupos: 0, alumnos: 0, totalEsperado: 0, totalCobrado: 0, porCobrar: 0 }

  return (
    <Link to={`/instituciones/${inst.id}/proyectos/${proy.id}`} className="card card-link">
      <div className="card-header">
        <div>
          <div className="card-title">Generación {proy.año_ciclo}</div>
          <div className="card-sub">{res.grupos} grupo(s) · {res.alumnos} alumnos</div>
        </div>
        <span className={`badge badge-${proy.estatus.toLowerCase()}`}>{proy.estatus}</span>
      </div>
      {!loading && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '.25rem' }}>
            <span>Cobrado: <strong style={{ color: 'var(--liquidado)' }}>{fmt(res.totalCobrado)}</strong></span>
            <span>Falta: <strong style={{ color: 'var(--abonado)' }}>{fmt(res.porCobrar)}</strong></span>
          </div>
          <ProgressBar value={res.totalCobrado} max={res.totalEsperado} />
        </>
      )}
      <div style={{ marginTop: '.75rem', display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '.8rem', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: '.2rem' }}>
          Ver grupos <ArrowRight size={13} />
        </span>
      </div>
    </Link>
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
