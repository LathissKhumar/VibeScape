import { render, screen } from '@/test/test-utils'
import { WebGLFallback } from '@/components/WebGLFallback'

test('renders canvas element', () => {
  render(<WebGLFallback artists={[]} />)
  expect(screen.getByRole('img')).toBeInTheDocument()
})

test('renders with artists data', () => {
  const artists = [
    { name: 'Artist 1', genres: ['pop'], popularity: 80 },
    { name: 'Artist 2', genres: ['rock'], popularity: 60 },
  ]
  render(<WebGLFallback artists={artists} />)
  expect(screen.getByRole('img')).toBeInTheDocument()
})
