import { useState } from 'react'
import TenantsList from '@/features/tenants/TenantsList'
import TenantForm from '@/features/tenants/TenantForm'
import BuildingList from '@/features/buildings/BuildingList'
import BuildingForm from '@/features/buildings/BuildingForm'
import UnitList from '@/features/buildings/UnitList'
import UnitForm from '@/features/buildings/UnitForm'
import ContractList from '@/features/contracts/ContractList'
import ContractForm from '@/features/contracts/ContractForm'
import { Button } from '@/components/ui/button'

type Tab = 'tenants' | 'buildings' | 'contracts'
type SubTab = 'list' | 'units'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('tenants')
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('list')
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setShowForm(false)
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans">
      <header className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Rentflow 2026
          </h1>
          <p className="text-slate-400 text-sm">
            Gestión inteligente de alquileres · Paraguay
          </p>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => { setActiveTab('tenants'); setShowForm(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'tenants' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Inquilinos
          </button>
          <button 
            onClick={() => { setActiveTab('buildings'); setShowForm(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'buildings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Edificios
          </button>
          <button 
            onClick={() => { setActiveTab('contracts'); setShowForm(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'contracts' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Contratos
          </button>
        </div>

        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
        >
          {showForm ? 'Cancelar' : 
            activeTab === 'tenants' ? 'Nuevo Inquilino' : 
            activeTab === 'buildings' ? (activeSubTab === 'list' ? 'Nuevo Edificio' : 'Nuevo Depto') :
            'Nuevo Contrato'}
        </Button>
      </header>
      
      <main className="max-w-4xl mx-auto space-y-8">
        {/* Sub-navegación para Edificios */}
        {activeTab === 'buildings' && !showForm && (
          <div className="flex gap-4 border-b border-slate-900 pb-2">
            <button onClick={() => setActiveSubTab('list')} className={`pb-2 text-sm font-bold transition-colors ${activeSubTab === 'list' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-600 hover:text-slate-400'}`}>Torres</button>
            <button onClick={() => setActiveSubTab('units')} className={`pb-2 text-sm font-bold transition-colors ${activeSubTab === 'units' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-600 hover:text-slate-400'}`}>Departamentos</button>
          </div>
        )}

        {showForm ? (
          <section className="animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">
              {activeTab === 'tenants' ? 'Registrar Inquilino' : 
               activeTab === 'buildings' ? (activeSubTab === 'list' ? 'Registrar Edificio' : 'Registrar Departamento') :
               'Registrar Contrato'}
            </h2>
            {activeTab === 'tenants' ? <TenantForm onSuccess={handleSuccess} /> : 
             activeTab === 'buildings' ? (activeSubTab === 'list' ? <BuildingForm onSuccess={handleSuccess} /> : <UnitForm onSuccess={handleSuccess} />) :
             <ContractForm onSuccess={handleSuccess} />}
          </section>
        ) : (
          <section className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <h2 className="text-2xl font-bold text-slate-100">
                {activeTab === 'tenants' ? 'Inquilinos' : 
                 activeTab === 'buildings' ? (activeSubTab === 'list' ? 'Edificios' : 'Departamentos') :
                 'Contratos Activos'}
              </h2>
            </div>
            {activeTab === 'tenants' ? <TenantsList key={`t-${refreshKey}`} /> : 
             activeTab === 'buildings' ? (activeSubTab === 'list' ? <BuildingList key={`b-${refreshKey}`} /> : <UnitList key={`u-${refreshKey}`} />) :
             <ContractList key={`c-${refreshKey}`} />}
          </section>
        )}
      </main>

      <footer className="max-w-4xl mx-auto mt-20 text-slate-600 text-[10px] uppercase tracking-[0.2em] pt-8 text-center border-t border-slate-900">
        &copy; 2026 Rentflow Paraguay · Built with React 19 + Supabase
      </footer>
    </div>
  )
}

export default App
