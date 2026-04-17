import { Link } from 'react-router-dom'
import {
  DollarSign, TrendingUp, Users, Building2,
  ArrowRight, Activity
} from 'lucide-react'
import {
  instituciones, proyectos,
  getResumenGlobal, getResumenInstitucion
} from '../data.js'
import ProgressBar from '../components/ProgressBar.jsx'

const fmt = n => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

export default function Dashboard() {
  const global = getResumenGlobal()
  const activos = proyectos.filter(p => p.estatus === 'Activo').length

  return (
    <div className="page">
      <h1 className="page-title"><Activity size={22} /> Dashboard Global</h1>

      {/* ── Stat cards ─────────────────────────────────── */}
      <div className="grid grid-stats" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <div className="stat-value esperado">
            {fmt(global.totalEsperado)}
          </div>
          <div className="stat-label">Total esperado</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value cobrado">
            {fmt(global.totalCobrado)}
          </div>
          <div className="stat-label">Total cobrado</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value por-cobrar">
            {fmt(global.porCobrar)}
          </div>
          <div className="stat-label">Por cobrar</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-light)' }}>
            {activos}
          </div>
          <div className="stat-label">Proyectos activos</div>
        </div>
      </div>

      <ProgressBar value={global.totalCobrado} max={global.totalEsperado} />

      {/* ── Instituciones rápido ───────────────────────── */}
      <p className="section-heading">Instituciones — resumen activo</p>
      <div className="grid grid-auto">
        {instituciones.map(inst => {
          const res = getResumenInstitucion(inst.id)
          return (
            <Link
              key={inst.id}
              to={`/instituciones/${inst.id}`}
              className="card card-link"
            >
              <div className="card-header">
                <div>
                  <div className="card-title">{inst.nombre}</div>
                  <div className="card-sub">{inst.contacto}</div>
                </div>
                <Building2 size={20} className="card-icon" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem', color: 'var(--text-muted)', margin: '.5rem 0 .25rem' }}>
                <span>Cobrado: <strong style={{ color: 'var(--liquidado)' }}>{fmt(res.totalCobrado)}</strong></span>
                <span>Falta: <strong style={{ color: 'var(--abonado)' }}>{fmt(res.porCobrar)}</strong></span>
              </div>
              <ProgressBar value={res.totalCobrado} max={res.totalEsperado} />
              <div style={{ marginTop: '.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '.8rem', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: '.2rem' }}>
                  Ver detalle <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
