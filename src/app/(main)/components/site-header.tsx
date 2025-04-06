
import { Separator } from "@/components/ui/separator"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { AlgoliaSearchBox } from "@/app/(main)/components/algolia/search-box"

export function SiteHeader() {
  return (
    <header className="flex sticky top-[var(--banner-height)] z-50 w-full items-center border-b border-border bg-navbar">
      <div className="flex h-[var(--header-height)] w-full items-center gap-2 px-4">

        {/* App Logo */}
        <div className="flex items-center gap-2 mr-4 shrink-0">
          <img src="https://placehold.co/32x32" width={32} height={32} alt="Company Logo" className="flex aspect-square h-8 rounded-lg" />
          <div className="hidden sm:grid text-sm leading-tight">
            <span className="font-semibold">Company</span>
            <span className="text-xs text-muted-foreground">Documentation</span>
          </div>
        </div>

        <AlgoliaSearchBox className="w-full" />


        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}


