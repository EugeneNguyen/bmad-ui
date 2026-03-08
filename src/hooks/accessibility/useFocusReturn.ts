import { useEffect, RefObject } from 'react'

/**
 * Returns focus to a trigger element when the condition is met.
 * Useful for returning focus to the element that opened a modal.
 *
 * @param triggerRef - Ref to the trigger element to return focus to
 * @param shouldReturn - Whether focus should be returned
 */
export function useFocusReturn(
  triggerRef: RefObject<HTMLButtonElement | HTMLElement | null> | undefined,
  shouldReturn: boolean
): void {
  useEffect(() => {
    if (shouldReturn && triggerRef?.current) {
      const timeoutId = setTimeout(() => {
        triggerRef.current?.focus()
      }, 0)

      return () => clearTimeout(timeoutId)
    }
  }, [shouldReturn, triggerRef])
}
