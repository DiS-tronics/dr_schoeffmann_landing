import Head from 'next/head'
import Image from 'next/image'
import { createReader } from '@keystatic/core/reader'
import { DocumentRenderer } from '@keystatic/core/renderer'
import keystaticConfig from '../keystatic.config'

export async function getStaticProps() {
  const reader = createReader(process.cwd(), keystaticConfig)
  const about = await reader.singletons.about.read()
  // bioContent is an async fn returned by the document field reader
  const bioContent = about?.bioContent ? await about.bioContent() : []
  // JSON round-trip strips `undefined` properties that Next.js cannot serialize
  const safeBioContent = JSON.parse(JSON.stringify(bioContent))
  return {
    props: {
      about: about ? { ...about, bioContent: safeBioContent } : null,
    },
  }
}

export default function About({ about }) {
  const pageTitle = about?.pageTitle ?? 'Über mich'
  const pageSubtitle = about?.pageSubtitle ?? 'Dr. Thomas Schöffmann'
  const bioContent = about?.bioContent ?? []
  const education = about?.education ?? []
  const career = about?.career ?? []
  const memberships = about?.memberships ?? []
  const extraSections = about?.extraSections ?? []

  return (
    <>
      <Head>
        <title>Über mich – Dr. Thomas Schöffmann</title>
        <meta name="description" content="Facharzt für Orthopädie und Traumatologie. Spezialisierung in Wirbelsäulenchirurgie und Hüftendoprothetik." />
      </Head>

      <div className="bg-hero-beige py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-footer-brown mb-3">{pageTitle}</h1>
          <p className="text-footer-brown text-lg">{pageSubtitle}</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
            <div className="md:col-span-1">
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg sticky top-24">
                <Image
                  src="/images/about.jpeg"
                  alt="Dr. Thomas Schöffmann"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-1">Dr. Thomas Schöffmann</h2>
                <p className="text-gray-500">Facharzt für Orthopädie und Traumatologie</p>
              </div>

              {bioContent.length > 0 && (
                <div className="prose prose-gray max-w-none text-gray-700">
                  <DocumentRenderer document={bioContent} />
                </div>
              )}

              {education.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Ausbildung</h3>
                  <div className="space-y-2">
                    {education.map((item) => (
                      <div key={item.institution} className="flex items-start gap-3">
                        <span className="text-accent mt-1 flex-shrink-0">▸</span>
                        <div>
                          <span className="text-gray-800 font-medium">{item.institution}</span>
                          {item.detail && <span className="text-gray-500 text-sm block">{item.detail}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {career.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Beruflicher Werdegang</h3>
                  <div className="space-y-2">
                    {career.map((item) => (
                      <div key={item.years} className="flex gap-4">
                        <span className="text-primary font-semibold text-sm w-28 flex-shrink-0 pt-0.5">{item.years}</span>
                        <span className="text-gray-700">{item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-primary mb-2">Klinische Schwerpunkte</h3>
                <p className="text-gray-700">Konservative und operative Wirbelsäulenchirurgie sowie Hüftendoprothetik</p>
              </div>
            </div>
          </div>

          {/* Teaching & Memberships */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lehr- &amp; Vortragstätigkeit</h3>
              <ul className="space-y-3">
                {[
                  'Handchirurgie-Vorlesung im Rahmen des Studienganges Ergotherapie an der FH Kärnten',
                  'Vortragstätigkeit im Rahmen der OP-Ausbildung für Instrumentare im BIZ der KABEG',
                  'Regelmäßige Vorträge bei Kongressen',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-gray-600 text-sm">
                    <span className="text-accent flex-shrink-0 mt-0.5">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mitgliedschaften</h3>
              <ul className="space-y-3">
                {memberships.map(item => (
                  <li key={item.label} className="flex items-start gap-3 text-gray-600 text-sm">
                    <span className="text-primary flex-shrink-0 mt-0.5">◆</span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Extra sections added via CMS */}
          {extraSections.length > 0 && (
            <div className="mt-12 space-y-8">
              {extraSections.map((section, idx) => {
                if (section.discriminant === 'paragraph') {
                  return (
                    <div key={idx}>
                      {section.value.heading && (
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{section.value.heading}</h3>
                      )}
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.value.text}</p>
                    </div>
                  )
                }
                if (section.discriminant === 'imageBlock') {
                  const src = section.value.image
                  return (
                    <figure key={idx} className="rounded-2xl overflow-hidden shadow-sm">
                      {src && (
                        <div className="relative w-full h-72">
                          <Image
                            src={src.startsWith('/') ? src : `/images/${src}`}
                            alt={section.value.caption ?? ''}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      {section.value.caption && (
                        <figcaption className="px-4 py-2 text-sm text-gray-500 bg-gray-50">{section.value.caption}</figcaption>
                      )}
                    </figure>
                  )
                }
                if (section.discriminant === 'highlight') {
                  return (
                    <div key={idx} className="bg-blue-50 border-l-4 border-primary rounded-xl p-5">
                      <p className="text-gray-700 whitespace-pre-line">{section.value.text}</p>
                    </div>
                  )
                }
                return null
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
