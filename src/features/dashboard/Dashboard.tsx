import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTenants: 0,
    totalUnits: 0,
    rentedUnits: 0,
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    expiringSoon: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))

        const [tenants, units, contracts, expenses] = await Promise.all([
          supabase.from('tenants').select('id', { count: 'exact', head: true }),
          supabase.from('units').select('id, status'),
          supabase.from('contracts').select('monthly_amount, end_date').eq('status', 'active'),
          supabase.from('expenses').select('amount').gte('expense_date', firstDayOfMonth)
        ])

        const expiring = contracts.data?.filter(c => {
          const end = new Date(c.end_date)
          return end > now && end <= thirtyDaysFromNow
        }).length || 0

        const totalRevenue = contracts.data?.reduce((sum, c) => sum + Number(c.monthly_amount), 0) || 0
        const totalExpenses = expenses.data?.reduce((sum, e) => sum + Number(e.amount), 0) || 0

        setStats({
          totalTenants: tenants.count || 0,
          totalUnits: units.data?.length || 0,
          rentedUnits: units.data?.filter(u => u.status === 'rented').length || 0,
          monthlyRevenue: totalRevenue,
          monthlyExpenses: totalExpenses,
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

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">Cargando inteligencia...</div>

  const occupancyRate = stats.totalUnits > 0 ? Math.round((stats.rentedUnits / stats.totalUnits) * 100) : 0
  const netProfit = stats.monthlyRevenue - stats.monthlyExpenses

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tarjeta Recaudación */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Recaudación Bruta</p>
          <h3 className="text-2xl font-black text-white">Gs. {formatPrice(stats.monthlyRevenue)}</h3>
          <p className="text-blue-500 text-[9px] mt-4 font-bold uppercase">Mes en curso</p>
        </div>

        {/* Tarjeta Gastos */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Gastos Mensuales</p>
          <h3 className="text-2xl font-black text-red-500">Gs. {formatPrice(stats.monthlyExpenses)}</h3>
          <p className="text-red-900 text-[9px] mt-4 font-bold uppercase">Egresos registrados</p>
        </div>

        {/* Tarjeta Utilidad Neta */}
        <div className="p-6 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl shadow-xl shadow-emerald-900/20">
          <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest mb-1">Utilidad Neta</p>
          <h3 className="text-2xl font-black text-white">Gs. {formatPrice(netProfit)}</h3>
          <p className="text-emerald-200 text-[9px] mt-4 font-bold uppercase italic">Lo que queda libre</p>
        </div>

        {/* Tarjeta Ocupación */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Ocupación</p>
          <h3 className="text-2xl font-black text-white">{occupancyRate}%</h3>
          <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-1000" 
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
          <p className="text-slate-500 text-[9px] mt-2 font-bold uppercase">
            {stats.rentedUnits} de {stats.totalUnits} deptos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-8 border rounded-[2rem] flex flex-col items-center justify-center text-center transition-all ${
          stats.expiringSoon > 0 ? 'bg-orange-500/10 border-orange-500/50' : 'bg-slate-900/50 border-slate-800 border-dashed'
        }`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 ${
            stats.expiringSoon > 0 ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-800 text-slate-500'
          }`}>⚠️</div>
          <h4 className={`text-xl font-black ${stats.expiringSoon > 0 ? 'text-orange-500' : 'text-white'}`}>{stats.expiringSoon} Vencimientos</h4>
          <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">Próximos 30 días</p>
        </div>

        <div className="p-8 bg-slate-900/50 border border-slate-800 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4 text-xl">👤</div>
          <h4 className="text-xl font-black text-white">{stats.totalTenants} Inquilinos</h4>
          <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">Registrados</p>
        </div>

        <div className="p-8 bg-slate-900/50 border border-slate-800 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 text-xl">🏢</div>
          <h4 className="text-xl font-black text-white">{stats.totalUnits} Unidades</h4>
          <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">Inventario Total</p>
        </div>
      </div>
    </div>
  )
}
