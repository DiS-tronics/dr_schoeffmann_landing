import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Resolve a Keystatic image field value to a usable src path.
 * fields.image() stores bare filenames (e.g. "thomas.png").
 * Paths that already start with "/" are returned as-is.
 * Returns null for empty/null values.
 */
export function resolveImageSrc(src) {
  if (!src) return null
  return src.startsWith('/') ? src : `/images/${src}`
}
