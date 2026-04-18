import { Link, useParams } from 'react-router-dom'
import { AlertCircle, CreditCard, Package, CheckCircle2, Phone, User, MessageSquare } from 'lucide-react'
import { useQuery } from '../lib/useQuery.js'
import * as q from '../lib/queries.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import WhatsAppBtn from '../components/WhatsAppBtn.jsx'
import LoadingSpinner, { ErrorMsg } from '../components/LoadingSpinner.jsx'

const fmt = n => Number(n).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

export default function AlumnoDetail() {
  const { instId, proyId, grupoId, alumnoId } = useParams()

  const instQ    = useQuery(() => q.getInstitucion(Number(instId)), [instId])
  const proyQ    = useQuery(() => q.getProyecto(Number(proyId)), [proyId])
  const grupoQ   = useQuery(() => q.getGrupo(Number(grupoId)), [grupoId])
  const alumnoQ  = useQuery(() => q.getAlumno(Number(alumnoId)), [alumnoId])
  const pagosQ   = useQuery(() => q.getPagosByAlumno(Number(alumnoId)), [alumnoId])

  if (instQ.loading || proyQ.loading || grupoQ.loading || alumnoQ.loading)
    return <LoadingSpinner text="Cargando alumno…" />
  if (alumnoQ.error) return <ErrorMsg message={alumnoQ.error} />
  if (!instQ.data || !proyQ.data || !grupoQ.data || !alumnoQ.data) return <NotFound />

  const inst    = instQ.data
  const proy    = proyQ.data
  const grupo   = grupoQ.data
  const alumno  = alumnoQ.data
  const historial = (pagosQ.data ?? [])
  const saldo   = Number(alumno.saldo_pendiente)
  const iniciales = alumno.nombre_alumno.split(' ').map(w => w[0]).slice(0, 2).join('')

  const crumbs = [
    { label: 'Dashboard', to: '/' },
    { label: 'Instituciones', to: '/instituciones' },
    { label: inst.nombre, to: `/instituciones/${inst.id}` },
    { label: `Gen ${proy.año_ciclo}`, to: `/instituciones/${inst.id}/proyectos/${proy.id}` },
    { label: grupo.nombre_grupo, to: `/instituciones/${inst.id}/proyectos/${proy.id}/grupos/${grupo.id}` },
    { label: alumno.nombre_alumno },
  ]

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <div className="page">

        {/* ── Header alumno ──────────────────────────── */}
        <div className="alumno-header">
          <div className="alumno-avatar">{iniciales}</div>
          <div className="alumno-info">
            <h2>{alumno.nombre_alumno}</h2>
            <p>{inst.nombre} · Gen {proy.año_ciclo} · {grupo.nombre_grupo}</p>
          </div>
          <StatusBadge status={alumno.estatus_pago} />
        </div>

        {/* ── Tutor / Contacto ───────────────────────── */}
        <div className="card tutor-card">
          <div className="tutor-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <User size={15} style={{ color: 'var(--accent-light)', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Tutor / Contacto</span>
                <div style={{ fontWeight: 600 }}>{alumno.nombre_tutor}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', color: 'var(--text-muted)', fontSize: '.88rem' }}>
                <Phone size={13} />
                <a href={`tel:${alumno.telefono_contacto}`} style={{ color: 'var(--text-muted)' }}>
                  {alumno.telefono_contacto}
                </a>
              </div>
              {saldo > 0 && (
                <WhatsAppBtn
                  nombreTutor={alumno.nombre_tutor}
                  nombreAlumno={alumno.nombre_alumno}
                  telefono={alumno.telefono_contacto}
                  saldo={saldo}
                />
              )}
            </div>
          </div>
          {alumno.comentarios && (
            <div style={{ marginTop: '.75rem', paddingTop: '.75rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '.5rem', fontSize: '.85rem', color: 'var(--text-muted)' }}>
              <MessageSquare size={14} style={{ flexShrink: 0, marginTop: '.15rem', color: 'var(--accent-light)' }} />
              <span>{alumno.comentarios}</span>
            </div>
          )}
        </div>

        {/* ── Saldo ──────────────────────────────────── */}
        <div className="saldo-box">
          <div className="saldo-item">
            <label><Package size={12} style={{ verticalAlign: 'middle' }} /> Paquete</label>
            <span style={{ color: 'var(--accent-light)', fontSize: '1rem' }}>{alumno.paquete_titulo}</span>
          </div>
          <div className="saldo-item">
            <label>Precio</label>
            <span style={{ color: 'var(--accent-light)' }}>{fmt(alumno.precio_paquete)}</span>
          </div>
          <div className="saldo-item">
            <label>Pagado</label>
            <span style={{ color: 'var(--liquidado)' }}>{fmt(alumno.total_pagado)}</span>
          </div>
          <div className="saldo-item">
            <label>Saldo pendiente</label>
            <span style={{ color: saldo > 0 ? 'var(--abonado)' : 'var(--liquidado)', fontWeight: 700 }}>
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

        <ProgressBar value={Number(alumno.total_pagado)} max={Number(alumno.precio_paquete)} />

        {/* ── Historial de pagos ─────────────────────── */}
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
                      <span>{p.metodo_pago}</span>
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
