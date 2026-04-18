import { MessageCircle } from 'lucide-react'

const fmt = n => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

/**
 * Props:
 *   nombreTutor   — string
 *   nombreAlumno  — string
 *   telefono      — string (10 dígitos, sin código de país)
 *   saldo         — number
 */
export default function WhatsAppBtn({ nombreTutor, nombreAlumno, telefono, saldo }) {
  const phone  = '52' + (telefono ?? '').replace(/\D/g, '')
  const saldoFmt = fmt(saldo)
  const msg = `Hola ${nombreTutor}, le recordamos que el saldo pendiente de *${nombreAlumno}* es de *${saldoFmt}*. Puede comunicarse con nosotros para realizar su pago. ¡Gracias!`
  const url  = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-wa"
      title={`WhatsApp a ${nombreTutor}`}
    >
      <MessageCircle size={15} />
    </a>
  )
}
