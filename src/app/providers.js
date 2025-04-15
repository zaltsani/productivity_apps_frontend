'use client'

import { QueryClient, QueryClientProvider } from "react-query"
import { SessionProvider } from "next-auth/react"

export default function Providers({ children }) {
  const queryClient = new QueryClient()

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}