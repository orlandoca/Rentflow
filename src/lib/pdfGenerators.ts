import { jsPDF } from 'jspdf'
import { Tenant, Unit, Building, Payment } from '@/types'

interface ContractData {
  tenant: Tenant
  unit: Unit
  building: Building
  startDate: string
  endDate: string
  monthlyAmount: number
  depositAmount: number
}

interface ReceiptData {
  payment: Payment
  tenant: Tenant
  unit: Unit
  building: Building
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-PY').format(price)
}

export const generateContractPDF = (data: ContractData) => {
  const doc = new jsPDF()
  const margin = 20
  let y = 30

  const addText = (text: string, fontSize = 11, isBold = false, align: 'left' | 'center' | 'justify' = 'justify') => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    
    if (align === 'center') {
      doc.text(text, 105, y, { align: 'center' })
      y += fontSize * 0.8
    } else {
      const splitText = doc.splitTextToSize(text, 170)
      doc.text(splitText, margin, y)
      y += (splitText.length * fontSize * 0.6) + 5
    }
  }

  addText('CONTRATO DE ALQUILER DE INMUEBLE', 16, true, 'center')
  y += 10

  const intro = `Entre el Propietario/Administrador (en adelante "EL LOCADOR") y por la otra parte el Sr./Sra. ${data.tenant.full_name}, con C.I. Nº ${data.tenant.ci} (en adelante "EL LOCATARIO"), convienen en celebrar el presente Contrato de Alquiler, sujeto a las siguientes cláusulas:`
  addText(intro)

  addText('PRIMERA: OBJETO', 12, true)
  addText(`EL LOCADOR entrega en alquiler al LOCATARIO, y éste acepta, el departamento individualizado como ${data.unit.unit_number} del ${data.building.name}, ubicado en ${data.building.address || 'Asunción, Paraguay'}.`)

  addText('SEGUNDA: PLAZO', 12, true)
  const inicio = new Date(data.startDate).toLocaleDateString('es-PY')
  const fin = new Date(data.endDate).toLocaleDateString('es-PY')
  addText(`El plazo de duración de este contrato es de 1 (un) año, contados a partir del ${inicio} hasta el ${fin}.`)

  addText('TERCERA: PRECIO Y FORMA DE PAGO', 12, true)
  addText(`El precio del alquiler mensual se fija en la suma de Gs. ${formatPrice(data.monthlyAmount)} (Guaraníes ${data.monthlyAmount.toLocaleString('es-PY')} mensuales), pagaderos por mes adelantado del 1 al 5 de cada mes.`)

  addText('CUARTA: DEPÓSITO DE GARANTÍA', 12, true)
  addText(`En este acto, EL LOCATARIO hace entrega de la suma de Gs. ${formatPrice(data.depositAmount)} en concepto de depósito de garantía, el cual será devuelto al finalizar el contrato si no existieren deudas o daños en el inmueble.`)

  y += 30
  doc.line(margin, y, 90, y)
  doc.line(120, y, 190, y)
  y += 5
  doc.text('EL LOCADOR', margin + 15, y)
  doc.text('EL LOCATARIO', 140, y)
  y += 10
  doc.setFontSize(8)
  doc.text(`C.I. Nº: ${data.tenant.ci}`, 140, y)

  doc.save(`Contrato_${data.tenant.full_name.replace(/\s/g, '_')}.pdf`)
}

export const generateReceiptPDF = (data: ReceiptData) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [210, 100] // Formato alargado tipo recibo
  })

  const monthName = new Date(data.payment.month_covered + 'T00:00:00').toLocaleDateString('es-PY', { month: 'long', year: 'numeric' })
  const paymentDate = new Date(data.payment.payment_date).toLocaleDateString('es-PY')

  // Marco
  doc.setLineWidth(0.5)
  doc.rect(5, 5, 200, 90)
  doc.setLineWidth(0.1)
  doc.line(140, 5, 140, 95) // Divisor para el talón

  // Contenido Principal
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('RECIBO DE DINERO', 15, 15)
  
  doc.setFontSize(12)
  doc.text(`Nº RF-${data.payment.id.slice(0, 8).toUpperCase()}`, 100, 15)

  doc.setFillColor(240, 240, 240)
  doc.rect(15, 20, 115, 10, 'F')
  doc.text(`Gs. ${formatPrice(data.payment.amount)}`, 125, 27, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  let y = 40
  doc.text(`Recibimos de: ${data.tenant.full_name}`, 15, y)
  y += 7
  doc.text(`La suma de: Guaraníes ${data.payment.amount.toLocaleString('es-PY')}`, 15, y)
  y += 7
  doc.text(`En concepto de: Alquiler mes de ${monthName}`, 15, y)
  y += 7
  doc.text(`Unidad: ${data.building.name} - Depto ${data.unit.unit_number}`, 15, y)

  doc.setFontSize(9)
  doc.text(`Fecha de cobro: ${paymentDate}`, 15, 80)
  
  doc.line(80, 85, 130, 85)
  doc.text('Firma Recaudador', 90, 90)

  // Talón de Control (Derecha)
  doc.setFont('helvetica', 'bold')
  doc.text('CONTROL', 145, 15)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(`Inquilino: ${data.tenant.full_name}`, 145, 25)
  doc.text(`Mes: ${monthName}`, 145, 32)
  doc.text(`Monto: ${formatPrice(data.payment.amount)}`, 145, 39)
  doc.text(`Fecha: ${paymentDate}`, 145, 46)

  doc.save(`Recibo_${data.tenant.full_name.replace(/\s/g, '_')}_${monthName.replace(/\s/g, '_')}.pdf`)
}
