import { useEffect, useState } from "react"

export default function useMediaQuery(query: string, defaultState = false) {
  const isClient = typeof window !== "undefined" && typeof window.matchMedia === "function"
  const [matches, setMatches] = useState<boolean>(isClient ? window.matchMedia(query).matches : defaultState)

  useEffect(() => {
    if (!isClient) return
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    // matchMedia addEventListener is preferred but not universal
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler)
    } else {
      // older Safari
      // @ts-ignore
      mql.addListener(handler)
    }
    setMatches(mql.matches)
    return () => {
      if (typeof mql.removeEventListener === "function") {
        mql.removeEventListener("change", handler)
      } else {
        // @ts-ignore
        mql.removeListener(handler)
      }
    }
  }, [query, isClient])

  return matches
}
