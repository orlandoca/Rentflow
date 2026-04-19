export interface Tenant {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  ci: string
  address: string | null
  created_at: string
  updated_at: string
}
