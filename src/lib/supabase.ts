import { createClient } from '@supabase/supabase-js'

// DiagnÃ³stico temporal: hardcoding de credenciales
const supabaseUrl = 'https://vdcapnhaqyadsaaspwwq.supabase.co'
const supabaseAnonKey = 'sb_publishable_a1qxtA_ojUjH8n3bb6HVjw_irOTMR0E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
