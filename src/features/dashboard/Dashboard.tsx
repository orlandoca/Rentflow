import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTenants: 0,
    totalUnits: 0,
    rentedUnits: 0,
    monthlyRevenue: 0,
    expiringSoon: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [tenants, units, contracts] = await Promise.all([
          supabase.from('tenants').select('id', { count: 'exact', head: true }),
          supabase.from('units').select('id, status'),
          supabase.from('contracts').select('monthly_amount, end_date').eq('status', 'active')
        ])

        const now = new Date()
        const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))

        const expiring = contracts.data?.filter(c => {
          const end = new Date(c.end_date)
          return end > now && end <= thirtyDaysFromNow
        }).length || 0

        setStats({
          totalTenants: tenants.count || 0,
          totalUnits: units.data?.length || 0,
          rentedUnits: units.data?.filter(u => u.status === 'rented').length || 0,
          monthlyRevenue: contracts.data?.reduce((sum, c) => sum + Number(c.monthly_amount), 0) || 0,
          expiringSoon: expiring
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY').format(price)
  }

  if (loading) return <div className="p-4 text-slate-400">Cargando resumen...</div>

  const occupancyRate = stats.totalUnits > 0 ? Math.round((stats.rentedUnits / stats.totalUnits) * 100) : 0

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta Recaudación */}
        <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-xl shadow-blue-900/20">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Recaudación Mensual</p>
          <h3 className="text-3xl font-black text-white">Gs. {formatPrice(stats.monthlyRevenue)}</h3>
          <p className="text-blue-200 text-[10px] mt-4 font-medium italic">Basado en contratos activos</p>
        </div>

        {/* Tarjeta Ocupación */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Ocupación</p>
          <h3 className="text-3xl font-black text-white">{occupancyRate}%</h3>
          <div className="mt-4 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-1000" 
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
          <p className="text-slate-500 text-[10px] mt-2">
            {stats.rentedUnits} de {stats.totalUnits} departamentos ocupados
          </p>
        </div>

        {/* Tarjeta Alertas */}
        <div className={`p-6 border rounded-3xl transition-all ${
          stats.expiringSoon > 0 ? 'bg-orange-500/10 border-orange-500/50' : 'bg-slate-900 border-slate-800'
        }`}>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Vencimientos Próximos</p>
          <h3 className={`text-3xl font-black ${stats.expiringSoon > 0 ? 'text-orange-500' : 'text-white'}`}>
            {stats.expiringSoon}
          </h3>
          <p className="text-slate-500 text-[10px] mt-4">Contratos que vencen en los próximos 30 días</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-4 text-xl">👤</div>
          <h4 className="text-white font-bold">{stats.totalTenants} Inquilinos</h4>
          <p className="text-slate-500 text-xs">Registrados en la plataforma</p>
        </div>
        <div className="p-8 bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4 text-xl">🏢</div>
          <h4 className="text-white font-bold">{stats.totalUnits} Departamentos</h4>
          <p className="text-slate-500 text-xs">En todos los edificios</p>
        </div>
      </div>
    </div>
  )
}
