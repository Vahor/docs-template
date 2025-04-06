"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as Tooltip from "@/components/ui/tooltip"

export function Providers({ children }: React.PropsWithChildren) {
  return <NextThemesProvider attribute="class">
    <Tooltip.Provider>
      {children}
    </Tooltip.Provider>
  </NextThemesProvider>
}
