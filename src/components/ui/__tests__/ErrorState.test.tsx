import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ErrorState from '../ErrorState'

test('renders error and calls retry', async () => {
  const onRetry = vi.fn()
  render(<ErrorState message="Oops" onRetry={onRetry} />)
  expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  expect(screen.getByText('Oops')).toBeInTheDocument()
  await userEvent.click(screen.getByTestId('retry-btn'))
  expect(onRetry).toHaveBeenCalled()
})
