import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const benefits = [
  {
    img: '/images/benefits1.png',
    title: 'Beste Versorgung',
    desc: 'Ausreichend Zeit für Ihre Anliegen — wir nehmen uns Zeit für Sie.',
  },
  {
    img: '/images/benefits2.png',
    title: 'Schmerztherapie vor Ort',
    desc: 'Infiltration und Blockaden direkt in der Ordination.',
  },
  {
    img: '/images/benefits3.png',
    title: 'Ausführliche Aufklärung',
    desc: 'Verständliche Erklärung von Diagnose und allen Therapiemöglichkeiten.',
  },
]

export default function Home() {
  return (
    <>
      <Head>
        <title>Ordination Dr. Thomas Schöffmann – Facharzt für Orthopädie &amp; Traumatologie</title>
        <meta name="description" content="Facharzt für Orthopädie und Traumatologie in Liebenfels. Wirbelsäulenchirurgie, Hüftendoprothetik, Schmerztherapie." />
        <link rel="icon" href="/icon.png" />
      </Head>

      {/* Hero */}
      <div className="bg-hero-beige py-12 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-10">
          <div className="flex-shrink-0 flex justify-center">
            <Image
              src="/images/thomas.png"
              alt="Dr. Thomas Schöffmann"
              width={300}
              height={400}
              className="object-cover rounded-xl shadow-xl"
            />
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-gray-900 text-4xl md:text-4xl font-bold leading-tight mb-6">
              Herzlich Willkommen in der<br className="hidden md:block" /> Ordination Dr. Schöffmann!
            </h1>
            <p className="text-gray-700 text-xl mb-10">
              Facharzt für Orthopädie und Traumatologie – Liebenfels
            </p>
            <Link
              href="/about"
              className="inline-block bg-footer-brown text-hero-beige font-bold px-10 py-4 rounded-xl hover:bg-gray-700 transition-colors text-lg shadow-lg"
            >
              Weiterlesen
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Unsere Vorteile für Sie</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Als Facharzt für Orthopädie und Traumatologie decke ich das Spektrum der degenerativen Erkrankungen
            des Bewegungsapparates sowie das akute Spektrum der Unfallchirurgie ab.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-20 h-20 relative mb-4">
                  <Image src={b.img} alt={b.title} fill className="object-contain" sizes="80px" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-banner-gray">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Machen Sie noch heute einen Termin</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Haben Sie akute Schmerzen? Wir werden versuchen, Sie umgehend zu behandeln. Kurzfristige Termine sind möglich!
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-banner-gray font-bold px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors text-lg shadow-lg"
          >
            Jetzt Termin vereinbaren
          </Link>
        </div>
      </section>
    </>
  )
}
