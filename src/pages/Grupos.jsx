import { Link, useParams } from 'react-router-dom'
import { Users, Clock, ArrowRight, AlertCircle } from 'lucide-react'
import { useQuery } from '../lib/useQuery.js'
import * as q from '../lib/queries.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import LoadingSpinner, { ErrorMsg } from '../components/LoadingSpinner.jsx'

const fmt = n => Number(n).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

export default function Grupos() {
  const { instId, proyId } = useParams()
  const instQ  = useQuery(() => q.getInstitucion(Number(instId)), [instId])
  const proyQ  = useQuery(() => q.getProyecto(Number(proyId)), [proyId])
  const grupoQ = useQuery(() => q.getGruposByProyecto(Number(proyId)), [proyId])

  if (instQ.loading || proyQ.loading || grupoQ.loading) return <LoadingSpinner text="Cargando grupos…" />
  if (instQ.error || proyQ.error) return <ErrorMsg message={instQ.error ?? proyQ.error} />
  if (!instQ.data || !proyQ.data) return <NotFound />

  const inst = instQ.data
  const proy = proyQ.data

  const crumbs = [
    { label: 'Dashboard', to: '/' },
    { label: 'Instituciones', to: '/instituciones' },
    { label: inst.nombre, to: `/instituciones/${inst.id}` },
    { label: `Gen ${proy.año_ciclo}` },
  ]

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <div className="page">
        <h1 className="page-title"><Users size={22} /> Grupos — Gen {proy.año_ciclo}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '.88rem', marginBottom: '1.5rem' }}>{inst.nombre}</p>
        <div className="grid grid-auto">
          {(grupoQ.data ?? []).map(g => (
            <GrupoCard key={g.id} g={g} inst={inst} proy={proy} />
          ))}
          {(grupoQ.data ?? []).length === 0 && (
            <p className="empty">No hay grupos para esta generación aún.</p>
          )}
        </div>
      </div>
    </>
  )
}

function GrupoCard({ g, inst, proy }) {
  const { data, loading } = useQuery(() => q.getResumenGrupo(g.id), [g.id])
  const res = data ?? { miembros: 0, totalEsperado: 0, totalCobrado: 0, porCobrar: 0 }

  return (
    <Link to={`/instituciones/${inst.id}/proyectos/${proy.id}/grupos/${g.id}`} className="card card-link">
      <div className="card-header">
        <div>
          <div className="card-title">{g.nombre_grupo}</div>
          <div className="card-sub" style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
            <Clock size={12} /> {g.turno} · {res.miembros} alumnos
          </div>
        </div>
        <Users size={20} className="card-icon" />
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
          Ver alumnos <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  )
}

function NotFound() {
  return (
    <div className="page empty">
      <AlertCircle size={48} />
      <p>Datos no encontrados.</p>
      <Link to="/" style={{ color: 'var(--accent-light)' }}>← Inicio</Link>
    </div>
  )
}
