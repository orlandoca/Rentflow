import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Tenant } from "@/types"

interface TenantFormProps {
  onSuccess: () => void
  tenant?: Tenant
}

export default function TenantForm({ onSuccess, tenant }: TenantFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    ci: "",
    email: "",
    phone: "",
    address: ""
  })

  useEffect(() => {
    if (tenant) {
      setFormData({
        full_name: tenant.full_name,
        ci: tenant.ci,
        email: tenant.email || "",
        phone: tenant.phone || "",
        address: tenant.address || ""
      })
    }
  }, [tenant])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.full_name || !formData.ci) return

    setLoading(true)
    try {
      if (tenant) {
        const { error } = await supabase.from("tenants").update(formData).eq("id", tenant.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("tenants").insert(formData)
        if (error) throw error
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving tenant:", error)
      alert("Error al guardar el inquilino")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
      <div className="space-y-2">
        <label htmlFor="full_name" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Nombre Completo</label>
        <input id="full_name" name="full_name" type="text" required value={formData.full_name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all" placeholder="Ej: Juan Pérez" />
      </div>

      <div className="space-y-2">
        <label htmlFor="ci" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Cédula de Identidad (CI)</label>
        <input id="ci" name="ci" type="text" required value={formData.ci} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-emerald-400 font-bold transition-all" placeholder="1.234.567" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Email</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all" placeholder="juan@email.com" />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Teléfono</label>
          <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all" placeholder="09xx xxx xxx" />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-bold text-slate-400 uppercase tracking-wider">Dirección</label>
        <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all" placeholder="Calle 123, Asunción" />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-lg transition-all" disabled={loading}>
          {loading ? "Procesando..." : (tenant ? "Actualizar Inquilino" : "Registrar Inquilino")}
        </Button>
      </div>
    </form>
  )
}
