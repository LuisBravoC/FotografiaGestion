// ─── Paquetes disponibles ────────────────────────────────────────────────────
export const paquetes = [
  { id: 1, nombre: 'Básico',   precio: 350 },
  { id: 2, nombre: 'Estándar', precio: 550 },
  { id: 3, nombre: 'Premium',  precio: 800 },
]

// ─── Instituciones ───────────────────────────────────────────────────────────
export const instituciones = [
  { id: 1, nombre: 'Primaria Benito Juárez',  direccion: 'Calle Morelos 45, Col. Centro', contacto: 'Directora M. García' },
  { id: 2, nombre: 'Colegio Occidente',        direccion: 'Av. Las Palmas 200, Col. Norte', contacto: 'Director R. López' },
  { id: 3, nombre: 'Escuela Lázaro Cárdenas', direccion: 'Blvd. Insurgentes 88, Col. Sur',  contacto: 'Directora P. Ruiz' },
]

// ─── Proyectos (Generaciones) ─────────────────────────────────────────────────
export const proyectos = [
  { id: 1, institucion_id: 1, año_ciclo: '2023-2026', estatus: 'Finalizado' },
  { id: 2, institucion_id: 1, año_ciclo: '2024-2027', estatus: 'Activo' },
  { id: 3, institucion_id: 2, año_ciclo: '2023-2026', estatus: 'Finalizado' },
  { id: 4, institucion_id: 2, año_ciclo: '2024-2027', estatus: 'Activo' },
  { id: 5, institucion_id: 3, año_ciclo: '2024-2027', estatus: 'Activo' },
]

// ─── Grupos ───────────────────────────────────────────────────────────────────
export const grupos = [
  { id: 1, proyecto_id: 2, nombre: '6to A', turno: 'Matutino' },
  { id: 2, proyecto_id: 2, nombre: '6to B', turno: 'Vespertino' },
  { id: 3, proyecto_id: 4, nombre: '3ro B', turno: 'Matutino' },
  { id: 4, proyecto_id: 4, nombre: '3ro C', turno: 'Vespertino' },
  { id: 5, proyecto_id: 5, nombre: '6to A', turno: 'Matutino' },
]

// ─── Alumnos ──────────────────────────────────────────────────────────────────
export const alumnos = [
  { id: 1,  grupo_id: 1, nombre: 'Luis Bravo',       paquete_id: 2, estatus_entrega: 'Pendiente' },
  { id: 2,  grupo_id: 1, nombre: 'Ana Martínez',     paquete_id: 3, estatus_entrega: 'Entregado' },
  { id: 3,  grupo_id: 1, nombre: 'Carlos Reyes',     paquete_id: 1, estatus_entrega: 'Pendiente' },
  { id: 4,  grupo_id: 1, nombre: 'Sofía Torres',     paquete_id: 2, estatus_entrega: 'Entregado' },
  { id: 5,  grupo_id: 1, nombre: 'Diego Ramírez',    paquete_id: 3, estatus_entrega: 'Pendiente' },
  { id: 6,  grupo_id: 1, nombre: 'Valeria Gómez',    paquete_id: 1, estatus_entrega: 'Pendiente' },
  { id: 7,  grupo_id: 2, nombre: 'Marcos Hernández', paquete_id: 2, estatus_entrega: 'Pendiente' },
  { id: 8,  grupo_id: 2, nombre: 'Fernanda Castro',  paquete_id: 3, estatus_entrega: 'Entregado' },
  { id: 9,  grupo_id: 2, nombre: 'Ricardo Vega',     paquete_id: 1, estatus_entrega: 'Pendiente' },
  { id: 10, grupo_id: 2, nombre: 'Patricia Leal',    paquete_id: 2, estatus_entrega: 'Pendiente' },
  { id: 11, grupo_id: 3, nombre: 'Juan Morales',     paquete_id: 2, estatus_entrega: 'Entregado' },
  { id: 12, grupo_id: 3, nombre: 'Elena Sánchez',    paquete_id: 1, estatus_entrega: 'Pendiente' },
  { id: 13, grupo_id: 3, nombre: 'Roberto Díaz',     paquete_id: 3, estatus_entrega: 'Pendiente' },
  { id: 14, grupo_id: 4, nombre: 'Claudia Flores',   paquete_id: 2, estatus_entrega: 'Pendiente' },
  { id: 15, grupo_id: 4, nombre: 'Sergio Peña',      paquete_id: 1, estatus_entrega: 'Entregado' },
  { id: 16, grupo_id: 5, nombre: 'Andrea López',     paquete_id: 3, estatus_entrega: 'Pendiente' },
  { id: 17, grupo_id: 5, nombre: 'Miguel Ángel Cruz',paquete_id: 2, estatus_entrega: 'Entregado' },
  { id: 18, grupo_id: 5, nombre: 'Laura Jiménez',    paquete_id: 1, estatus_entrega: 'Pendiente' },
]

// ─── Pagos ────────────────────────────────────────────────────────────────────
export const pagos = [
  { id: 1,  alumno_id: 1,  monto: 200, fecha: '2026-01-10', metodo: 'Efectivo' },
  { id: 2,  alumno_id: 2,  monto: 550, fecha: '2026-01-15', metodo: 'Transferencia' },
  { id: 3,  alumno_id: 3,  monto: 175, fecha: '2026-01-12', metodo: 'Efectivo' },
  { id: 4,  alumno_id: 4,  monto: 550, fecha: '2026-02-01', metodo: 'Efectivo' },
  { id: 5,  alumno_id: 5,  monto: 400, fecha: '2026-02-05', metodo: 'Transferencia' },
  { id: 6,  alumno_id: 7,  monto: 300, fecha: '2026-02-10', metodo: 'Efectivo' },
  { id: 7,  alumno_id: 8,  monto: 800, fecha: '2026-02-12', metodo: 'Transferencia' },
  { id: 8,  alumno_id: 9,  monto: 350, fecha: '2026-02-20', metodo: 'Efectivo' },
  { id: 9,  alumno_id: 11, monto: 550, fecha: '2026-03-01', metodo: 'Transferencia' },
  { id: 10, alumno_id: 13, monto: 200, fecha: '2026-03-05', metodo: 'Efectivo' },
  { id: 11, alumno_id: 15, monto: 350, fecha: '2026-03-10', metodo: 'Efectivo' },
  { id: 12, alumno_id: 16, monto: 500, fecha: '2026-03-15', metodo: 'Transferencia' },
  { id: 13, alumno_id: 17, monto: 550, fecha: '2026-03-18', metodo: 'Transferencia' },
  { id: 14, alumno_id: 1,  monto: 150, fecha: '2026-03-20', metodo: 'Efectivo' },
  { id: 15, alumno_id: 5,  monto: 200, fecha: '2026-03-22', metodo: 'Efectivo' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getPaquete(id) {
  return paquetes.find(p => p.id === id)
}

export function getPagosAlumno(alumnoId) {
  return pagos.filter(p => p.alumno_id === alumnoId)
}

export function getSaldoAlumno(alumno) {
  const paquete = getPaquete(alumno.paquete_id)
  const totalPagado = getPagosAlumno(alumno.id).reduce((sum, p) => sum + p.monto, 0)
  const precio = paquete?.precio ?? 0
  return { precio, totalPagado, saldo: precio - totalPagado }
}

export function getEstatusColor(saldo) {
  if (saldo <= 0)  return 'liquidado'
  if (saldo > 0 && saldo < getPaquete(1)?.precio) return 'abonado'
  return 'deuda'
}

export function getEstatusAlumno(alumno) {
  const { precio, totalPagado, saldo } = getSaldoAlumno(alumno)
  if (saldo <= 0)            return 'liquidado'
  if (totalPagado > 0)       return 'abonado'
  return 'deuda'
}

export function getResumenGrupo(grupoId) {
  const miembros = alumnos.filter(a => a.grupo_id === grupoId)
  let totalEsperado = 0, totalCobrado = 0
  miembros.forEach(a => {
    const { precio, totalPagado } = getSaldoAlumno(a)
    totalEsperado += precio
    totalCobrado  += totalPagado
  })
  return { miembros: miembros.length, totalEsperado, totalCobrado, porCobrar: totalEsperado - totalCobrado }
}

export function getResumenProyecto(proyectoId) {
  const misGrupos = grupos.filter(g => g.proyecto_id === proyectoId)
  let totalEsperado = 0, totalCobrado = 0, totalAlumnos = 0
  misGrupos.forEach(g => {
    const r = getResumenGrupo(g.id)
    totalEsperado += r.totalEsperado
    totalCobrado  += r.totalCobrado
    totalAlumnos  += r.miembros
  })
  return { grupos: misGrupos.length, alumnos: totalAlumnos, totalEsperado, totalCobrado, porCobrar: totalEsperado - totalCobrado }
}

export function getResumenInstitucion(institucionId) {
  const misProyectos = proyectos.filter(p => p.institucion_id === institucionId && p.estatus === 'Activo')
  let totalEsperado = 0, totalCobrado = 0
  misProyectos.forEach(p => {
    const r = getResumenProyecto(p.id)
    totalEsperado += r.totalEsperado
    totalCobrado  += r.totalCobrado
  })
  return { totalEsperado, totalCobrado, porCobrar: totalEsperado - totalCobrado }
}

export function getResumenGlobal() {
  let totalEsperado = 0, totalCobrado = 0
  alumnos.forEach(a => {
    const { precio, totalPagado } = getSaldoAlumno(a)
    totalEsperado += precio
    totalCobrado  += totalPagado
  })
  return { totalEsperado, totalCobrado, porCobrar: totalEsperado - totalCobrado }
}

export function buscarAlumnos(query) {
  if (!query || query.trim().length < 2) return []
  const q = query.toLowerCase()
  return alumnos
    .filter(a => a.nombre.toLowerCase().includes(q))
    .map(a => {
      const grupo = grupos.find(g => g.id === a.grupo_id)
      const proyecto = proyectos.find(p => p.id === grupo?.proyecto_id)
      const institucion = instituciones.find(i => i.id === proyecto?.institucion_id)
      return { ...a, grupo, proyecto, institucion }
    })
}
