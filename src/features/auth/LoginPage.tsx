import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

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
      setError('Credenciales inválidas. Revisá tus datos.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Effect de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-2xl shadow-blue-900/40 mx-auto mb-4">🌊</div>
          <h1 className="text-4xl font-black tracking-tighter text-white">RENTFLOW</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mt-2">Acceso Administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Corporativo</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rentflow.com.py"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black h-14 rounded-2xl text-sm shadow-xl shadow-blue-900/20 transition-all pt-1"
          >
            {loading ? 'AUTENTICANDO...' : 'ENTRAR AL SISTEMA'}
          </Button>
        </form>

        <p className="text-center mt-10 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          &copy; 2026 RENTFLOW PARAGUAY · SECURE ACCESS
        </p>
      </div>
    </div>
  )
}
