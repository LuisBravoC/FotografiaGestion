import { Link, useParams } from 'react-router-dom'
import { Users, AlertCircle, Download } from 'lucide-react'
import { useQuery } from '../lib/useQuery.js'
import * as q from '../lib/queries.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import WhatsAppBtn from '../components/WhatsAppBtn.jsx'
import LoadingSpinner, { ErrorMsg } from '../components/LoadingSpinner.jsx'

const fmt = n => Number(n).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

export default function AlumnosList() {
  const { instId, proyId, grupoId } = useParams()
  const instQ    = useQuery(() => q.getInstitucion(Number(instId)), [instId])
  const proyQ    = useQuery(() => q.getProyecto(Number(proyId)), [proyId])
  const grupoQ   = useQuery(() => q.getGrupo(Number(grupoId)), [grupoId])
  const alumnosQ = useQuery(() => q.getAlumnosByGrupo(Number(grupoId)), [grupoId])
  const resumenQ = useQuery(() => q.getResumenGrupo(Number(grupoId)), [grupoId])

  if (instQ.loading || proyQ.loading || grupoQ.loading || alumnosQ.loading)
    return <LoadingSpinner text="Cargando alumnos…" />
  if (instQ.error || proyQ.error || grupoQ.error)
    return <ErrorMsg message={instQ.error ?? proyQ.error ?? grupoQ.error} />
  if (!instQ.data || !proyQ.data || !grupoQ.data) return <NotFound />

  const inst    = instQ.data
  const proy    = proyQ.data
  const grupo   = grupoQ.data
  const miembros = alumnosQ.data ?? []
  const resumen  = resumenQ.data ?? { miembros: 0, totalEsperado: 0, totalCobrado: 0, porCobrar: 0 }

  const crumbs = [
    { label: 'Dashboard', to: '/' },
    { label: 'Instituciones', to: '/instituciones' },
    { label: inst.nombre, to: `/instituciones/${inst.id}` },
    { label: `Gen ${proy.año_ciclo}`, to: `/instituciones/${inst.id}/proyectos/${proy.id}` },
    { label: grupo.nombre_grupo },
  ]

  function exportCSV() {
    const rows = [['Alumno', 'Tutor', 'Teléfono', 'Paquete', 'Precio', 'Pagado', 'Saldo', 'Estatus', 'Entrega']]
    miembros.forEach(a => {
      rows.push([
        a.nombre_alumno, a.nombre_tutor, a.telefono_contacto,
        a.paquete_titulo, a.precio_paquete, a.total_pagado, a.saldo_pendiente,
        a.estatus_pago, a.estatus_entrega
      ])
    })
    const csv  = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const el   = document.createElement('a')
    el.href = url; el.download = `${grupo.nombre_grupo}-alumnos.csv`; el.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <h1 className="page-title" style={{ margin: 0 }}>
            <Users size={22} /> {grupo.nombre_grupo} — {grupo.turno}
          </h1>
          <button className="btn btn-outline" onClick={exportCSV}>
            <Download size={15} /> Exportar CSV
          </button>
        </div>

        <div className="saldo-box" style={{ marginBottom: '1.5rem' }}>
          <div className="saldo-item"><label>Alumnos</label><span style={{ color: 'var(--accent-light)' }}>{resumen.miembros}</span></div>
          <div className="saldo-item"><label>Esperado</label><span style={{ color: 'var(--accent-light)' }}>{fmt(resumen.totalEsperado)}</span></div>
          <div className="saldo-item"><label>Cobrado</label><span style={{ color: 'var(--liquidado)' }}>{fmt(resumen.totalCobrado)}</span></div>
          <div className="saldo-item"><label>Por cobrar</label><span style={{ color: 'var(--abonado)' }}>{fmt(resumen.porCobrar)}</span></div>
        </div>
        <ProgressBar value={resumen.totalCobrado} max={resumen.totalEsperado} />

        <p className="section-heading">Lista de alumnos</p>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Alumno</th><th>Tutor</th><th>Paquete</th>
                  <th>Precio</th><th>Pagado</th><th>Saldo</th>
                  <th>Estatus</th><th>Entrega</th><th></th>
                </tr>
              </thead>
              <tbody>
                {miembros.map(a => (
                  <tr key={a.id}>
                    <td className="td-name">
                      <Link
                        to={`/instituciones/${inst.id}/proyectos/${proy.id}/grupos/${grupo.id}/alumnos/${a.id}`}
                        style={{ color: 'var(--accent-light)', textDecoration: 'none' }}
                      >
                        {a.nombre_alumno}
                      </Link>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>{a.nombre_tutor}</td>
                    <td>{a.paquete_titulo}</td>
                    <td>{fmt(a.precio_paquete)}</td>
                    <td style={{ color: 'var(--liquidado)' }}>{fmt(a.total_pagado)}</td>
                    <td style={{ color: Number(a.saldo_pendiente) > 0 ? 'var(--abonado)' : 'var(--liquidado)', fontWeight: 600 }}>
                      {fmt(a.saldo_pendiente)}
                    </td>
                    <td><StatusBadge status={a.estatus_pago} /></td>
                    <td>
                      <span className={`badge ${a.estatus_entrega === 'Entregado' ? 'badge-liquidado' : 'badge-abonado'}`}>
                        {a.estatus_entrega}
                      </span>
                    </td>
                    <td>
                      {Number(a.saldo_pendiente) > 0 && (
                        <WhatsAppBtn
                          nombreTutor={a.nombre_tutor}
                          nombreAlumno={a.nombre_alumno}
                          telefono={a.telefono_contacto}
                          saldo={Number(a.saldo_pendiente)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
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
