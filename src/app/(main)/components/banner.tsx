"use client"
import Link from "next/link"
import { useState } from "react"
import * as Button from "@/components/ui/button"
import { RiCloseLine } from '@remixicon/react';

interface BannerProps {
  onClose?: () => void
}

export function BannerContainer() {
  const [isVisible, setIsVisible] = useState(true)

  const close = () => {
    setIsVisible(false)
    document.documentElement.style.setProperty("--banner-height", "0px")
  }

  if (!isVisible) {
    return null
  }

  return <Banner onClose={close} />
}

function Banner({ onClose }: BannerProps) {
  return (
    <div className="fixed top-0 inset-x-0 bg-bg-white px-4 py-2 text-text-dark h-[var(--banner-height)] flex items-center dark z-[50]" style={{ paddingRight: "var(--removed-body-scroll-bar-size)" }}>
      <div className="flex items-center justify-center gap-2 text-sm font-medium w-full">
        <span>🎉 Wow nice banner.</span>
        <Link href="#" className="underline underline-offset-4 hover:opacity-90">
          Learn more
        </Link>
      </div>
      <Button.Root
        mode="ghost"
        variant="neutral"
        size="xxsmall"
        className="absolute right-4 top-1/2 -translate-y-1/2 dark"
        onClick={onClose}
      >
        <Button.Icon className="size-5" as={RiCloseLine} />
        <span className="sr-only">Close banner</span>
      </Button.Root>
    </div>
  )
}


