import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';

interface MenuItem {
  label: string
  href: string
}

const items: MenuItem[] = [
  {
    label: "Documentation",
    href: "#guide",
  },
  {
    label: "API routes",
    href: "#api",
  },
  {
    label: "Changelog",
    href: "#changelog",
  },
]

export function HorizontalMenu() {
  return (
    <div className="sticky top-[calc(var(--banner-height)+var(--header-height))] z-40 w-full bg-navbar">
      <TabMenuHorizontal.Root defaultValue='Profile'>
        <TabMenuHorizontal.List className="h-[var(--menu-height)] border-b px-5">
          {items.map(({ label }) => (
            <TabMenuHorizontal.Trigger key={label} value={label}>
              {label}
            </TabMenuHorizontal.Trigger>
          ))}
        </TabMenuHorizontal.List>
      </TabMenuHorizontal.Root>
    </div>
  )
}


