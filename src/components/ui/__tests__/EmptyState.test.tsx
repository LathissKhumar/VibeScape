import { render, screen } from '@testing-library/react'
import EmptyState from '../EmptyState'

test('renders title and description', () => {
  render(<EmptyState title="No items" description="Try adding some" />)
  expect(screen.getByText('No items')).toBeInTheDocument()
  expect(screen.getByText('Try adding some')).toBeInTheDocument()
})
