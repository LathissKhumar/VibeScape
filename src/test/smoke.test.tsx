import React from 'react'
import { render, screen } from './test-utils'

test('smoke: renders a button', () => {
  render(<button>Click me</button>)
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
})
