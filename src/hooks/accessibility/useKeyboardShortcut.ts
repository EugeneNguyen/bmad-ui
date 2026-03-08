import { useEffect, useCallback } from 'react'

export interface KeyboardShortcutOptions {
  /** Whether the shortcut is enabled */
  enabled?: boolean
  /** Whether Ctrl key must be pressed */
  ctrl?: boolean
  /** Whether Shift key must be pressed */
  shift?: boolean
  /** Whether Alt key must be pressed */
  alt?: boolean
  /** Whether to prevent default behavior */
  preventDefault?: boolean
}

/**
 * Registers a keyboard shortcut handler.
 *
 * @param key - The key to listen for (e.g., 'Escape', 'Enter')
 * @param handler - The callback to execute when the key is pressed
 * @param options - Configuration options for the shortcut
 */
export function useKeyboardShortcut(
  key: string,
  handler: () => void,
  options: KeyboardShortcutOptions = {}
): void {
  const { enabled = true, ctrl, shift, alt, preventDefault = true } = options

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const keyMatches = e.key === key
      const ctrlMatches = ctrl === undefined || ctrl === e.ctrlKey
      const shiftMatches = shift === undefined || shift === e.shiftKey
      const altMatches = alt === undefined || alt === e.altKey

      if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
        if (preventDefault) {
          e.preventDefault()
        }
        handler()
      }
    },
    [key, handler, ctrl, shift, alt, preventDefault]
  )

  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, handleKeyDown])
}
