import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'
import { Spotlight } from '../components/ui/Spotlight'
import { WobbleCard } from '../components/ui/WobbleCard'
import { resolveImageSrc } from '../lib/utils'

// MovingBorder uses useAnimationFrame — must be client-side only
const MovingBorder = dynamic(
  () => import('../components/ui/MovingBorder').then(m => m.MovingBorder),
  { ssr: false }
)

export async function getStaticProps() {
  const reader = createReader(process.cwd(), keystaticConfig)
  const home = await reader.singletons.home.read()
  return { props: { home: home ?? null } }
}

export default function Home({ home }) {
  const heroTitle = home?.heroTitle ?? 'Herzlich Willkommen in der Ordination Dr. Schöffmann!'
  const heroSubtitle = home?.heroSubtitle ?? 'Facharzt für Orthopädie und Traumatologie – Liebenfels'
  const heroPortrait = resolveImageSrc(home?.heroPortrait) ?? '/images/thomas.png'
  const benefits = home?.benefits ?? []
  const ctaTitle = home?.ctaTitle ?? 'Machen Sie noch heute einen Termin'
  const ctaSubtitle = home?.ctaSubtitle ?? ''

  // Distinct gradient per card slot (cycles if more/fewer than 3 cards)
  const gradients = [
    'bg-gradient-to-br from-card-blue to-[#3d6099]',
    'bg-gradient-to-br from-card-teal to-[#38706b]',
    'bg-gradient-to-br from-card-purple to-[#4a3a4d]',
  ]

  return (
    <>
      <Head>
        <title>Ordination Dr. Thomas Schöffmann – Facharzt für Orthopädie &amp; Traumatologie</title>
        <meta name="description" content="Facharzt für Orthopädie und Traumatologie in Liebenfels. Wirbelsäulenchirurgie, Hüftendoprothetik, Schmerztherapie." />
        <link rel="icon" href="/icon.png" />
      </Head>

      {/* Hero with Spotlight */}
      <div className="bg-hero-beige py-12 lg:py-24 relative overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#0F5BB5" />
        <div className="max-w-6xl mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-10 relative z-10">
          <div className="flex-shrink-0 flex justify-center">
            <Image
              src={heroPortrait}
              alt="Dr. Thomas Schöffmann"
              width={300}
              height={400}
              priority
              className="object-cover rounded-xl shadow-xl"
            />
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-footer-brown text-4xl md:text-4xl font-bold leading-tight mb-6">
              {heroTitle}
            </h1>
            <p className="text-footer-brown text-xl mb-10">
              {heroSubtitle}
            </p>
            <Link
              href="/about"
              className="inline-block bg-btn-warm text-hero-beige font-bold px-10 py-4 rounded-xl hover:bg-footer-brown transition-colors text-lg shadow-lg"
            >
              Weiterlesen
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits with WobbleCard */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Unsere Vorteile für Sie</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Als Facharzt für Orthopädie und Traumatologie decke ich das Spektrum der degenerativen Erkrankungen
            des Bewegungsapparates sowie das akute Spektrum der Unfallchirurgie ab.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <WobbleCard
                key={b.title}
                containerClassName={`${gradients[i % gradients.length]} min-h-[220px]`}
              >
                {b.img && (
                  <div className="mb-4">
                    <Image
                      src={resolveImageSrc(b.img)}
                      alt={b.title}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{b.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{b.desc}</p>
              </WobbleCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner with Moving Border */}
      <section className="py-16 bg-banner-gray">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{ctaTitle}</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">{ctaSubtitle}</p>
          <Link href="/contact" className="inline-block">
            <MovingBorder containerClassName="rounded-xl">
              Jetzt Termin vereinbaren
            </MovingBorder>
          </Link>
        </div>
      </section>
    </>
  )
}
