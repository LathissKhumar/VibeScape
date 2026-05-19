import { useEffect, useState } from "react"

export default function useReducedMotion(defaultState = false) {
  const isClient = typeof window !== "undefined" && typeof window.matchMedia === "function"
  const query = "(prefers-reduced-motion: reduce)"
  const [reduced, setReduced] = useState<boolean>(
    isClient ? window.matchMedia(query).matches : defaultState
  )

  useEffect(() => {
    if (!isClient) return
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler)
    } else {
      // older browsers
      // @ts-ignore
      mql.addListener(handler)
    }
    setReduced(mql.matches)
    return () => {
      if (typeof mql.removeEventListener === "function") {
        mql.removeEventListener("change", handler)
      } else {
        // @ts-ignore
        mql.removeListener(handler)
      }
    }
  }, [isClient])

  return reduced
}
