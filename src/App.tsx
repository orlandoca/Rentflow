import { useState } from 'react'
import TenantsList from '@/features/tenants/TenantsList'
import TenantForm from '@/features/tenants/TenantForm'
import BuildingList from '@/features/buildings/BuildingList'
import BuildingForm from '@/features/buildings/BuildingForm'
import UnitList from '@/features/buildings/UnitList'
import UnitForm from '@/features/buildings/UnitForm'
import ContractList from '@/features/contracts/ContractList'
import ContractForm from '@/features/contracts/ContractForm'
import Dashboard from '@/features/dashboard/Dashboard'
import { Button } from '@/components/ui/button'

type Tab = 'dashboard' | 'tenants' | 'buildings' | 'contracts'
type SubTab = 'list' | 'units'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('list')
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setShowForm(false)
    setRefreshKey(prev => prev + 1)
  }

  const tabs = [
    { id: 'dashboard', label: 'Resumen', icon: '📊' },
    { id: 'tenants', label: 'Inquilinos', icon: '👤' },
    { id: 'buildings', label: 'Edificios', icon: '🏢' },
    { id: 'contracts', label: 'Contratos', icon: '📄' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      {/* Header Fijo / Moderno */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-900/40">🌊</div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                RENTFLOW
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Management System</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as Tab); setShowForm(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          {activeTab !== 'dashboard' && (
            <Button 
              onClick={() => setShowForm(!showForm)}
              className={`${showForm ? 'bg-slate-800' : 'bg-emerald-600 hover:bg-emerald-500'} text-white rounded-xl px-6 font-bold shadow-lg transition-all`}
            >
              {showForm ? 'Volver' : `Nuevo ${activeTab === 'tenants' ? 'Inquilino' : activeTab === 'buildings' ? (activeSubTab === 'list' ? 'Edificio' : 'Depto') : 'Contrato'}`}
            </Button>
          )}
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        {/* Sub-navegación para Edificios */}
        {activeTab === 'buildings' && !showForm && (
          <div className="flex gap-8 border-b border-slate-900 mb-8">
            <button 
              onClick={() => setActiveSubTab('list')} 
              className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === 'list' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-600 hover:text-slate-400'}`}
            >
              Torres / Edificios
            </button>
            <button 
              onClick={() => setActiveSubTab('units')} 
              className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === 'units' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-600 hover:text-slate-400'}`}
            >
              Departamentos
            </button>
          </div>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {showForm ? (
            <section className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {activeTab === 'tenants' ? 'Nuevo Inquilino' : 
                   activeTab === 'buildings' ? (activeSubTab === 'list' ? 'Registrar Edificio' : 'Nuevo Departamento') :
                   'Crear Contrato'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">Completa los datos para el registro oficial.</p>
              </div>
              {activeTab === 'tenants' ? <TenantForm onSuccess={handleSuccess} /> : 
               activeTab === 'buildings' ? (activeSubTab === 'list' ? <BuildingForm onSuccess={handleSuccess} /> : <UnitForm onSuccess={handleSuccess} />) :
               <ContractForm onSuccess={handleSuccess} />}
            </section>
          ) : (
            <section className="space-y-6">
              {activeTab === 'dashboard' ? <Dashboard key={refreshKey} /> :
               activeTab === 'tenants' ? <TenantsList key={`t-${refreshKey}`} /> : 
               activeTab === 'buildings' ? (activeSubTab === 'list' ? <BuildingList key={`b-${refreshKey}`} /> : <UnitList key={`u-${refreshKey}`} />) :
               <ContractList key={`c-${refreshKey}`} />}
            </section>
          )}
        </div>
      </main>

      <footer className="max-w-5xl mx-auto mt-20 px-8 py-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
        <div>&copy; 2026 RENTFLOW PARAGUAY</div>
        <div className="flex gap-6">
          <span className="text-slate-800">●</span>
          <span>ADMINISTRATION PANEL</span>
          <span className="text-slate-800">●</span>
          <span>SECURE CLOUD</span>
        </div>
      </footer>
    </div>
  )
}

export default App
