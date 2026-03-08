import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const services = [
  'Befundbesprechung und Diagnosenaufklärung',
  'Therapievorschläge',
  'Zweitmeinungen',
  'Operationsaufklärungen',
  'Weiter- bzw. Nachbehandlung nach operativen Eingriffen',
  'Schmerztherapie (nichtinvasiv und invasiv)',
  'Verordnung von Heilbehelfen (Mieder, Orthesen etc.)',
  'Verordnung von speziellen Heilmaßnahmen (Physiotherapie)',
  'Infiltrationen an Wirbelsäule und Gelenken',
  'Periradikuläre, epidural sacrale Schmerztherapie (Blockaden)',
]

const operative = [
  { img: '/images/service1.jpeg', title: 'Bruch des 1. Lendenwirbels', desc: 'Bruch des 1. Lendenwirbels mit Fehlstellung' },
  { img: '/images/service2.jpeg', title: 'Stabilisierungsoperation', desc: 'Aufrichtung des Wirbelkörpers und Stabilisierungsoperation minimalinvasiv' },
  { img: '/images/service3.jpeg', title: 'Degeneratives Wirbelgleiten', desc: 'Degeneratives Wirbelgleiten L4/5 – operative Dekompression und Einbau eines Bandscheibencages mit Fusion' },
  { img: '/images/service4.jpeg', title: 'Verrenkungsbruch HWS', desc: 'Verrenkungsbruch zwischen 3. und 4. Halswirbel mit Stabilisierung von vorne mit Platte' },
  { img: '/images/service5.jpeg', title: 'OP-Planung Hüfte', desc: 'Planung vor der Operation anhand des Röntgenbildes (deutliche Abnützung beider Hüften)' },
  { img: '/images/service6.jpeg', title: 'Totalendoprothese Hüfte', desc: 'Totalendoprothese des Hüftgelenkes (Pfanne und Kopf ersetzt)' },
]

export default function Services() {
  return (
    <>
      <Head>
        <title>Leistungen – Ordination Dr. Thomas Schöffmann</title>
        <meta name="description" content="Leistungsangebot: Befundbesprechung, Schmerztherapie, Wirbelsäulenchirurgie, Hüftendoprothetik und mehr." />
      </Head>

      {/* Header */}
      <div className="bg-primary py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-3">Leistungen</h1>
          <p className="text-blue-100 text-lg">Therapraxis Liebenfels – alles aus einer Hand</p>
        </div>
      </div>

      {/* Intro */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-blue-50 rounded-2xl p-8 mb-10">
            <p className="text-gray-700 text-lg leading-relaxed">
              In der Therapraxis Liebenfels bekommen Sie alles aus einer Hand. Hier befinden sich Experten für den gesamten Stütz- und Bewegungsapparat.
              Neben <strong>Dr. Philipp Tomantschger</strong> (Spezialisierung in Handchirurgie) und <strong>Dr. Thomas Schöffmann</strong> (Spezialisierung
              in Wirbelsäulenchirurgie und Hüftendoprothetik) stehen auch ein Physiotherapeut und eine Heilmasseurin zur Verfügung.
            </p>
          </div>

          {/* Service list */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Leistungen Ordination Dr. Schöffmann</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14">
            {services.map((s) => (
              <div key={s} className="flex items-start gap-3 bg-gray-50 rounded-xl px-5 py-4">
                <span className="text-accent text-xl flex-shrink-0">✓</span>
                <span className="text-gray-700">{s}</span>
              </div>
            ))}
          </div>

          {/* Operative */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Operative Leistungen</h2>
          <p className="text-gray-500 mb-8">Alle notwendigen Operationen und CT-gezielten Nervenwurzelblockaden werden im UKH Klagenfurt am Wörthersee persönlich durchgeführt.</p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-primary mb-4">Wirbelsäulenchirurgie</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {operative.slice(0, 4).map((op) => (
                <div key={op.title} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <Image src={op.img} alt={op.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{op.title}</h4>
                    <p className="text-gray-600 text-sm">{op.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-semibold text-primary mb-4">Künstlicher Hüftgelenksersatz (AMIS-Technik)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {operative.slice(4).map((op) => (
                <div key={op.title} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <Image src={op.img} alt={op.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{op.title}</h4>
                    <p className="text-gray-600 text-sm">{op.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Weitere operative Leistungen</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2"><span className="text-accent">•</span> Kniearthroskopie bei Meniskusschädigung</li>
                <li className="flex items-center gap-2"><span className="text-accent">•</span> Sämtliche akute unfallchirurgische Verletzungen (Knochenbrüche, Sehnenrisse, etc.)</li>
                <li className="flex items-center gap-2"><span className="text-accent">•</span> Metallentfernungen nach knöcherner Heilung</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Termin vereinbaren</h2>
          <p className="text-blue-100 mb-6">Für alle Leistungen ausschließlich nach vorheriger Terminvereinbarung</p>
          <Link href="/contact" className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
            Jetzt Termin anfragen →
          </Link>
        </div>
      </section>
    </>
  )
}
