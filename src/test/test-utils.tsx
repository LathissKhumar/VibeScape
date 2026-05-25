import React, { PropsWithChildren } from 'react'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { TooltipProvider } from '@/components/ui/tooltip'

function render(ui: React.ReactElement, options?: RenderOptions) {
  function Wrapper({ children }: PropsWithChildren) {
    return <TooltipProvider>{children}</TooltipProvider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...options })
}

export { render }
export * from '@testing-library/react'
