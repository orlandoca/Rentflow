import { jsPDF } from 'jspdf'
import { Tenant, Unit, Building } from '@/types'

interface ContractData {
  tenant: Tenant
  unit: Unit
  building: Building
  startDate: string
  endDate: string
  monthlyAmount: number
  depositAmount: number
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY').format(price)
  }

  // Título
  addText('CONTRATO DE ALQUILER DE INMUEBLE', 16, true, 'center')
  y += 10

  // Encabezado / Partes
  const intro = `Entre el Propietario/Administrador (en adelante "EL LOCADOR") y por la otra parte el Sr./Sra. ${data.tenant.full_name}, con C.I. Nº ${data.tenant.ci} (en adelante "EL LOCATARIO"), convienen en celebrar el presente Contrato de Alquiler, sujeto a las siguientes cláusulas:`
  addText(intro)

  // Cláusulas
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

  addText('QUINTA: USO Y DESTINO', 12, true)
  addText('El inmueble alquilado será destinado exclusivamente para vivienda familiar, no pudiendo darle otro uso ni subalquilarlo sin consentimiento previo por escrito.')

  y += 30
  // Firmas
  doc.line(margin, y, 90, y)
  doc.line(120, y, 190, y)
  y += 5
  doc.text('EL LOCADOR', margin + 15, y)
  doc.text('EL LOCATARIO', 140, y)
  y += 10
  doc.setFontSize(8)
  doc.text(`C.I. Nº: ${data.tenant.ci}`, 140, y)

  // Descargar
  doc.save(`Contrato_${data.tenant.full_name.replace(' ', '_')}.pdf`)
}
