import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { useRef, useEffect } from 'react'
import { useFocusReturn } from './useFocusReturn'

function TestComponent({ shouldReturn }: { shouldReturn: boolean }) {
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!shouldReturn) {
      document.body.focus()
    }
  }, [shouldReturn])

  useFocusReturn(triggerRef, shouldReturn)

  return <button ref={triggerRef}>Trigger</button>
}

describe('useFocusReturn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns focus to trigger element when shouldReturn is true', async () => {
    render(<TestComponent shouldReturn={true} />)

    const trigger = screen.getByRole('button')
    await waitFor(() => {
      expect(trigger).toHaveFocus()
    })
  })

  it('does not return focus when shouldReturn is false', async () => {
    render(<TestComponent shouldReturn={false} />)

    const trigger = screen.getByRole('button')
    expect(trigger).not.toHaveFocus()
  })
})
