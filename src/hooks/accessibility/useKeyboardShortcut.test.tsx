import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useKeyboardShortcut } from './useKeyboardShortcut'

describe('useKeyboardShortcut', () => {
  let handler: ReturnType<typeof vi.fn>

  beforeEach(() => {
    handler = vi.fn()
    vi.clearAllMocks()
  })

  it('calls handler when key is pressed', () => {
    renderHook(() => useKeyboardShortcut('Escape', handler, { enabled: true }))

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not call handler when disabled', () => {
    renderHook(() => useKeyboardShortcut('Escape', handler, { enabled: false }))

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })

    expect(handler).not.toHaveBeenCalled()
  })

  it('calls handler with modifier keys', () => {
    renderHook(() => useKeyboardShortcut('s', handler, { enabled: true, ctrl: true }))

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true }))
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not call handler when modifier key is not pressed', () => {
    renderHook(() => useKeyboardShortcut('s', handler, { enabled: true, ctrl: true }))

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }))
    })

    expect(handler).not.toHaveBeenCalled()
  })

  it('cleans up event listener on unmount', () => {
    const { unmount } = renderHook(() => useKeyboardShortcut('Escape', handler, { enabled: true }))

    unmount()

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })

    expect(handler).not.toHaveBeenCalled()
  })
})
