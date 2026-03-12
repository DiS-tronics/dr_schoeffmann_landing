import Head from 'next/head'
import Image from 'next/image'
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'

export async function getStaticProps() {
  const reader = createReader(process.cwd(), keystaticConfig)
  const about = await reader.singletons.about.read()
  return { props: { about: about ?? null } }
}

export default function About({ about }) {
  const pageTitle = about?.pageTitle ?? 'Über mich'
  const pageSubtitle = about?.pageSubtitle ?? 'Dr. Thomas Schöffmann'
  const bioText = about?.bioText ?? ''
  const education = about?.education ?? []
  const career = about?.career ?? []
  const memberships = about?.memberships ?? []

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

              {bioText && (
                <div className="prose-content">
                  <p className="text-gray-700">{bioText}</p>
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
        </div>
      </section>
    </>
  )
}
