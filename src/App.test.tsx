import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from './App'

// Mock de useAuth
vi.mock('@/lib/auth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    loading: false,
    signOut: vi.fn()
  })
}))

describe('App Smoke Test', () => {
  it('renders the main heading', () => {
    render(<App />)
    // Usamos un matcher mÃ¡s flexible para el footer
    expect(screen.getByText(/RENTFLOW PARAGUAY/i)).toBeInTheDocument()
  })
})
