"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function Providers({ children }: React.PropsWithChildren) {
  return <NextThemesProvider attribute="class">{children}</NextThemesProvider>
}
