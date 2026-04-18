import { Link, NavLink } from 'react-router-dom'
import { Camera, Search, X, Settings, Building2, Package, BookImage } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { buscarAlumnos } from '../lib/queries.js'

export default function Topbar() {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [open,    setOpen]    = useState(false)
  const wrapRef   = useRef(null)
  const timerRef  = useRef(null)

  const doSearch = useCallback(async (v) => {
    if (!v || v.trim().length < 2) { setResults([]); setOpen(false); return }
    const r = await buscarAlumnos(v)
    setResults(r)
    setOpen(r.length > 0)
  }, [])

  function handleChange(e) {
    const v = e.target.value
    setQuery(v)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => doSearch(v), 300)
  }

  function handleClear() {
    setQuery('')
    setResults([])
    setOpen(false)
    clearTimeout(timerRef.current)
  }

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <header className="topbar">
      <Link to="/" className="topbar-brand">
        <Camera size={22} />
        <span className="nav-label">FotoGestión</span>
      </Link>

      <div className="topbar-search" ref={wrapRef}>
        <Search size={15} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar alumno o tutor…"
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
                <span className="search-item-name">{r.nombre_alumno}</span>
                <span className="search-item-meta">
                  Tutor: {r.nombre_tutor} · {r.institucion?.nombre} · {r.grupo?.nombre_grupo}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/*
      <Link to="/ajustes" className="topbar-icon-btn" title="Ajustes">
        <Settings size={18} />
      </Link>
      */}

      <nav className="topbar-nav">
        <NavLink to="/instituciones" className={({ isActive }) => 'topbar-nav-link' + (isActive ? ' active' : '')}>
          <Building2 size={15} /> <span className="nav-label">Instituciones</span>
        </NavLink>
        <NavLink to="/ajustes" className={({ isActive }) => 'topbar-nav-link' + (isActive ? ' active' : '')}>
          <BookImage size={15} /> <span className="nav-label">Paquetes</span>
        </NavLink>
      </nav>

    </header>
  )
}
