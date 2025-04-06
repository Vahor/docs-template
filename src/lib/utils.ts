import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"
import { createTV } from 'tailwind-variants';
import type { MergeConfig } from "tailwind-variants/dist/config.js";

const mergeConfig: MergeConfig = {
  extend: {
    theme: {
      text: ['title-h1', 'title-h2', 'title-h3', 'title-h4', 'title-h5', 'title-h6', 'label-xl', 'label-lg', 'label-md', 'label-sm', 'label-xs', 'paragraph-xl', 'paragraph-lg', 'paragraph-md', 'paragraph-sm', 'paragraph-xs', 'subheading-md', 'subheading-sm', 'subheading-xs', 'subheading-2xs', 'doc-label', 'doc-paragraph'],
    }
  }
}

const twMerge = extendTailwindMerge(mergeConfig)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const tv = createTV({
  twMergeConfig: mergeConfig,
})

export type { VariantProps } from 'tailwind-variants';

