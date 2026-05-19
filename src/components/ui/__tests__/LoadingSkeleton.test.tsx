import { render } from '@testing-library/react'
import LoadingSkeleton from '../LoadingSkeleton'

test('renders variants', () => {
  const { container } = render(<LoadingSkeleton variant="text" />)
  expect(container).toBeTruthy()
})
