import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { TrendingUp, TrendingDown, Users, Building2, CalendarClock, PieChart, ShieldCheck } from 'lucide-react'

/**
 * Intent: The administrator feels like an architect of their finances.
 * Palette: Ink Navy, Emerald Seal, Steel Gray.
 * Spacing: Base 4px system.
 */
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

  const { occupancyRate, netProfit } = useMemo(() => {
    const rate = stats.totalUnits > 0 ? Math.round((stats.rentedUnits / stats.totalUnits) * 100) : 0
    const profit = stats.monthlyRevenue - stats.monthlyExpenses
    return { occupancyRate: rate, netProfit: profit }
  }, [stats])

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] animate-pulse">Compilando Inteligencia...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans">
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Recaudación Card */}
        <div className="group relative bg-[#0f172a] border border-white/[0.05] rounded-[2rem] p-6 shadow-xl hover:shadow-blue-900/10 transition-all overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={48} className="text-blue-500" />
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Recaudación Bruta
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold text-slate-400">Gs.</span>
            <h3 className="text-3xl font-black text-white tabular-nums tracking-tighter">
              {formatPrice(stats.monthlyRevenue)}
            </h3>
          </div>
          <p className="text-slate-600 text-[9px] mt-6 font-bold uppercase tracking-tight">Periodo: Mayo 2026</p>
        </div>

        {/* Gastos Card */}
        <div className="group relative bg-[#0f172a] border border-white/[0.05] rounded-[2rem] p-6 shadow-xl hover:shadow-red-900/10 transition-all overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingDown size={48} className="text-red-500" />
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Gastos Mensuales
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold text-slate-400">Gs.</span>
            <h3 className="text-3xl font-black text-red-500 tabular-nums tracking-tighter">
              {formatPrice(stats.monthlyExpenses)}
            </h3>
          </div>
          <p className="text-slate-600 text-[9px] mt-6 font-bold uppercase tracking-tight">Egresos validados</p>
        </div>

        {/* Utilidad Neta - Signature "Emerald Seal" */}
        <div className="relative bg-emerald-600 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(16,185,129,0.2)] overflow-hidden">
          {/* Decorative radial gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          
          <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
            <ShieldCheck size={14} />
            Utilidad Neta
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold text-emerald-200">Gs.</span>
            <h3 className="text-3xl font-black text-white tabular-nums tracking-tighter">
              {formatPrice(netProfit)}
            </h3>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-[8px] font-black text-white uppercase">Liquidez Real</span>
          </div>
        </div>

        {/* Ocupación Card */}
        <div className="bg-[#0f172a] border border-white/[0.05] rounded-[2rem] p-6 shadow-xl">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
            <PieChart size={14} className="text-blue-500" />
            Índice de Ocupación
          </p>
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-4xl font-black text-white tabular-nums tracking-tighter">{occupancyRate}%</h3>
             <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-blue-500 rotate-[45deg]" />
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-1000 ease-out" 
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
          <p className="text-slate-600 text-[9px] mt-4 font-bold uppercase">
             {stats.rentedUnits} de {stats.totalUnits} unidades activas
          </p>
        </div>
      </div>

      {/* Secondary Information Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Vencimientos Block */}
        <div className={`p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center transition-all border ${
          stats.expiringSoon > 0 
            ? 'bg-orange-500/[0.03] border-orange-500/20 shadow-lg shadow-orange-900/5' 
            : 'bg-[#0f172a] border-white/[0.03]'
        }`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${
            stats.expiringSoon > 0 ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-800/50 text-slate-600'
          }`}>
            <CalendarClock size={24} />
          </div>
          <h4 className={`text-2xl font-black tracking-tight ${stats.expiringSoon > 0 ? 'text-orange-500' : 'text-white'}`}>
            {stats.expiringSoon} Vencimientos
          </h4>
          <p className="text-slate-600 text-[10px] font-bold uppercase mt-2 tracking-widest">Próximos 30 días</p>
        </div>

        {/* Inquilinos Block */}
        <div className="p-8 bg-[#0f172a] border border-white/[0.03] rounded-[2.5rem] flex flex-col items-center justify-center text-center group hover:bg-[#1e293b] transition-colors">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-5 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <Users size={24} />
          </div>
          <h4 className="text-2xl font-black text-white tracking-tight">{stats.totalTenants} Inquilinos</h4>
          <p className="text-slate-600 text-[10px] font-bold uppercase mt-2 tracking-widest">Base de Datos</p>
        </div>

        {/* Unidades Block */}
        <div className="p-8 bg-[#0f172a] border border-white/[0.03] rounded-[2.5rem] flex flex-col items-center justify-center text-center group hover:bg-[#1e293b] transition-colors">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-5 group-hover:bg-indigo-500 group-hover:text-white transition-all">
            <Building2 size={24} />
          </div>
          <h4 className="text-2xl font-black text-white tracking-tight">{stats.totalUnits} Unidades</h4>
          <p className="text-slate-600 text-[10px] font-bold uppercase mt-2 tracking-widest">Gestión de Activos</p>
        </div>
      </div>
    </div>
  )
}

