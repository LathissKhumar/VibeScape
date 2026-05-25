// Vitest/JSDOM setup for React Testing Library
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock IntersectionObserver for framer-motion whileInView
class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => ({ get: () => null }),
}))

// Mock next-auth
vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}))
