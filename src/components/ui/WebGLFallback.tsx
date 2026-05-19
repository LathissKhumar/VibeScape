import * as React from "react"

export function WebGLFallback({ message = "WebGL not available" }: { message?: string }) {
  const ref = React.useRef<HTMLCanvasElement | null>(null)

  React.useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    c.width = c.offsetWidth * dpr
    c.height = c.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    const w = c.offsetWidth
    const h = c.offsetHeight

    ctx.fillStyle = "#0a0a0f"
    ctx.fillRect(0, 0, w, h)

    const time = Date.now() * 0.001
    for (let i = 0; i < 80; i++) {
      const x = ((Math.sin(i * 0.7 + time * 0.1) + 1) / 2) * w
      const y = ((Math.cos(i * 0.5 + time * 0.08) + 1) / 2) * h
      const r = 0.5 + Math.sin(i + time) * 0.5
      const alpha = 0.2 + Math.sin(i * 0.3 + time * 0.2) * 0.15
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`
      ctx.fill()
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
    ctx.font = "14px system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(message, w / 2, h / 2 - 8)

    ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
    ctx.font = "12px system-ui, sans-serif"
    ctx.fillText("Your browser does not support WebGL", w / 2, h / 2 + 12)
  }, [message])

  return <canvas ref={ref} className="w-full h-full rounded-md" />
}

export default WebGLFallback
