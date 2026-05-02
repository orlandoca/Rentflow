import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Mail, Lock } from 'lucide-react'

/**
 * Intent: The administrator feels like an architect of their finances.
 * Palette: Ink Navy, Steel Gray, Blueprint Blue.
 * Depth: Layered elevation with whisper-quiet borders.
 */
export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Credenciales inválidas. Revisá los datos del registro.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Blueprint Grid Background - Signature Element */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 z-0 opacity-[0.02]" 
           style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
      
      <div className="w-full max-w-[420px] relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
             <span className="text-4xl">🌊</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2 italic">
            RENTFLOW
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-slate-800" />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Propiedad & Finanzas</p>
            <span className="h-px w-8 bg-slate-800" />
          </div>
        </div>

        <div className="bg-[#0f172a] border border-white/[0.05] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[3rem] p-10 relative overflow-hidden">
          {/* Subtle light leak */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px]" />
          
          <form onSubmit={handleLogin} className="space-y-8 relative z-10">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                <Mail size={12} className="text-blue-500" />
                Email Corporativo
              </label>
              <div className="relative group">
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rentflow.com.py"
                  className="w-full bg-[#020617] border border-white/[0.05] rounded-2xl p-4 text-white text-sm focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-700 font-medium"
                />
                <div className="absolute inset-0 rounded-2xl bg-blue-500/0 group-focus-within:bg-blue-500/[0.02] pointer-events-none transition-all" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                <Lock size={12} className="text-blue-500" />
                Llave de Acceso
              </label>
              <div className="relative group">
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#020617] border border-white/[0.05] rounded-2xl p-4 text-white text-sm focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-700 font-medium"
                />
                <div className="absolute inset-0 rounded-2xl bg-blue-500/0 group-focus-within:bg-blue-500/[0.02] pointer-events-none transition-all" />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black h-16 rounded-2xl text-[11px] tracking-[0.2em] shadow-[0_10px_30px_rgba(37,99,235,0.2)] transition-all flex items-center justify-center gap-3 border-t border-white/20 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  VALIDANDO...
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  INGRESAR AL SISTEMA
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-slate-800" />
            Admin Secure Access v2.0
            <span className="w-1 h-1 rounded-full bg-slate-800" />
          </p>
          <div className="flex gap-4 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all">
             {/* Espacio para logos de partners/seguridad */}
          </div>
        </div>
      </div>
    </div>
  )
}

