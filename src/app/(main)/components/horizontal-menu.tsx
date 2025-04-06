"use client"

import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import { SectionIcon } from "@/lib/sections";

interface MenuItem {
  label: string
  icon: React.ElementType
  href: string
  isActive?: boolean
}

const items: MenuItem[] = [
  {
    label: "Documentation",
    icon: SectionIcon.guide,
    href: "#guide",
  },
  {
    label: "API routes",
    icon: SectionIcon.api,
    href: "#api",
  },
  {
    label: "Changelog",
    icon: SectionIcon.changelog,
    href: "#changelog",
  },
]

export function HorizontalMenu() {
  return (
    <div className="sticky top-[calc(var(--banner-height)+var(--header-height))] z-40 w-full border-b border-border bg-navbar/90 px-5">
      <TabMenuHorizontal.Root defaultValue='Profile'>
        <TabMenuHorizontal.List className="h-[var(--menu-height)]">
          {items.map(({ label, icon: Icon }) => (
            <TabMenuHorizontal.Trigger key={label} value={label}>
              {label}
            </TabMenuHorizontal.Trigger>
          ))}
        </TabMenuHorizontal.List>
      </TabMenuHorizontal.Root>
    </div>
  )
}


