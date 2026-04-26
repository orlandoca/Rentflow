import { useState } from "react"
import TenantsList from "@/features/tenants/TenantsList"
import TenantForm from "@/features/tenants/TenantForm"
import BuildingList from "@/features/buildings/BuildingList"
import BuildingForm from "@/features/buildings/BuildingForm"
import UnitList from "@/features/buildings/UnitList"
import UnitForm from "@/features/buildings/UnitForm"
import ContractList from "@/features/contracts/ContractList"
import ContractForm from "@/features/contracts/ContractForm"
import ContractDetails from "@/features/contracts/ContractDetails"
import ExpenseList from "@/features/expenses/ExpenseList"
import ExpenseForm from "@/features/expenses/ExpenseForm"
import Dashboard from "@/features/dashboard/Dashboard"
import LoginPage from "@/features/auth/LoginPage"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { Building, Tenant } from "@/types"

type Tab = "dashboard" | "tenants" | "buildings" | "contracts" | "expenses"
type SubTab = "list" | "units"

function App() {
  const { user, loading, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("list")
  const [showForm, setShowForm] = useState(false)
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null)
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setShowForm(false)
    setEditingBuilding(null)
    setEditingTenant(null)
    setRefreshKey(prev => prev + 1)
  }

  const handleEditBuilding = (building: Building) => {
    setEditingBuilding(building)
    setShowForm(true)
  }

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant)
    setShowForm(true)
  }

  const tabs = [
    { id: "dashboard", label: "Resumen", icon: "📊" },
    { id: "tenants", label: "Inquilinos", icon: "👤" },
    { id: "buildings", label: "Edificios", icon: "🏢" },
    { id: "contracts", label: "Contratos", icon: "📄" },
    { id: "expenses", label: "Gastos", icon: "💸" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-2xl animate-bounce">🌊</div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] animate-pulse">Iniciando Rentflow...</p>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">       
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-900/40">🌊</div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase">
                RENTFLOW
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Admin Panel</p>
            </div>
          </div>

          <nav className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as Tab); setShowForm(false); setSelectedContractId(null); setEditingBuilding(null); setEditingTenant(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {activeTab !== "dashboard" && !selectedContractId && (
              <Button
                onClick={() => {
                  if (showForm) { setEditingBuilding(null); setEditingTenant(null); }
                  setShowForm(!showForm);
                }}
                className={`${showForm ? "bg-slate-800" : "bg-emerald-600 hover:bg-emerald-500"} text-white rounded-xl px-6 font-bold shadow-lg transition-all hidden md:flex h-10`}
              >
                {showForm ? "Volver" : `Nuevo ${activeTab === "tenants" ? "Inquilino" : activeTab === "buildings" ? (activeSubTab === "list" ? "Edificio" : "Depto") : activeTab === "expenses" ? "Gasto" : "Contrato"}`}
              </Button>
            )}
            <button
              onClick={signOut}
              className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all shadow-lg"     
              title="Cerrar Sesión"
            >
              🚪
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        {selectedContractId ? (
          <ContractDetails
            contractId={selectedContractId}
            onBack={() => setSelectedContractId(null)}
          />
        ) : (
          <>
            {activeTab === "buildings" && !showForm && (
              <div className="flex gap-8 border-b border-slate-900 mb-8">
                <button onClick={() => setActiveSubTab("list")} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === "list" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-600 hover:text-slate-400"}`}>Torres / Edificios</button>
                <button onClick={() => setActiveSubTab("units")} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === "units" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-600 hover:text-slate-400"}`}>Departamentos</button>
              </div>
            )}

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {showForm ? (
                <section className="max-w-2xl mx-auto">
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-white tracking-tight">
                      {editingTenant ? `Editar Inquilino: ${editingTenant.full_name}` :
                       editingBuilding ? `Editar Edificio: ${editingBuilding.name}` :
                       activeTab === "tenants" ? "Nuevo Inquilino" :
                       activeTab === "buildings" ? (activeSubTab === "list" ? "Registrar Edificio" : "Nuevo Departamento") :
                       activeTab === "expenses" ? "Registrar Gasto" :
                       "Crear Contrato"}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Completa los datos para el registro oficial.</p>
                  </div>
                  {activeTab === "tenants" ? <TenantForm tenant={editingTenant || undefined} onSuccess={handleSuccess} /> :
                   activeTab === "buildings" ? (activeSubTab === "list" ? <BuildingForm building={editingBuilding || undefined} onSuccess={handleSuccess} /> : <UnitForm onSuccess={handleSuccess} />) :
                   activeTab === "expenses" ? <ExpenseForm onSuccess={handleSuccess} /> :
                   <ContractForm onSuccess={handleSuccess} />}
                </section>
              ) : (
                <section className="space-y-6">
                  {activeTab === "dashboard" ? <Dashboard key={refreshKey} /> :
                   activeTab === "tenants" ? <TenantsList key={`t-${refreshKey}`} onEdit={handleEditTenant} /> :
                   activeTab === "buildings" ? (activeSubTab === "list" ? <BuildingList key={`b-${refreshKey}`} onEdit={handleEditBuilding} /> : <UnitList key={`u-${refreshKey}`} />) :
                   activeTab === "expenses" ? <ExpenseList key={`e-${refreshKey}`} /> :
                   <ContractList key={`c-${refreshKey}`} onViewDetails={(id) => setSelectedContractId(id)} />}
                </section>
              )}
            </div>
          </>
        )}
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
