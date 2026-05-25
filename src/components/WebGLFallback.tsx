'use client'

import { useEffect, useRef } from 'react'

interface ArtistData {
  name: string
  genres?: string[]
  popularity?: number
}

interface WebGLFallbackProps {
  artists: ArtistData[]
}

const genreColors: Record<string, string> = {
  pop: '#F472B6',
  rock: '#A855F7',
  'hip hop': '#22D3EE',
  electronic: '#22D3EE',
  jazz: '#FBBF24',
  classical: '#E5E7EB',
  rnb: '#F472B6',
  indie: '#A855F7',
}

function getGenreColor(genres?: string[]): string {
  if (!genres || genres.length === 0) return '#A855F7'
  const match = genres.find((g) => genreColors[g.toLowerCase()])
  return match || '#A855F7'
}

export function WebGLFallback({ artists }: WebGLFallbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio

      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, w, h)

      const cx = w / 2
      const cy = h / 2
      const maxRadius = Math.min(w, h) * 0.35

      artists.forEach((artist, i) => {
        const orbitRadius = maxRadius * (0.2 + (i / Math.max(artists.length, 1)) * 0.8)
        const speed = 0.0003 + (i % 3) * 0.0001
        const angle = time * speed + (i * Math.PI * 2) / Math.max(artists.length, 1)

        const x = cx + Math.cos(angle) * orbitRadius
        const y = cy + Math.sin(angle) * orbitRadius
        const size = 3 + (artist.popularity || 50) / 50 * 5
        const color = getGenreColor(artist.genres)

        ctx.beginPath()
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
        gradient.addColorStop(0, color)
        gradient.addColorStop(0.5, color + '40')
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.arc(x, y, size * 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = color
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      time++
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [artists])

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      aria-label="2D visualization of your music galaxy"
      role="img"
    />
  )
}
