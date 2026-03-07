import Link from 'next/link'
export default function Nav(){
  return (
    <nav className="bg-white border-b">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/"><a className="font-semibold text-lg">Dr. Schoeffmann</a></Link>
        <div className="space-x-4">
          <Link href="/"><a className="text-sm">Home</a></Link>
          <Link href="/about"><a className="text-sm">About</a></Link>
          <Link href="/services"><a className="text-sm">Services</a></Link>
          <Link href="/ordination"><a className="text-sm">Ordination</a></Link>
          <Link href="/contact"><a className="text-sm">Contact</a></Link>
        </div>
      </div>
    </nav>
  )
}
