import { useEffect, useState } from "react"

export default function useWebGL() {
  const isClient = typeof window !== "undefined"
  const [supported, setSupported] = useState<boolean>(false)

  useEffect(() => {
    if (!isClient) return
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setSupported(Boolean(gl))
    } catch (e) {
      setSupported(false)
    }
  }, [isClient])

  return supported
}
