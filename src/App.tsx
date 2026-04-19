import { useState } from 'react'
import TenantsList from '@/features/tenants/TenantsList'
import TenantForm from '@/features/tenants/TenantForm'
import { Button } from '@/components/ui/button'

function App() {
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setShowForm(false)
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Rentflow 2026
          </h1>
          <p className="text-slate-400 text-sm">
            Gestión inteligente de alquileres · Paraguay
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {showForm ? 'Cancelar' : 'Nuevo Inquilino'}
        </Button>
      </header>
      
      <main className="max-w-4xl mx-auto space-y-8">
        {showForm ? (
          <section className="animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Registrar Inquilino</h2>
            <TenantForm onSuccess={handleSuccess} />
          </section>
        ) : (
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-200">Inquilinos Registrados</h2>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total: {refreshKey >= 0 ? '...' : ''}</span>
            </div>
            <TenantsList key={refreshKey} />
          </section>
        )}

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold mb-1">Flujo de Caja</h3>
            <p className="text-xs text-slate-500">Próximamente...</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold mb-1">Contratos</h3>
            <p className="text-xs text-slate-500">Próximamente...</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold mb-1">Reportes</h3>
            <p className="text-xs text-slate-500">Próximamente...</p>
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto mt-20 text-slate-600 text-xs border-t border-slate-900 pt-8 text-center">
        &copy; 2026 Rentflow - Built with React + Supabase + Tailwind v4
      </footer>
    </div>
  )
}

export default App
