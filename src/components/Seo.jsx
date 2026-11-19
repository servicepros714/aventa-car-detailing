import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applyHead } from '../lib/seo'

// Swaps the <head> tags (title, description, canonical, og, JSON-LD) on every
// client-side navigation. The prerendered HTML already has them for the first load.
export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    applyHead(pathname)
  }, [pathname])
  return null
}
