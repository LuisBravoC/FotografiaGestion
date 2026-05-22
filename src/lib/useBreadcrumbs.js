import { useLocation, useParams } from 'react-router-dom'

// Static path segments → display label.  null = hidden connector segment.
const SEGMENT_LABEL = {
  instituciones: 'Instituciones',
  proyectos:     null,
  grupos:        null,
  alumnos:       null,
  ajustes:       'Ajustes',
  paquetes:      'Paquetes',
  deudas:        'Deudas pendientes',
  opciones:      'Opciones',
}

/**
 * Auto-generates breadcrumbs from the current URL.
 * Pass labels for dynamic param segments, keyed by param name.
 *
 * Example:
 *   useBreadcrumbs({ instId: inst.nombre, proyId: `Gen ${proy.año_ciclo}`,
 *                    grupoId: grupo.nombre_grupo, alumnoId: alumno.nombre_alumno })
 */
export function useBreadcrumbs(labels = {}) {
  const { pathname } = useLocation()
  const params = useParams()

  // Build an ORDERED list of labels in URL order.
  // Using the param value as map key causes collisions when two params share
  // the same numeric ID (e.g. instId=1 and grupoId=1 → same label overwrites).
  // Instead, we consume labels sequentially as we encounter dynamic segments.
  const orderedLabels = Object.entries(labels)
    .filter(([key, label]) => params[key] != null && label != null)
    .map(([, label]) => label)

  const segments = pathname.split('/').filter(Boolean)
  const crumbs = [{ label: 'Dashboard', to: '/' }]
  let path = ''
  let labelIdx = 0

  for (const seg of segments) {
    path += '/' + seg

    if (seg in SEGMENT_LABEL) {
      const label = SEGMENT_LABEL[seg]
      if (label === null) continue   // skip connector segment (proyectos, grupos, alumnos)
      const isLast = path === '/' + segments.join('/')
      crumbs.push({ label, ...(isLast ? {} : { to: path }) })
    } else {
      // Dynamic segment — consume next label from the ordered list
      if (labelIdx >= orderedLabels.length) continue
      const label = orderedLabels[labelIdx++]
      const isLast = path === '/' + segments.join('/')
      crumbs.push({ label, ...(isLast ? {} : { to: path }) })
    }
  }

  return crumbs
}
