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

export interface Building {
  id: string
  name: string
  address: string | null
  description: string | null
  status: 'available' | 'rented' | 'maintenance'
  created_at: string
  updated_at: string
}

export interface Unit {
  id: string
  building_id: string
  unit_number: string
  floor: string | null
  description: string | null
  price: number
  status: 'available' | 'rented' | 'maintenance'
  created_at: string
  updated_at: string
  building?: Building
}

export interface Contract {
  id: string
  tenant_id: string
  unit_id: string
  start_date: string
  end_date: string
  monthly_amount: number
  deposit_amount: number
  status: 'active' | 'finished' | 'cancelled'
  contract_url: string | null
  created_at: string
  updated_at: string
  tenant?: Tenant
  unit?: Unit
}
