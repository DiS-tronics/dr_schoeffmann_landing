import Head from 'next/head'
import Image from 'next/image'

export default function About() {
  return (
    <>
      <Head>
        <title>Über mich – Dr. Thomas Schöffmann</title>
        <meta name="description" content="Facharzt für Orthopädie und Traumatologie. Spezialisierung in Wirbelsäulenchirurgie und Hüftendoprothetik." />
      </Head>

      <div className="bg-hero-beige py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Über mich</h1>
          <p className="text-gray-700 text-lg">Dr. Thomas Schöffmann</p>
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

              <div className="prose-content">
                <p className="text-gray-700">Geboren in St. Veit an der Glan, verheiratet, 1 Kind.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ausbildung</h3>
                <div className="space-y-2">
                  {[
                    ['Gymnasium Tanzenberg', ''],
                    ['Matura HTL für Elektrotechnik, Klagenfurt', ''],
                    ['Studium der Humanmedizin', 'Paracelsus Medizinische Privatuniversität Salzburg'],
                    ['Promotion Dr.med.univ.', 'September 2014'],
                  ].map(([title, sub]) => (
                    <div key={title} className="flex items-start gap-3">
                      <span className="text-accent mt-1 flex-shrink-0">▸</span>
                      <div>
                        <span className="text-gray-800 font-medium">{title}</span>
                        {sub && <span className="text-gray-500 text-sm block">{sub}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Beruflicher Werdegang</h3>
                <div className="space-y-2">
                  {[
                    ['2014–2016', 'Turnusarzt im KH der Barmherzigen Brüder St. Veit und UKH Klagenfurt'],
                    ['2016–2021', 'Facharztausbildung im UKH Klagenfurt und EKH Klagenfurt'],
                    ['Seit Dez. 2021', 'Facharzt für Orthopädie und Traumatologie im UKH Klagenfurt'],
                    ['Seit Juni 2025', 'Oberarzt im UKH Klagenfurt am Wörthersee'],
                  ].map(([year, desc]) => (
                    <div key={year} className="flex gap-4">
                      <span className="text-primary font-semibold text-sm w-28 flex-shrink-0 pt-0.5">{year}</span>
                      <span className="text-gray-700">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-primary mb-2">Klinische Schwerpunkte</h3>
                <p className="text-gray-700">Konservative und operative Wirbelsäulenchirurgie sowie Hüftendoprothetik</p>
              </div>
            </div>
          </div>

          {/* Teaching */}
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
                {[
                  'Österreichische Gesellschaft für Unfallchirurgie (ÖGU)',
                  'Österreichische Gesellschaft für Wirbelsäulenchirurgie (ÖGWC)',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-gray-600 text-sm">
                    <span className="text-primary flex-shrink-0 mt-0.5">◆</span>
                    {item}
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
