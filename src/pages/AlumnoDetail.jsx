import { Link, useParams } from 'react-router-dom'
import { AlertCircle, CreditCard, Package, CheckCircle2 } from 'lucide-react'
import {
  instituciones, proyectos, grupos, alumnos,
  getSaldoAlumno, getEstatusAlumno, getPaquete, getPagosAlumno
} from '../data.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import ProgressBar from '../components/ProgressBar.jsx'

const fmt = n => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

export default function AlumnoDetail() {
  const { instId, proyId, grupoId, alumnoId } = useParams()
  const inst   = instituciones.find(i => i.id === Number(instId))
  const proy   = proyectos.find(p => p.id === Number(proyId))
  const grupo  = grupos.find(g => g.id === Number(grupoId))
  const alumno = alumnos.find(a => a.id === Number(alumnoId))
  if (!inst || !proy || !grupo || !alumno) return <NotFound />

  const paq          = getPaquete(alumno.paquete_id)
  const { precio, totalPagado, saldo } = getSaldoAlumno(alumno)
  const status       = getEstatusAlumno(alumno)
  const historial    = getPagosAlumno(alumno.id).sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  const iniciales    = alumno.nombre.split(' ').map(w => w[0]).slice(0, 2).join('')

  const crumbs = [
    { label: 'Dashboard', to: '/' },
    { label: 'Instituciones', to: '/instituciones' },
    { label: inst.nombre, to: `/instituciones/${inst.id}` },
    { label: `Gen ${proy.año_ciclo}`, to: `/instituciones/${inst.id}/proyectos/${proy.id}` },
    { label: grupo.nombre, to: `/instituciones/${inst.id}/proyectos/${proy.id}/grupos/${grupo.id}` },
    { label: alumno.nombre },
  ]

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <div className="page">

        {/* Header */}
        <div className="alumno-header">
          <div className="alumno-avatar">{iniciales}</div>
          <div className="alumno-info">
            <h2>{alumno.nombre}</h2>
            <p>{inst.nombre} · Gen {proy.año_ciclo} · {grupo.nombre}</p>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Saldo */}
        <div className="saldo-box">
          <div className="saldo-item">
            <label><Package size={12} style={{ verticalAlign: 'middle' }} /> Paquete</label>
            <span style={{ color: 'var(--accent-light)', fontSize: '1rem' }}>{paq?.nombre}</span>
          </div>
          <div className="saldo-item">
            <label>Precio</label>
            <span style={{ color: 'var(--accent-light)' }}>{fmt(precio)}</span>
          </div>
          <div className="saldo-item">
            <label>Pagado</label>
            <span style={{ color: 'var(--liquidado)' }}>{fmt(totalPagado)}</span>
          </div>
          <div className="saldo-item">
            <label>Saldo pendiente</label>
            <span style={{ color: saldo > 0 ? 'var(--abonado)' : 'var(--liquidado)' }}>
              {fmt(saldo)}
            </span>
          </div>
          <div className="saldo-item">
            <label><CheckCircle2 size={12} style={{ verticalAlign: 'middle' }} /> Entrega</label>
            <span style={{ fontSize: '1rem', color: alumno.estatus_entrega === 'Entregado' ? 'var(--liquidado)' : 'var(--abonado)' }}>
              {alumno.estatus_entrega}
            </span>
          </div>
        </div>

        <ProgressBar value={totalPagado} max={precio} />

        {/* Historial de pagos */}
        <p className="section-heading">Historial de pagos</p>
        {historial.length === 0
          ? <p style={{ color: 'var(--text-muted)', fontSize: '.88rem' }}>Sin pagos registrados.</p>
          : (
            <div className="pagos-list">
              {historial.map(p => (
                <div key={p.id} className="pago-row">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                      <CreditCard size={14} style={{ color: 'var(--accent-light)' }} />
                      <span>{p.metodo}</span>
                    </div>
                    <div className="pago-meta">{p.fecha}</div>
                  </div>
                  <span className="pago-monto">+{fmt(p.monto)}</span>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </>
  )
}

function NotFound() {
  return (
    <div className="page empty">
      <AlertCircle size={48} />
      <p>Alumno no encontrado.</p>
      <Link to="/" style={{ color: 'var(--accent-light)' }}>← Inicio</Link>
    </div>
  )
}
