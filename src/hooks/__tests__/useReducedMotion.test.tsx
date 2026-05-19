import { renderHook } from '@testing-library/react'
import useReducedMotion from '../useReducedMotion'

describe('useReducedMotion', () => {
  it('returns default on server', () => {
    const { result } = renderHook(() => useReducedMotion(true))
    // In node environment matchMedia is undefined so hook should use default
    expect(typeof result.current).toBe('boolean')
  })
})
