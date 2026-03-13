import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'
import { resolveImageSrc } from '../lib/utils'

export async function getStaticProps() {
  const reader = createReader(process.cwd(), keystaticConfig)
  const services = await reader.singletons.services.read()
  return { props: { services: services ?? null } }
}

export default function Services({ services }) {
  const introText = services?.introText ?? ''
  const serviceList = services?.services ?? []
  const operativeProcedures = services?.operativeProcedures ?? []
  const additionalProcedures = services?.additionalProcedures ?? []
  const operativeNote = services?.operativeNote ?? ''

  const extraSections = services?.extraSections ?? []

  const spineProcs = operativeProcedures.filter(p => p.category === 'spine')
  const hipProcs = operativeProcedures.filter(p => p.category === 'hip')
  const otherProcs = operativeProcedures.filter(p => p.category === 'other')

  return (
    <>
      <Head>
        <title>Leistungen – Ordination Dr. Thomas Schöffmann</title>
        <meta name="description" content="Leistungsangebot: Befundbesprechung, Schmerztherapie, Wirbelsäulenchirurgie, Hüftendoprothetik und mehr." />
      </Head>

      {/* Header */}
      <div className="bg-hero-beige py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-footer-brown mb-3">Leistungen</h1>
          <p className="text-footer-brown text-lg">Therapraxis Liebenfels – alles aus einer Hand</p>
        </div>
      </div>

      {/* Intro */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {introText && (
            <div className="bg-blue-50 rounded-2xl p-8 mb-10">
              <p className="text-gray-700 text-lg leading-relaxed">{introText}</p>
            </div>
          )}

          {/* Service list */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Leistungen Ordination Dr. Schöffmann</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14">
            {serviceList.map((s) => (
              <div key={s.label} className="flex items-start gap-3 bg-gray-50 rounded-xl px-5 py-4">
                <span className="text-accent text-xl flex-shrink-0">✓</span>
                <span className="text-gray-700">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Operative */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Operative Leistungen</h2>
          {operativeNote && <p className="text-gray-500 mb-8">{operativeNote}</p>}

          <div className="mb-6">
            {spineProcs.length > 0 && (
              <>
                <h3 className="text-xl font-semibold text-primary mb-4">Wirbelsäulenchirurgie</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  {spineProcs.map((op) => (
                    <div key={op.title} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-64 bg-gray-50">
                        {op.img && (
                          <Image src={resolveImageSrc(op.img)} alt={op.title} fill className="object-contain p-2" sizes="(max-width: 640px) 100vw, 50vw" />
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1">{op.title}</h4>
                        <p className="text-gray-600 text-sm">{op.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {hipProcs.length > 0 && (
              <>
                <h3 className="text-xl font-semibold text-primary mb-4">Künstlicher Hüftgelenksersatz (AMIS-Technik)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  {hipProcs.map((op) => (
                    <div key={op.title} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-64 bg-gray-50">
                        {op.img && (
                          <Image src={resolveImageSrc(op.img)} alt={op.title} fill className="object-contain p-2" sizes="(max-width: 640px) 100vw, 50vw" />
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1">{op.title}</h4>
                        <p className="text-gray-600 text-sm">{op.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {additionalProcedures.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-3">Weitere operative Leistungen</h4>
                <ul className="space-y-2 text-gray-600">
                  {additionalProcedures.map(p => (
                    <li key={p.label} className="flex items-center gap-2">
                      <span className="text-accent">•</span> {p.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {otherProcs.length > 0 && (
              <>
                <h3 className="text-xl font-semibold text-primary mb-4 mt-8">Weitere Leistungen</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  {otherProcs.map((op) => (
                    <div key={op.title} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-64 bg-gray-50">
                        {op.img && (
                          <Image src={resolveImageSrc(op.img)} alt={op.title} fill className="object-contain p-2" sizes="(max-width: 640px) 100vw, 50vw" />
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1">{op.title}</h4>
                        <p className="text-gray-600 text-sm">{op.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Extra sections added via CMS */}
      {extraSections.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 space-y-8">
            {extraSections.map((section, idx) => {
              if (section.type === 'paragraph') {
                return (
                  <div key={idx}>
                    {section.heading && (
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h3>
                    )}
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.text}</p>
                  </div>
                )
              }
              if (section.type === 'imageBlock') {
                const src = resolveImageSrc(section.image)
                return (
                  <figure key={idx} className="rounded-2xl overflow-hidden shadow-sm">
                    {src && (
                      <div className="relative w-full h-80">
                        <Image
                          src={src}
                          alt={section.caption ?? ''}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {section.caption && (
                      <figcaption className="px-4 py-2 text-sm text-gray-500 bg-gray-50">{section.caption}</figcaption>
                    )}
                  </figure>
                )
              }
              if (section.type === 'highlight') {
                return (
                  <div key={idx} className="bg-blue-50 border-l-4 border-primary rounded-xl p-5">
                    <p className="text-gray-700 whitespace-pre-line">{section.text}</p>
                  </div>
                )
              }
              return null
            })}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 bg-banner-gray">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Termin vereinbaren</h2>
          <p className="text-white mb-6">Für alle Leistungen ausschließlich nach vorheriger Terminvereinbarung</p>
          <Link href="/contact" className="inline-block bg-btn-warm text-white font-bold px-8 py-3 rounded-xl hover:bg-footer-brown transition-colors">
            Jetzt Termin anfragen
          </Link>
        </div>
      </section>
    </>
  )
}
