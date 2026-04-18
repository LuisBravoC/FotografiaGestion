import { useState } from 'react'
import { Settings, Pencil, Trash2, Plus, CheckCircle2 } from 'lucide-react'
import { useQuery } from '../lib/useQuery.js'
import * as q from '../lib/queries.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import LoadingSpinner, { ErrorMsg } from '../components/LoadingSpinner.jsx'
import Drawer from '../components/Drawer.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import TagsInput from '../components/TagsInput.jsx'

const fmt = n => Number(n).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

const EMPTY = { titulo: '', descripcion: '', precio: '', que_incluye: [] }

const crumbs = [
  { label: 'Dashboard', to: '/' },
  { label: 'Ajustes' },
]

export default function Ajustes() {
  const [refresh, setRefresh] = useState(0)
  const { data, loading, error } = useQuery(() => q.getPaquetes(), [refresh])

  const [drawer,  setDrawer]  = useState(null)
  const [form,    setForm]    = useState(EMPTY)
  const [saving,  setSaving]  = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [toast,   setToast]   = useState(false)

  const set  = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const done = ()     => {
    setRefresh(r => r + 1); setDrawer(null)
    setToast(true); setTimeout(() => setToast(false), 3000)
  }

  function openCreate() { setForm(EMPTY); setDrawer({ mode: 'create' }) }
  function openEdit(p) {
    setForm({ titulo: p.titulo, descripcion: p.descripcion ?? '', precio: String(p.precio), que_incluye: p.que_incluye ?? [] })
    setDrawer({ mode: 'edit', record: p })
  }

  async function handleSave() {
    if (!form.titulo.trim()) return alert('El título es requerido')
    if (!form.precio || Number(form.precio) < 0) return alert('El precio debe ser válido')
    setSaving(true)
    try {
      const payload = { titulo: form.titulo.trim(), descripcion: form.descripcion.trim(), precio: Number(form.precio), que_incluye: form.que_incluye }
      if (drawer.mode === 'create') await q.insertPaquete(payload)
      else await q.updatePaquete(drawer.record.id, payload)
      done()
    } catch (e) { alert('Error: ' + (e.message ?? e)) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    setSaving(true)
    try { await q.deletePaquete(confirm); setConfirm(null); setRefresh(r => r + 1) }
    catch (e) { alert('Error al eliminar: ' + (e.message ?? e)) }
    finally { setSaving(false) }
  }

  if (loading) return <><Breadcrumbs crumbs={crumbs} /><LoadingSpinner text="Cargando paquetes…" /></>
  if (error)   return <ErrorMsg message={error} />

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <div className="page">
        <div className="page-title-row">
          <h1 className="page-title" style={{ margin: 0 }}><Settings size={22} /> Ajustes — Paquetes</h1>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={15} /> Nuevo paquete</button>
        </div>

        {toast && (
          <div className="ajustes-toast" style={{ marginBottom: '1.25rem' }}>
            <CheckCircle2 size={16} /> Cambios guardados correctamente
          </div>
        )}

        <div className="grid grid-auto">
          {(data ?? []).map(p => (
            <div key={p.id} className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">{p.titulo}</div>
                  <div className="card-sub" style={{ marginTop: '.2rem' }}>{fmt(p.precio)}</div>
                </div>
                <div className="card-actions">
                  <button className="btn-icon" title="Editar" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                  <button className="btn-icon danger" title="Eliminar" onClick={() => setConfirm(p.id)}><Trash2 size={14} /></button>
                </div>
              </div>
              {p.descripcion && <p style={{ fontSize: '.83rem', color: 'var(--text-muted)', margin: '.5rem 0' }}>{p.descripcion}</p>}
              {(p.que_incluye ?? []).length > 0 && (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.25rem', marginTop: '.5rem' }}>
                  {p.que_incluye.map((item, i) => (
                    <li key={i} style={{ fontSize: '.82rem', color: 'var(--liquidado)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                      <span style={{ opacity: .6 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {(data ?? []).length === 0 && <p className="empty">Sin paquetes. Crea el primero.</p>}
        </div>
      </div>

      {drawer && (
        <Drawer
          title={drawer.mode === 'create' ? 'Nuevo paquete' : 'Editar paquete'}
          onClose={() => setDrawer(null)} onSave={handleSave} saving={saving}
        >
          <div className="field"><label>Título *</label>
            <input value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="ej. Premium" autoFocus />
          </div>
          <div className="field"><label>Precio (MXN) *</label>
            <input type="number" min="0" value={form.precio} onChange={e => set('precio', e.target.value)} placeholder="ej. 800" />
          </div>
          <div className="field"><label>Descripción</label>
            <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="Descripción breve del paquete…" />
          </div>
          <div className="field">
            <label>Qué incluye</label>
            <TagsInput value={form.que_incluye} onChange={v => set('que_incluye', v)} />
          </div>
        </Drawer>
      )}

      {confirm !== null && (
        <ConfirmModal
          message="¿Eliminar este paquete? Asegúrate de que ningún alumno lo tenga asignado."
          onConfirm={handleDelete} onCancel={() => setConfirm(null)} loading={saving}
        />
      )}
    </>
  )
}
