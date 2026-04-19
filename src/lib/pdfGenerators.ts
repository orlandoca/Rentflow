import { jsPDF } from "jspdf"
import { Tenant, Unit, Building, Payment } from "@/types"

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
  return new Intl.NumberFormat("es-PY").format(price)
}

export const generateContractPDF = (data: ContractData) => {
  const doc = new jsPDF()
  const margin = 15
  const pageWidth = 210
  const maxLineWidth = pageWidth - (margin * 2)
  let y = 25
  
  const titular = data.building.owner_name || "TITULAR NO DEFINIDO"

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > 280) {
      doc.addPage()
      y = 20
    }
  }

  const addText = (text: string, fontSize = 10, isBold = false, align: "left" | "center" | "justify" = "justify") => {
    doc.setFontSize(fontSize)
    doc.setFont("helvetica", isBold ? "bold" : "normal")
    const splitText = doc.splitTextToSize(text, maxLineWidth)
    const textHeight = splitText.length * (fontSize * 0.4) + 4
    checkPageBreak(textHeight)
    if (align === "center") {
      doc.text(text, pageWidth / 2, y, { align: "center" })
      y += fontSize * 0.5 + 4
    } else {
      doc.text(splitText, margin, y, { align: align === "justify" ? "justify" : "left" })
      y += textHeight
    }
  }

  addText("CONTRATO DE ALQUILER", 14, true, "center")
  y += 5
  const fechaHoy = new Date().toLocaleDateString("es-PY", { day: "numeric", month: "long", year: "numeric" })
  addText("Encarnación, " + fechaHoy + ".-", 10, false, "left")
  y += 5

  const intro = "Entre el Sr./Sra. " + titular + " en su carácter de propietario, por una parte, y la parte locataria el Sr./Sra. " + data.tenant.full_name + ", con C.I. Nº " + data.tenant.ci + ", se han convenido en celebrar el presente contrato de locación de un departamento que se regirán por las siguientes cláusulas. -------------------------------------"
  addText(intro)

  addText("PRIMERO: El Sr./Sra. " + titular + " en el carácter invocado da en locación a la parte locataria Sr./Sra. " + data.tenant.full_name + " con C.I. Nº " + data.tenant.ci + " una unidad de su propiedad, individualizado como Unidad Nº " + data.unit.unit_number + ", del edificio " + data.building.name + ", sito sobre la calle " + (data.building.address || "...................") + ", de esta ciudad.---------------------------------------------------------------------------")

  addText("SEGUNDO: El precio del alquiler se fija en la suma de GUARANIES " + data.monthlyAmount.toLocaleString("es-PY").toUpperCase() + " (Gs. " + formatPrice(data.monthlyAmount) + "). ----------------------------------------------------------------------")
  
  const inicio = new Date(data.startDate).toLocaleDateString("es-PY", { day: "numeric", month: "long", year: "numeric" })
  const fin = new Date(data.endDate).toLocaleDateString("es-PY", { day: "numeric", month: "long", year: "numeric" })
  
  addText("TERCERO: El presente contrato será valido desde el " + inicio + " hasta el " + fin + ". -------------------------------------------------------------------------------------")
  addText("CUARTO: Se establece expresamente que la parte locataria se compromete a abonar la suma estipulada en la cláusula segunda, por mes adelantado, en concepto de alquiler y que la única prueba instrumental de pago será el recibo expedido por la propietaria. -------------------------------------------------------------")
  addText("QUINTO: Por el presente instrumento se establece el deposito que es en efectivo por la parte locataria por la suma de GUARANIES " + data.depositAmount.toLocaleString("es-PY").toUpperCase() + " (Gs. " + formatPrice(data.depositAmount) + ") a los efectos de garantizar toda reparación, reposición y/o mantenimiento a ser efectuado en las instalaciones, en caso de deterioro que sucediera por culpa locataria, o sus dependientes, con la expresa constancias de la devolución del remanente no utilizado por dicho objeto.")
  addText("SEXTO: Los pagos deberán ser efectuados a partir del 1ro. al 5º día de cada mes, en el domicilio del propietario, o donde este lo designe, en horario comercial.")
  addText("SEPTIMO: Se hace entrega de la vivienda consistente en una unidad funcional en el edificio " + data.building.name + ", con sus respectivos accesorios lumínicos e instalaciones eléctricas, los cuales se hallan en buen estado de uso y conservación. ---------------------------------------------------------------------------------------------")
  addText("OCTAVO: El locatario se compromete al buen mantenimiento de la vivienda siendo responsable de todo deterioro por el uso, las reparaciones y pinturas que correrá por cuenta del locatario y en caso de que este/a necesite hacer reformas lo hará de conformidad con el locador y será de exclusiva responsabilidad y por su cuenta las mencionadas reformas, sin que pueda exigir al locador pago alguno, quedando las instalaciones fijas, incorporadas al patrimonio del propietario.--------------------------------")
  addText("NOVENO: El locatario es responsable de tener al día el pago de los servicios de luz y agua utilizado en el predio, además de los impuestos municipales correspondientes, excluido el impuesto inmobiliario. ---------------------------------------------------------------")
  addText("DECIMO: El destino a darse al departamento individualizado en el presente contrato de locación será única y exclusivamente para vivienda, no pudiendo dársele otro destino sin la previa autorización dada por escrito de parte de la locadora. -------------------------")
  addText("UNDECIMO: El predio dado en alquiler, no podrá ser sub-alquilado sin previo consentimiento dado por escrito por el locador. -------------------------------------------------")
  addText("DECIMO SEGUNDO: El alquilante no podrá ceder ni trasferir el presente contrato a favor de terceras personas. -------------------------------------------------------------------------")
  addText("DECIMO TERCERO: La falta de pago de dos meses de alquiler indica la determinación de pleno derecho a exigir el desalojo del local, sin la necesidad de interpelación alguna, a más de las acciones civiles reservados al locador. ------------------")
  addText("DECIMO CUARTO: El locatario se compromete a observar estrictamente las buenas costumbres, la moral, a no perturbar la tranquilidad de los demás vecinos, debiendo abtenerse de producir ruidos molestos o introducir y/o depositar todo objeto, producto o mercadería peligrosas para el predio. -------------------------------------------------------------")
  addText("DECIMO QUINTO: Las partes contratantes acuerdan por mutuo consentimientos la revisión semestral del predio, comprendiendo estos sus diversas dependencias, instalaciones permanentes y estado general del mismo, a los efectos de determinar cualquier reparación a ser efectuada, cuyos gastos serán soportados por el inquilino. ----------------------------------")
  addText("DECIMO SEXTO: El locatario avisará con sesenta (30) días de anticipación la renovación o no del presente contrato. Las partes se obligan a preavisar con sesenta (30) días de anticipación a la otra en caso de rescisión. ----------------------------------------------------------------------------")
  addText("DECIMO SEPTIMO: Queda establecido que el termino del presente contrato, el locatario se compromete a desalojar el predio en mención dentro del plazo de veinticuatro (24) horas, sin la necesidad de interpelación judicial alguna, estableciéndose para el caso de incumplimiento una multa de cincuenta mil guaraníes (50.000) por día, por el tiempo de mora en la entrega de la llave.-----------------------------")
  addText("DECIMO OCTAVO: Son causa de rescisión del presente contrato, la falta de cumplimiento de cualquiera de las cláusulas debidamente denunciadas por la parte afectada, sin necesidad de realizar cuestiones judiciales ni extrajudiciales.-----------------")
  y += 10
  addText("EN CONFORMIDAD: con el presente contrato firma las partes en dos ejemplares de un mismo tenor y a un solo efecto. ----------------------------------------------------------------")
  y += 30
  checkPageBreak(20)
  doc.line(margin, y, margin + 70, y)
  doc.line(margin + 100, y, margin + 180, y)
  y += 5
  doc.text(titular.toUpperCase(), margin + 35, y, { align: "center" })
  doc.text(data.tenant.full_name.toUpperCase(), margin + 140, y, { align: "center" })
  y += 5
  doc.text("PROPIETARIO", margin + 35, y, { align: "center" })
  doc.text("LOCATARIO", margin + 140, y, { align: "center" })
  
  // Abrir en nueva pestaÃ±a en lugar de descargar
  const blobUrl = doc.output("bloburl")
  window.open(blobUrl, "_blank")
}

export const generateReceiptPDF = (data: ReceiptData) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [210, 100]
  })
  const monthName = new Date(data.payment.month_covered + "T00:00:00").toLocaleDateString("es-PY", { month: "long", year: "numeric" })
  const paymentDate = new Date(data.payment.payment_date).toLocaleDateString("es-PY")
  doc.setLineWidth(0.5)
  doc.rect(5, 5, 200, 90)
  doc.setLineWidth(0.1)
  doc.line(140, 5, 140, 95)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("RECIBO DE DINERO", 15, 15)
  doc.setFontSize(12)
  doc.text("Nº RF-" + data.payment.id.slice(0, 8).toUpperCase(), 100, 15)
  doc.setFillColor(240, 240, 240)
  doc.rect(15, 20, 115, 10, "F")
  doc.text("Gs. " + formatPrice(data.payment.amount), 125, 27, { align: "right" })
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  let y = 40
  doc.text("Recibimos de: " + data.tenant.full_name, 15, y)
  y += 7
  doc.text("La suma de: Guaraníes " + data.payment.amount.toLocaleString("es-PY"), 15, y)
  y += 7
  doc.text("En concepto de: Alquiler mes de " + monthName, 15, y)
  y += 7
  doc.text("Unidad: " + data.building.name + " - Depto " + data.unit.unit_number, 15, y)
  doc.setFontSize(9)
  doc.text("Fecha de cobro: " + paymentDate, 15, 80)
  doc.line(80, 85, 130, 85)
  doc.text("Firma Recaudador", 90, 90)
  doc.setFont("helvetica", "bold")
  doc.text("CONTROL", 145, 15)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.text("Inquilino: " + data.tenant.full_name, 145, 25)
  doc.text("Mes: " + monthName, 145, 32)
  doc.text("Monto: " + formatPrice(data.payment.amount), 145, 39)
  doc.text("Fecha: " + paymentDate, 145, 46)
  
  // Abrir en nueva pestaÃ±a en lugar de descargar
  const blobUrl = doc.output("bloburl")
  window.open(blobUrl, "_blank")
}
