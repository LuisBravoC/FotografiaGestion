import { Link, useLocation } from 'react-router-dom'
import { Camera, Search, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { buscarAlumnos } from '../data.js'

export default function Topbar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  function handleChange(e) {
    const v = e.target.value
    setQuery(v)
    const r = buscarAlumnos(v)
    setResults(r)
    setOpen(r.length > 0)
  }

  function handleClear() {
    setQuery('')
    setResults([])
    setOpen(false)
  }

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <header className="topbar">
      <Link to="/" className="topbar-brand">
        <Camera size={22} />
        FotoGestión
      </Link>

      <div className="topbar-search" ref={wrapRef}>
        <Search size={15} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar alumno…"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          autoComplete="off"
        />
        {query && (
          <button
            onClick={handleClear}
            style={{ position: 'absolute', right: '.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
          >
            <X size={14} />
          </button>
        )}
        {open && (
          <div className="search-dropdown">
            {results.map(r => (
              <Link
                key={r.id}
                to={`/instituciones/${r.institucion?.id}/proyectos/${r.proyecto?.id}/grupos/${r.grupo?.id}/alumnos/${r.id}`}
                className="search-item"
                onClick={handleClear}
              >
                <span className="search-item-name">{r.nombre}</span>
                <span className="search-item-meta">
                  {r.institucion?.nombre} · Gen {r.proyecto?.año_ciclo} · {r.grupo?.nombre}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
