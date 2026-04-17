import { Link, useParams } from 'react-router-dom'
import { Users, AlertCircle, Download } from 'lucide-react'
import {
  instituciones, proyectos, grupos, alumnos,
  getSaldoAlumno, getEstatusAlumno, getPaquete, getResumenGrupo
} from '../data.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import ProgressBar from '../components/ProgressBar.jsx'

const fmt = n => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

export default function AlumnosList() {
  const { instId, proyId, grupoId } = useParams()
  const inst  = instituciones.find(i => i.id === Number(instId))
  const proy  = proyectos.find(p => p.id === Number(proyId))
  const grupo = grupos.find(g => g.id === Number(grupoId))
  if (!inst || !proy || !grupo) return <NotFound />

  const miembros = alumnos.filter(a => a.grupo_id === grupo.id)
  const resumen  = getResumenGrupo(grupo.id)

  const crumbs = [
    { label: 'Dashboard', to: '/' },
    { label: 'Instituciones', to: '/instituciones' },
    { label: inst.nombre, to: `/instituciones/${inst.id}` },
    { label: `Gen ${proy.año_ciclo}`, to: `/instituciones/${inst.id}/proyectos/${proy.id}` },
    { label: grupo.nombre },
  ]

  function exportCSV() {
    const rows = [['Nombre', 'Paquete', 'Precio', 'Pagado', 'Saldo', 'Estatus', 'Entrega']]
    miembros.forEach(a => {
      const paq = getPaquete(a.paquete_id)
      const { precio, totalPagado, saldo } = getSaldoAlumno(a)
      rows.push([a.nombre, paq?.nombre, precio, totalPagado, saldo, getEstatusAlumno(a), a.estatus_entrega])
    })
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `${grupo.nombre}-alumnos.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <h1 className="page-title" style={{ margin: 0 }}>
            <Users size={22} /> {grupo.nombre} — {grupo.turno}
          </h1>
          <button className="btn btn-outline" onClick={exportCSV}>
            <Download size={15} /> Exportar CSV
          </button>
        </div>

        {/* Summary */}
        <div className="saldo-box" style={{ marginBottom: '1.5rem' }}>
          <div className="saldo-item">
            <label>Alumnos</label>
            <span style={{ color: 'var(--accent-light)' }}>{resumen.miembros}</span>
          </div>
          <div className="saldo-item">
            <label>Esperado</label>
            <span style={{ color: 'var(--accent-light)' }}>{fmt(resumen.totalEsperado)}</span>
          </div>
          <div className="saldo-item">
            <label>Cobrado</label>
            <span style={{ color: 'var(--liquidado)' }}>{fmt(resumen.totalCobrado)}</span>
          </div>
          <div className="saldo-item">
            <label>Por cobrar</label>
            <span style={{ color: 'var(--abonado)' }}>{fmt(resumen.porCobrar)}</span>
          </div>
        </div>
        <ProgressBar value={resumen.totalCobrado} max={resumen.totalEsperado} />

        {/* Table */}
        <p className="section-heading">Lista de alumnos</p>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Paquete</th>
                  <th>Precio</th>
                  <th>Pagado</th>
                  <th>Saldo</th>
                  <th>Estatus</th>
                  <th>Entrega</th>
                </tr>
              </thead>
              <tbody>
                {miembros.map(a => {
                  const paq = getPaquete(a.paquete_id)
                  const { precio, totalPagado, saldo } = getSaldoAlumno(a)
                  const status = getEstatusAlumno(a)
                  return (
                    <tr key={a.id}>
                      <td className="td-name">
                        <Link
                          to={`/instituciones/${inst.id}/proyectos/${proy.id}/grupos/${grupo.id}/alumnos/${a.id}`}
                          style={{ color: 'var(--accent-light)', textDecoration: 'none' }}
                        >
                          {a.nombre}
                        </Link>
                      </td>
                      <td>{paq?.nombre}</td>
                      <td>{fmt(precio)}</td>
                      <td style={{ color: 'var(--liquidado)' }}>{fmt(totalPagado)}</td>
                      <td style={{ color: saldo > 0 ? 'var(--abonado)' : 'var(--liquidado)', fontWeight: 600 }}>
                        {fmt(saldo)}
                      </td>
                      <td><StatusBadge status={status} /></td>
                      <td>
                        <span className={`badge ${a.estatus_entrega === 'Entregado' ? 'badge-liquidado' : 'badge-abonado'}`}>
                          {a.estatus_entrega}
                        </span>
                      </td>
                    </tr>
                  )
                })}
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
