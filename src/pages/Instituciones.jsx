import { Link } from 'react-router-dom'
import { Building2, MapPin, User, ArrowRight } from 'lucide-react'
import { instituciones, getResumenInstitucion } from '../data.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import ProgressBar from '../components/ProgressBar.jsx'

const fmt = n => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

const crumbs = [
  { label: 'Dashboard', to: '/' },
  { label: 'Instituciones' },
]

export default function Instituciones() {
  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <div className="page">
        <h1 className="page-title"><Building2 size={22} /> Instituciones</h1>
        <div className="grid grid-auto">
          {instituciones.map(inst => {
            const res = getResumenInstitucion(inst.id)
            return (
              <Link key={inst.id} to={`/instituciones/${inst.id}`} className="card card-link">
                <div className="card-header">
                  <div>
                    <div className="card-title">{inst.nombre}</div>
                  </div>
                  <Building2 size={20} className="card-icon" />
                </div>
                <div style={{ fontSize: '.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '.3rem', marginBottom: '.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                    <MapPin size={13} /> {inst.direccion}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                    <User size={13} /> {inst.contacto}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '.25rem' }}>
                  <span>Cobrado: <strong style={{ color: 'var(--liquidado)' }}>{fmt(res.totalCobrado)}</strong></span>
                  <span>Falta: <strong style={{ color: 'var(--abonado)' }}>{fmt(res.porCobrar)}</strong></span>
                </div>
                <ProgressBar value={res.totalCobrado} max={res.totalEsperado} />
                <div style={{ marginTop: '.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '.8rem', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: '.2rem' }}>
                    Generaciones <ArrowRight size={13} />
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
