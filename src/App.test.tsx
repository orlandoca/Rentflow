import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App Smoke Test', () => {
  it('renders the main heading', () => {
    render(<App />)
    expect(screen.getByText(/Rentflow 2026/i)).toBeInTheDocument()
  })
})
