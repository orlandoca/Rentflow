import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Tenant, Unit } from "@/types"
import { generateContractPDF, generatePromissoryNotePDF } from "@/lib/pdfGenerators"

interface ContractFormProps {
  onSuccess: () => void
}

export default function ContractForm({ onSuccess }: ContractFormProps) {
  const [loading, setLoading] = useState(false)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [generatePromissoryNotes, setGeneratePromissoryNotes] = useState(false)

  const [formData, setFormData] = useState({
    tenant_id: "",
    unit_id: "",
    start_date: "",
    end_date: "",
    monthly_amount: 0,
    deposit_amount: 0,
    status: "active" as const
  })

  useEffect(() => {
    async function fetchData() {
      // CARGAMOS TODO: Incluyendo owner_name y owner_ci del edificio
      const [tenantsRes, unitsRes] = await Promise.all([
        supabase.from("tenants").select("*").order("full_name"),
        supabase.from("units").select("*, building:buildings(id, name, address, owner_name, owner_ci)").eq("status", "available")
      ])
      if (tenantsRes.data) setTenants(tenantsRes.data as any)
      if (unitsRes.data) setUnits(unitsRes.data as any)
    }
    fetchData()
  }, [])

  const setQuickDate = (field: "start_date" | "end_date", type: string) => {
    const now = new Date()
    let targetDate = new Date()
    if (field === "start_date") {
      if (type === "today") targetDate = now
      else if (type === "next_month") targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    } else {
      const start = formData.start_date ? new Date(formData.start_date) : now
      if (type === "6m") targetDate = new Date(start.getFullYear(), start.getMonth() + 6, start.getDate())
      else if (type === "1y") targetDate = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate())
      else if (type === "2y") targetDate = new Date(start.getFullYear() + 2, start.getMonth(), start.getDate())
    }
    const formatted = targetDate.toISOString().split("T")[0]
    setFormData(prev => ({ ...prev, [field]: formatted }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.tenant_id || !formData.unit_id || !formData.start_date || !formData.end_date) return
    setLoading(true)
    try {
      let contract_url = ""
      if (file) {
        const fileExt = file.name.split(".").pop()
        const fileName = (Math.random() * 100000).toFixed(0) + "." + fileExt
        const filePath = formData.tenant_id + "/" + fileName
        const { error: uploadError } = await supabase.storage.from("contracts").upload(filePath, file)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from("contracts").getPublicUrl(filePath)   
        contract_url = publicUrl
      }
      const { data: newContract, error: contractError } = await supabase.from("contracts").insert({ ...formData, contract_url }).select().single()
      if (contractError) throw contractError
      await supabase.from("units").update({ status: "rented" }).eq("id", formData.unit_id)

      if (generatePromissoryNotes && newContract) {
        const tenant = tenants.find(t => t.id === formData.tenant_id)
        const unit = units.find(u => u.id === formData.unit_id)
        if (tenant && unit) {
          const startDate = new Date(formData.start_date)
          const endDate = new Date(formData.end_date)
          
          let yearsDiff = endDate.getFullYear() - startDate.getFullYear()
          let monthsDiff = endDate.getMonth() - startDate.getMonth()
          let totalMonths = yearsDiff * 12 + monthsDiff + 1
          
          const notes = []
          for (let i = 0; i < totalMonths; i++) {
            const dueDate = new Date(startDate)
            dueDate.setMonth(startDate.getMonth() + i)
            
            notes.push({
              contract_id: newContract.id,
              quota_number: i + 1,
              due_date: dueDate.toISOString().split("T")[0],
              status: "pending"
            })
            
            generatePromissoryNotePDF({
              tenant,
              unit,
              building: (unit as any).building,
              startDate: formData.start_date,
              endDate: formData.end_date,
              monthlyAmount: formData.monthly_amount,
              depositAmount: formData.deposit_amount
            }, i + 1, dueDate)
          }
          await supabase.from("promissory_notes").insert(notes)
        }
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving contract:", error)
      alert("Error al guardar el contrato")
    } finally {
      setLoading(false)
    }
  }

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const unitId = e.target.value
    const selectedUnit = units.find(u => u.id === unitId)
    setFormData(prev => ({ ...prev, unit_id: unitId, monthly_amount: selectedUnit?.price || 0 }))   
  }

  const handlePreview = () => {
    const tenant = tenants.find(t => t.id === formData.tenant_id)
    const unit = units.find(u => u.id === formData.unit_id)
    if (!tenant || !unit || !formData.start_date || !formData.end_date) {
      alert("Por favor completa los datos básicos para la previsualización")
      return
    }
    generateContractPDF({
      tenant,
      unit,
      building: (unit as any).building,
      startDate: formData.start_date,
      endDate: formData.end_date,
      monthlyAmount: formData.monthly_amount,
      depositAmount: formData.deposit_amount
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="tenant_id" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Inquilino</label>
          <select id="tenant_id" name="tenant_id" required value={formData.tenant_id} onChange={(e) => setFormData(prev => ({...prev, tenant_id: e.target.value}))} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            <option value="">Seleccionar Inquilino...</option>
            {tenants.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="unit_id" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Departamento</label>
          <select id="unit_id" name="unit_id" required value={formData.unit_id} onChange={handleUnitChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            <option value="">Seleccionar Depto...</option>
            {units.map(u => <option key={u.id} value={u.id}>{u.building?.name} - {u.unit_number}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
        <div className="space-y-3">
          <label htmlFor="start_date" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Fecha de Inicio</label>
          <input id="start_date" name="start_date" type="date" required value={formData.start_date} onChange={(e) => setFormData(prev => ({...prev, start_date: e.target.value}))} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setQuickDate("start_date", "today")} className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md transition-colors">Hoy</button>
            <button type="button" onClick={() => setQuickDate("start_date", "next_month")} className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md transition-colors">1Âº Mes PrÃ³ximo</button>
          </div>
        </div>
        <div className="space-y-3">
          <label htmlFor="end_date" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Fecha de Fin</label>
          <input id="end_date" name="end_date" type="date" required value={formData.end_date} onChange={(e) => setFormData(prev => ({...prev, end_date: e.target.value}))} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setQuickDate("end_date", "6m")} className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md transition-colors">+6 Meses</button>
            <button type="button" onClick={() => setQuickDate("end_date", "1y")} className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md transition-colors">+1 AÃ±o</button>
            <button type="button" onClick={() => setQuickDate("end_date", "2y")} className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md transition-colors">+2 AÃ±os</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="monthly_amount" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Monto Mensual (Gs.)</label>
          <input id="monthly_amount" name="monthly_amount" type="number" required value={formData.monthly_amount} onChange={(e) => setFormData(prev => ({...prev, monthly_amount: Number(e.target.value)}))} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold outline-none" />
        </div>
        <div className="space-y-2">
          <label htmlFor="deposit_amount" className="text-sm font-bold text-slate-400 uppercase tracking-wider">GarantÃ­a (Gs.)</label>
          <input id="deposit_amount" name="deposit_amount" type="number" value={formData.deposit_amount} onChange={(e) => setFormData(prev => ({...prev, deposit_amount: Number(e.target.value)}))} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 outline-none" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="contract_file" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Contrato Escaneado</label>
        <input id="contract_file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="generatePromissoryNotes" checked={generatePromissoryNotes} onChange={(e) => setGeneratePromissoryNotes(e.target.checked)} className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500" />
        <label htmlFor="generatePromissoryNotes" className="text-sm font-bold text-slate-300">Generar pagarés para todas las cuotas</label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" onClick={handlePreview} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 h-12 rounded-xl font-bold">Previsualizar PDF</Button>
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-900/20" disabled={loading}>{loading ? "Procesando..." : "Guardar Contrato"}</Button>
      </div>
    </form>
  )
}
