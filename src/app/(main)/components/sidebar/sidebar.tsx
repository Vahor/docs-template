"use client"

import type * as React from "react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import {
  RiCodeSSlashLine,
  RiArticleLine,
  RiGitBranchLine,
} from '@remixicon/react';

const data = {
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: RiCodeSSlashLine,
      isActive: true,
    },
    {
      title: "Models",
      url: "#",
      icon: RiArticleLine,
    },
    {
      title: "Documentation",
      url: "#",
      icon: RiGitBranchLine,
    },
    {
      title: "Settings",
      url: "#",
      icon: RiGitBranchLine,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-[calc(var(--banner-height)+var(--header-height)+var(--menu-height))] !h-[calc(100svh-var(--banner-height)-var(--header-height)-var(--menu-height))] bg-transparent"
      {...props}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{/* Empty footer */}</SidebarFooter>
    </Sidebar>
  )
}


