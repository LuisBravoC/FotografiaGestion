import { useState, useEffect } from 'react'
import { Settings, Save, CheckCircle2, Package, ChevronDown, ChevronUp } from 'lucide-react'
import { getPaquetes, updatePaquete } from '../lib/queries.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import LoadingSpinner, { ErrorMsg } from '../components/LoadingSpinner.jsx'

const crumbs = [
  { label: 'Dashboard', to: '/' },
  { label: 'Ajustes' },
]

export default function Ajustes() {
  const [paquetes, setPaquetes] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [saved,    setSaved]    = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [open,     setOpen]     = useState({})

  useEffect(() => {
    getPaquetes()
      .then(data => { setPaquetes(data); setLoading(false) })
      .catch(e   => { setError(e.message ?? String(e)); setLoading(false) })
  }, [])

  if (loading) return <><Breadcrumbs crumbs={crumbs} /><LoadingSpinner text="Cargando paquetes…" /></>
  if (error)   return <ErrorMsg message={error} />

  function handleChange(id, field, value) {
    setPaquetes(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, [field]: field === 'precio' ? (value === '' ? '' : Number(value)) : value }
          : p
      )
    )
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await Promise.all(
        paquetes.map(p => updatePaquete(p.id, { titulo: p.titulo, precio: Number(p.precio), descripcion: p.descripcion }))
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } catch (e) {
      alert('Error al guardar: ' + (e.message ?? String(e)))
    } finally {
      setSaving(false)
    }
  }

  function toggleOpen(id) {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <h1 className="page-title" style={{ margin: 0 }}>
            <Settings size={22} /> Ajustes — Paquetes
          </h1>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saved
              ? <><CheckCircle2 size={15} /> Guardado</>
              : saving
              ? <><Save size={15} /> Guardando…</>
              : <><Save size={15} /> Guardar cambios</>
            }
          </button>
        </div>

        {saved && (
          <div className="ajustes-toast">
            <CheckCircle2 size={16} />
            Los precios se actualizaron. Los saldos pendientes de todos los alumnos reflejarán el cambio automáticamente.
          </div>
        )}

        <p style={{ color: 'var(--text-muted)', fontSize: '.88rem', marginBottom: '1.5rem' }}>
          Edita el título, descripción y precio de cada paquete. Al guardar, el saldo pendiente de todos los alumnos se recalcula automáticamente.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {paquetes.map(p => (
            <div key={p.id} className="card ajustes-paq-card">
              {/* Header clickable */}
              <button
                className="ajustes-paq-toggle"
                onClick={() => toggleOpen(p.id)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                  <Package size={18} style={{ color: 'var(--accent-light)' }} />
                  <span style={{ fontWeight: 700 }}>{p.titulo}</span>
                  <span style={{ color: 'var(--liquidado)', fontWeight: 700 }}>
                    ${p.precio.toLocaleString('es-MX')}
                  </span>
                </span>
                {open[p.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {/* Editable fields */}
              {open[p.id] && (
                <div className="ajustes-paq-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Título del paquete</label>
                      <input
                        type="text"
                        value={p.titulo}
                        onChange={e => handleChange(p.id, 'titulo', e.target.value)}
                      />
                    </div>
                    <div className="form-group form-group--sm">
                      <label>Precio (MXN)</label>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={p.precio}
                        onChange={e => handleChange(p.id, 'precio', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <input
                      type="text"
                      value={p.descripcion}
                      onChange={e => handleChange(p.id, 'descripcion', e.target.value)}
                    />
                  </div>

                  {/* Que incluye — display only */}
                  <div style={{ marginTop: '.75rem' }}>
                    <p style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                      Qué incluye
                    </p>
                    <ul className="incluye-list">
                      {p.que_incluye.map((item, i) => (
                        <li key={i}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
