import Image from 'next/image'
import Link from 'next/link'

export default function Hero({ title, subtitle, imageSrc, cta }) {
  return (
    <div className="relative h-[70vh] min-h-[400px] flex items-center">
      <Image
        src={imageSrc}
        alt={title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
        <div className="max-w-xl">
          <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-blue-100 text-lg md:text-xl mb-8">{subtitle}</p>
          )}
          {cta && (
            <Link
              href={cta.href}
              className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-lg shadow-lg"
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
