import { createClient } from '@supabase/supabase-js'

// Usamos variables de entorno para mayor seguridad y flexibilidad
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Las variables de Supabase no están configuradas en el archivo .env")
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
