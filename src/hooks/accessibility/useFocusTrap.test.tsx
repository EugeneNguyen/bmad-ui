import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRef } from 'react'
import { useFocusTrap } from './useFocusTrap'

function TestComponent({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  useFocusTrap(containerRef, isActive)

  return (
    <div ref={containerRef} data-testid="container">
      <button data-testid="first">First</button>
      <button data-testid="middle">Middle</button>
      <button data-testid="last">Last</button>
    </div>
  )
}

describe('useFocusTrap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('traps focus within container when active', async () => {
    render(<TestComponent isActive={true} />)

    const firstBtn = screen.getByTestId('first')

    expect(firstBtn).toHaveFocus()
  })

  it('wraps focus from last to first element on Tab', async () => {
    render(<TestComponent isActive={true} />)

    const container = screen.getByTestId('container')
    const lastBtn = screen.getByTestId('last')
    const firstBtn = screen.getByTestId('first')

    lastBtn.focus()
    fireEvent.keyDown(container, { key: 'Tab' })

    await waitFor(() => {
      expect(firstBtn).toHaveFocus()
    })
  })

  it('wraps focus from first to last element on Shift+Tab', async () => {
    render(<TestComponent isActive={true} />)

    const container = screen.getByTestId('container')
    const firstBtn = screen.getByTestId('first')
    const lastBtn = screen.getByTestId('last')

    firstBtn.focus()
    fireEvent.keyDown(container, { key: 'Tab', shiftKey: true })

    await waitFor(() => {
      expect(lastBtn).toHaveFocus()
    })
  })

  it('does not trap focus when not active', () => {
    render(<TestComponent isActive={false} />)

    const firstBtn = screen.getByTestId('first')
    expect(firstBtn).not.toHaveFocus()
  })
})
