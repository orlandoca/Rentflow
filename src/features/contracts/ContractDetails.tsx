import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Contract, Payment } from '@/types'
import { Button } from '@/components/ui/button'
import { generateReceiptPDF, generatePromissoryNotePDF } from '@/lib/pdfGenerators'

interface ContractDetailsProps {
  contractId: string
  onBack: () => void
}

interface PromissoryNote {
  id: string
  contract_id: string
  quota_number: number
  due_date: string
  status: string
}

export default function ContractDetails({ contractId, onBack }: ContractDetailsProps) {
  const [contract, setContract] = useState<Contract | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [promissoryNotes, setPromissoryNotes] = useState<PromissoryNote[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaying, setIsPaying] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
// ... (rest of imports and component state setup)

  useEffect(() => {
    fetchDetails()
  }, [contractId])

  async function fetchDetails() {
    try {
      setLoading(true)
      const [contractRes, paymentsRes, notesRes] = await Promise.all([
        supabase
          .from('contracts')
          .select('*, tenant:tenants(*), unit:units(*, building:buildings(*))')
          .eq('id', contractId)
          .single(),
        supabase
          .from('payments')
          .select('*')
          .eq('contract_id', contractId)
          .order('month_covered', { ascending: true }),
        supabase
          .from('promissory_notes')
          .select('*')
          .eq('contract_id', contractId)
          .order('quota_number', { ascending: true })
      ])

      if (contractRes.data) setContract(contractRes.data as any)
      if (paymentsRes.data) setPayments(paymentsRes.data)
      if (notesRes.data) setPromissoryNotes(notesRes.data)
    } catch (error) {
      console.error('Error fetching details:', error)
    } finally {
      setLoading(false)
    }
  }

// ... (existing helper methods: getPendingMonths, handleAddPayment, handleDownloadReceipt)

  const handleDownloadNote = (note: PromissoryNote) => {
    if (!contract || !contract.tenant || !contract.unit || !contract.unit.building) return
    generatePromissoryNotePDF({
      tenant: contract.tenant,
      unit: contract.unit,
      building: contract.unit.building,
      startDate: contract.start_date,
      endDate: contract.end_date,
      monthlyAmount: contract.monthly_amount,
      depositAmount: contract.deposit_amount
    }, note.quota_number, new Date(note.due_date + 'T00:00:00'))
  }

// ... (render return statement)
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Pagarés Asociados</h3>
        <div className="grid gap-3">
          {promissoryNotes.length === 0 ? (
            <p className="text-xs text-slate-600 font-bold">No se generaron pagarés para este contrato.</p>
          ) : (
            promissoryNotes.map(note => (
              <div key={note.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="text-slate-400 font-bold text-xs uppercase">Cuota {note.quota_number}</div>
                  <div className="text-slate-500 text-xs italic">Vence: {new Date(note.due_date + 'T00:00:00').toLocaleDateString()}</div>
                </div>
                <Button variant="ghost" onClick={() => handleDownloadNote(note)} className="text-blue-400 hover:text-blue-300 font-bold text-xs h-8">Descargar</Button>
              </div>
            ))
          )}
        </div>
      </section>
// ...


  const getPendingMonths = () => {
    if (!contract) return []
    const start = new Date(contract.start_date + 'T00:00:00')
    const endContract = new Date(contract.end_date + 'T00:00:00')
    const now = new Date()
    const limit = now < endContract ? now : endContract
    
    const pending = []
    let current = new Date(start.getFullYear(), start.getMonth(), 1)
    
    while (current <= limit) {
      const monthStr = current.toISOString().split('T')[0]
      const isPaid = payments.some(p => p.month_covered === monthStr)
      if (!isPaid) pending.push(new Date(current))
      current.setMonth(current.getMonth() + 1)
    }
    return pending
  }

  const handleAddPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newPayment = {
      contract_id: contractId,
      amount: Number(formData.get('amount')),
      payment_date: formData.get('payment_date'),
      month_covered: formData.get('month_covered'),
      payment_method: 'transfer',
    }

    const { error } = await supabase.from('payments').insert(newPayment)
    if (!error) {
      setIsPaying(false)
      fetchDetails()
    }
  }

  const handleDownloadReceipt = (payment: Payment) => {
    if (!contract || !contract.tenant || !contract.unit || !contract.unit.building) return
    generateReceiptPDF({
      payment,
      tenant: contract.tenant,
      unit: contract.unit,
      building: contract.unit.building
    })
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('es-PY').format(price)
  const formatMonth = (date: Date) => date.toLocaleDateString('es-PY', { month: 'long', year: 'numeric' })

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">Cargando sistema...</div>
  if (!contract) return <div className="p-8 text-center text-red-500 font-bold">Error: Contrato no encontrado.</div>

  const pendingMonths = getPendingMonths()

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-900 rounded-full transition-colors text-slate-400 text-xl">
            ←
          </button>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Estado de Cuenta</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{contract.tenant?.full_name}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${
            pendingMonths.length > 0 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
          }`}>
            {pendingMonths.length > 0 ? `${pendingMonths.length} MESES PENDIENTES` : 'AL DÍA'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Cargos Pendientes</h3>
            <div className="grid gap-3">
              {pendingMonths.length === 0 ? (
                <div className="p-12 bg-emerald-500/[0.03] border border-emerald-500/10 border-dashed rounded-[2rem] text-center">
                  <p className="text-emerald-500 font-bold text-sm tracking-tight">🎉 El inquilino se encuentra al día con sus obligaciones.</p>
                </div>
              ) : (
                pendingMonths.map((date, idx) => (
                  <div key={idx} className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex justify-between items-center group hover:bg-slate-900 transition-all border-l-4 border-l-red-600">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 text-xl">🗓️</div>
                      <div>
                        <h5 className="font-black text-white capitalize text-lg tracking-tight">{formatMonth(date)}</h5>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Monto: Gs. {formatPrice(contract.monthly_amount)}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        setSelectedMonth(date.toISOString().split('T')[0])
                        setIsPaying(true)
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-black h-10 px-6 rounded-xl shadow-lg shadow-red-900/20"
                    >
                      COBRAR
                    </Button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Historial de Cobros</h3>
            <div className="grid gap-3">
              {[...payments].reverse().map(payment => (
                <div key={payment.id} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex justify-between items-center group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 text-xl font-bold">✓</div>
                    <div>
                      <h5 className="font-bold text-slate-200 capitalize text-lg tracking-tight">{formatMonth(new Date(payment.month_covered + 'T00:00:00'))}</h5>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pagado el {new Date(payment.payment_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className="font-black text-emerald-400 text-lg tracking-tighter">Gs. {formatPrice(payment.amount)}</p>
                    <button 
                      onClick={() => handleDownloadReceipt(payment)}
                      className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg flex items-center justify-center"
                      title="Descargar Recibo de Dinero"
                    >
                      📥
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2rem] space-y-6 shadow-xl">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Unidad Asignada</h4>
              <div className="space-y-1">
                <p className="text-white font-black text-xl tracking-tight">{contract.unit?.building?.name}</p>
                <p className="text-sm text-slate-400 font-medium italic">Depto {contract.unit?.unit_number} · Piso {contract.unit?.floor}</p>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Garantía Activa</p>
              <p className="text-white font-black text-2xl tracking-tighter italic">Gs. {formatPrice(contract.deposit_amount)}</p>
            </div>
          </div>

          {isPaying && (
            <div className="p-8 bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-900/50 animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-white font-black uppercase text-xs tracking-[0.2em]">Registrar Cobro</h4>
                <button onClick={() => setIsPaying(false)} className="text-blue-200 hover:text-white text-xl">×</button>
              </div>
              <form onSubmit={handleAddPayment} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-blue-100 uppercase tracking-widest">Mes a Cubrir</label>
                  <input 
                    name="month_covered" 
                    type="date" 
                    required 
                    value={selectedMonth || ""}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full bg-blue-700/50 border-none rounded-xl p-4 text-white text-sm font-black focus:ring-2 focus:ring-white outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-blue-100 uppercase tracking-widest">Monto a Cobrar (Gs)</label>
                  <input name="amount" type="number" defaultValue={contract.monthly_amount} required className="w-full bg-blue-700/50 border-none rounded-xl p-4 text-white text-sm font-black outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-blue-100 uppercase tracking-widest">Fecha de Pago</label>
                  <input name="payment_date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full bg-blue-700/50 border-none rounded-xl p-4 text-white text-sm font-black outline-none" />
                </div>
                <Button type="submit" className="w-full bg-white text-blue-600 font-black rounded-xl h-14 text-sm shadow-xl hover:bg-blue-50 transition-all pt-1">
                  GUARDAR Y CERRAR
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
