import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const links = [
    { href: '/', label: 'Start' },
    { href: '/services', label: 'Leistungen' },
    { href: '/ordination', label: 'Ordination' },
    { href: '/about', label: 'Über mich' },
    { href: '/contact', label: 'Kontakt' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-primary font-bold text-lg leading-tight">Dr. Thomas Schöffmann</span>
          <span className="text-gray-500 text-xs">Facharzt für Orthopädie &amp; Traumatologie</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex gap-6 items-center">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`text-sm font-medium transition-colors hover:text-accent ${router.pathname === l.href ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-gray-700'}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/contact" className="bg-primary text-white text-sm font-medium px-4 py-2 rounded hover:bg-accent transition-colors">
              Termin vereinbaren
            </Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 text-gray-700 hover:text-primary"
          onClick={() => setOpen(!open)}
          aria-label="Menü"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4">
          <ul className="flex flex-col gap-3">
            {links.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block text-sm font-medium py-1 ${router.pathname === l.href ? 'text-primary' : 'text-gray-700'}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block bg-primary text-white text-sm font-medium px-4 py-2 rounded text-center mt-2 hover:bg-accent transition-colors"
              >
                Termin vereinbaren
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
