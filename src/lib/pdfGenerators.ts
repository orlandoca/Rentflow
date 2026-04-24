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
  const maxLineWidth = 180
  let y = 25
  
  // Datos dinÃ¡micos del Titular
  const titular = data.building.owner_name || "PROPIETARIO NO DEFINIDO"
  const titularCI = data.building.owner_ci || "..........."

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > 280) {
      doc.addPage()
      y = 20
    }
  }

  const addText = (text: string, fontSize = 10, isBold = false, align: "left" | "center" | "justify" = "justify") => {
    doc.setFontSize(fontSize)
    doc.setFont("helvetica", isBold ? "bold" : "normal")
    const lines = doc.splitTextToSize(text, maxLineWidth)
    const textHeight = lines.length * (fontSize * 0.45) + 3
    checkPageBreak(textHeight)
    const x = align === "center" ? pageWidth / 2 : margin
    doc.text(text, x, y, { maxWidth: maxLineWidth, align: align })
    y += textHeight
  }

  addText("CONTRATO DE ALQUILER", 14, true, "center")
  y += 5
  const fechaHoy = new Date().toLocaleDateString("es-PY", { day: "numeric", month: "long", year: "numeric" })
  addText("EncarnaciÃ³n, " + fechaHoy + ".-", 10, false, "left")
  y += 5

  const intro = "Entre el Sr./Sra. " + titular + " con C.I. NÂº " + titularCI + " en su carÃ¡cter de propietario, por una parte, y la parte locataria el Sr./Sra. " + data.tenant.full_name + ", con C.I. NÂº " + data.tenant.ci + ", se han convenido en celebrar el presente contrato de locaciÃ³n de un departamento que se regirÃ¡n por las siguientes clÃ¡usulas. -------------------------------------"
  addText(intro)

  addText("PRIMERO: El Sr./Sra. " + titular + " en el carÃ¡cter invocado da en locaciÃ³n a la parte locataria Sr./Sra. " + data.tenant.full_name + " con C.I. NÂº " + data.tenant.ci + " una unidad de su propiedad, individualizado como Unidad NÂº " + data.unit.unit_number + ", del edificio " + data.building.name + ", sito sobre la calle " + (data.building.address || "...................") + ", de esta ciudad.---------------------------------------------------------------------------")

  addText("SEGUNDO: El precio del alquiler se fija en la suma de GUARANIES " + data.monthlyAmount.toLocaleString("es-PY").toUpperCase() + " (Gs. " + formatPrice(data.monthlyAmount) + "). ----------------------------------------------------------------------")
  const inicio = new Date(data.startDate).toLocaleDateString("es-PY", { day: "numeric", month: "long", year: "numeric" })
  const fin = new Date(data.endDate).toLocaleDateString("es-PY", { day: "numeric", month: "long", year: "numeric" })
  addText("TERCERO: El presente contrato serÃ¡ valido desde el " + inicio + " hasta el " + fin + ". -------------------------------------------------------------------------------------")
  addText("CUARTO: Se establece expresamente que la parte locataria se compromete a abonar la suma estipulada en la clÃ¡usula segunda, por mes adelantado, en concepto de alquiler y que la Ãºnica prueba instrumental de pago serÃ¡ el recibo expedido por la propietaria. -------------------------------------------------------------")
  addText("QUINTO: Por el presente instrumento se establece el deposito que es en efectivo por la parte locataria por la suma de GUARANIES " + data.depositAmount.toLocaleString("es-PY").toUpperCase() + " (Gs. " + formatPrice(data.depositAmount) + ") a los efectos de garantizar toda reparaciÃ³n, reposiciÃ³n y/o mantenimiento a ser efectuado en las instalaciones, en caso de deterioro que sucediera por culpa locataria, o sus dependientes, con la expresa constancias de la devoluciÃ³n del remanente no utilizado por dicho objeto.")
  addText("SEXTO: Los pagos deberÃ¡n ser efectuados a partir del 1ro. al 5Âº dÃ­a de cada mes, en el domicilio del propietario, o donde este lo designe, en horario comercial.")
  addText("SEPTIMO: Se hace entrega de la vivienda consistente en una unidad funcional en el edificio " + data.building.name + ", con sus respectivos accesorios lumÃ­nicos e instalaciones elÃ©ctricas, los cuales se hallan en buen estado de uso y conservaciÃ³n. ---------------------------------------------------------------------------------------------")
  addText("OCTAVO: El locatario se compromete al buen mantenimiento de la vivienda siendo responsable de todo deterioro por el uso, las reparaciones y pinturas que correrÃ¡ por cuenta del locatario y en caso de que este/a necesite hacer reformas lo harÃ¡ de conformidad con el locador y serÃ¡ de exclusiva responsabilidad y por su cuenta las mencionadas reformas, sin que pueda exigir al locador pago alguno, quedando las instalaciones fijas, incorporadas al patrimonio del propietario.--------------------------------")
  addText("NOVENO: El locatario es responsable de tener al dÃ­a el pago de los servicios de luz y agua utilizado en el predio, ademÃ¡s de los impuestos municipales correspondientes, excluido el impuesto inmobiliario. ---------------------------------------------------------------")
  addText("DECIMO: El destino a darse al departamento individualizado en el presente contrato de locaciÃ³n serÃ¡ Ãºnica y exclusivamente para vivienda, no pudiendo dÃ¡rsele otro destino sin la previa autorizaciÃ³n dada por escrito de parte de la locadora. -------------------------")
  addText("UNDECIMO: El predio dado en alquiler, no podrÃ¡ ser sub-alquilado sin previo consentimiento dado por escrito por el locador. -------------------------------------------------")
  addText("DECIMO SEGUNDO: El alquilante no podrÃ¡ ceder ni trasferir el presente contrato a favor de terceras personas. -------------------------------------------------------------------------")
  addText("DECIMO TERCERO: La falta de pago de dos meses de alquiler indica la determinaciÃ³n de pleno derecho a exigir el desalojo del local, sin la necesidad de interpelaciÃ³n alguna, a mÃ¡s de las acciones civiles reservados al locador. ------------------")
  addText("DECIMO CUARTO: El locatario se compromete a observar estrictamente las buenas costumbres, la moral, a no perturbar la tranquilidad de los demÃ¡s vecinos, debiendo abtenerse de producir ruidos molestos o introducir y/o depositar todo objeto, producto o mercaderÃ­a peligrosas para el predio. -------------------------------------------------------------")
  addText("DECIMO QUINTO: Las partes contratantes acuerdan por mutuo consentimientos la revisiÃ³n semestral del predio, comprendiendo estos sus diversas dependencias, instalaciones permanentes y estado general del mismo, a los efectos de determinar cualquier reparaciÃ³n a ser efectuada, cuyos gastos serÃ¡n soportados por el inquilino. ----------------------------------")
  addText("DECIMO SEXTO: El locatario avisarÃ¡ con sesenta (30) dÃ­as de anticipaciÃ³n la renovaciÃ³n o no del presente contrato. Las partes se obligan a preavisar con sesenta (30) dÃ­as de anticipaciÃ³n a la otra en caso de rescisiÃ³n. ----------------------------------------------------------------------------")
  addText("DECIMO SEPTIMO: Queda establecido que el termino del presente contrato, el locatario se compromete a desalojar el predio en menciÃ³n dentro del plazo de veinticuatro (24) horas, sin la necesidad de interpelaciÃ³n judicial alguna, estableciÃ©ndose para el caso de incumplimiento una multa de cincuenta mil guaranÃ­es (50.000) por dÃ­a, por el tiempo de mora en la entrega de la llave.-----------------------------")
  addText("DECIMO OCTAVO: Son causa de rescisiÃ³n del presente contrato, la falta de cumplimiento de cualquiera de las clÃ¡usulas debidamente denunciadas por la parte afectada, sin necesidad de realizar cuestiones judiciales ni extrajudiciales.-----------------")
  y += 10
  addText("EN CONFORMIDAD: con el presente contrato firma las partes en dos ejemplares de un mismo tenor y a un solo efecto. ----------------------------------------------------------------")
  y += 30
  checkPageBreak(25)
  doc.line(margin, y, margin + 75, y)
  doc.line(pageWidth - margin - 75, y, pageWidth - margin, y)
  y += 5
  doc.text(titular.toUpperCase(), margin + 37.5, y, { align: "center" })
  doc.text(data.tenant.full_name.toUpperCase(), pageWidth - margin - 37.5, y, { align: "center" })
  y += 5
  doc.text("PROPIETARIO", margin + 37.5, y, { align: "center" })
  doc.text("LOCATARIO", pageWidth - margin - 37.5, y, { align: "center" })
  y += 5
  doc.setFontSize(8)
  doc.text("C.I. NÂº: " + titularCI, margin + 37.5, y, { align: "center" })
  doc.text("C.I. NÂº: " + data.tenant.ci, pageWidth - margin - 37.5, y, { align: "center" })
  
  const blobUrl = doc.output("bloburl")
  window.open(blobUrl, "_blank")
}

export const generatePromissoryNotePDF = (data: ContractData, quotaNumber: number, dueDate: Date) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [210, 100] })
  
  doc.rect(5, 5, 200, 90)
  
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("PAGARÉ", 105, 15, { align: "center" })
  
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Nº de Cuota: ${quotaNumber}`, 15, 25)
  doc.text(`Vencimiento: ${dueDate.toLocaleDateString("es-PY")}`, 160, 25)
  
  doc.text(`DEBE(MOS) Y PAGARÉ(MOS) INCONDICIONALMENTE A LA ORDEN DE:`, 15, 40)
  doc.setFont("helvetica", "bold")
  doc.text(data.building.owner_name || "PROPIETARIO", 15, 45)
  
  doc.setFont("helvetica", "normal")
  doc.text(`LA SUMA DE GUARANÍES: ${data.monthlyAmount.toLocaleString("es-PY")}`, 15, 55)
  
  doc.text(`DEUDOR: ${data.tenant.full_name} - C.I. Nº: ${data.tenant.ci}`, 15, 65)
  
  doc.line(130, 85, 195, 85)
  doc.text("Firma del Deudor", 162.5, 90, { align: "center" })
  
  doc.save(`Pagare_Cuota_${quotaNumber}_${data.tenant.full_name}.pdf`)
  return doc.output('blob')
}

export const generateReceiptPDF = (data: ReceiptData) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [210, 100] })

  doc.rect(5, 5, 200, 90)

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("RECIBO DE DINERO", 105, 15, { align: "center" })

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Recibo No.: ${data.payment.id.substring(0, 8)}`, 15, 25)
  doc.text(`Fecha: ${new Date(data.payment.payment_date).toLocaleDateString("es-PY")}`, 160, 25)

  doc.text(`RECIBÍ de: ${data.tenant.full_name} con C.I. Nº ${data.tenant.ci}`, 15, 40)
  doc.text(`la suma de GUARANÍES: ${data.payment.amount.toLocaleString("es-PY")} (${formatPrice(data.payment.amount)})`, 15, 50)
  doc.text(`en concepto de Alquiler de la unidad ${data.unit.unit_number} del edificio ${data.building.name}`, 15, 55)
  doc.text(`correspondiente al mes de ${new Date(data.payment.month_covered + 'T00:00:00').toLocaleDateString("es-PY", { month: 'long', year: 'numeric' })}.`, 15, 60)

  doc.line(130, 80, 195, 80)
  doc.text("Firma del Propietario/Administrador", 162.5, 85, { align: "center" })

  doc.save(`Recibo_Pago_${data.payment.id.substring(0, 8)}.pdf`)
}

