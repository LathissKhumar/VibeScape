import { renderHook } from '@testing-library/react'
import useWebGL from '../useWebGL'

// JSDOM's canvas getContext('webgl') is not implemented; stub it in this test
beforeAll(() => {
  const createElement = document.createElement.bind(document)
  // stub only when creating canvas
  // override createElement in a type-safe way
  // @ts-ignore - test shim
  document.createElement = (tagName: string) => {
    const el = createElement(tagName)
    if (tagName === 'canvas') {
      const canvas = el as HTMLCanvasElement
      // provide a minimal getContext stub
      // store original if present
      const orig = canvas.getContext
      // @ts-ignore
      canvas.getContext = (ctx: string) => {
        if (ctx === 'webgl' || ctx === 'experimental-webgl') return null
        // call original for other contexts
        // @ts-ignore
        return orig ? orig.call(canvas, ctx) : null
      }
    }
    return el
  }
})

describe('useWebGL', () => {
  it('returns boolean', () => {
    const { result } = renderHook(() => useWebGL())
    expect(typeof result.current).toBe('boolean')
  })
})
