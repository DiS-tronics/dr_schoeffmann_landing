import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">Dr. Thomas Schöffmann</h3>
          <p className="text-sm">Facharzt für Orthopädie und Traumatologie</p>
          <p className="text-sm mt-2">Feldkirchnerstr. 2<br />9556 Liebenfels</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Kontakt</h3>
          <p className="text-sm">Tel.: <a href="tel:+4367648396 48" className="hover:text-white">+43 676 48 396 48</a></p>
          <p className="text-sm mt-1">E-Mail: <a href="mailto:ordination@dr-schoeffmann.at" className="hover:text-white">ordination@dr-schoeffmann.at</a></p>
          <p className="text-sm mt-2 text-gray-400">Ausschließlich nach<br />vorheriger Terminvereinbarung</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Navigation</h3>
          <ul className="flex flex-col gap-1 text-sm">
            {[['/', 'Start'], ['/services', 'Leistungen'], ['/ordination', 'Ordination'], ['/about', 'Über mich'], ['/contact', 'Kontakt'], ['/contact#impressum', 'Impressum']].map(([href, label]) => (
              <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
            ))}
            <li><a href="/Datenschutz.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Datenschutz</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 px-4 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Dr. Thomas Schöffmann · <Link href="/contact#impressum" className="hover:text-gray-300">Impressum</Link>
      </div>
    </footer>
  )
}
