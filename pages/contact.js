import Head from 'next/head'
import ContactForm from '../components/ContactForm'
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'

export async function getStaticProps() {
  const reader = createReader(process.cwd(), keystaticConfig)
  const contact = await reader.singletons.contact.read()
  return { props: { contact: contact ?? null } }
}

export default function Contact({ contact }) {
  const address = contact?.address ?? 'Feldkirchnerstr. 2\n9556 Liebenfels, Österreich'
  const phone = contact?.phone ?? '+43 676 48 396 48'
  const email = contact?.email ?? 'ordination@dr-schoeffmann.at'
  const hours = contact?.hours ?? 'Ausschließlich nach vorheriger Terminvereinbarung'
  const arrivalInfo = contact?.arrivalInfo ?? ''

  return (
    <>
      <Head>
        <title>Kontakt &amp; Anfahrt – Ordination Dr. Thomas Schöffmann</title>
        <meta name="description" content={`Kontaktieren Sie uns für eine Terminvereinbarung. Ordination in Liebenfels, Tel.: ${phone}.`} />
      </Head>

      <div className="bg-hero-beige py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-footer-brown mb-3">Kontakt &amp; Anfahrt</h1>
          <p className="text-footer-brown text-lg">Wir freuen uns auf Ihre Nachricht</p>
        </div>
      </div>

      {/* Contact split */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Kontaktdaten</h2>
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-primary text-lg">📍</div>
                  <div>
                    <div className="font-semibold text-gray-900">Adresse</div>
                    <div className="text-gray-600 whitespace-pre-line">{address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-primary text-lg">📞</div>
                  <div>
                    <div className="font-semibold text-gray-900">Telefon</div>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-primary hover:text-accent">{phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-primary text-lg">✉️</div>
                  <div>
                    <div className="font-semibold text-gray-900">E-Mail</div>
                    <a href={`mailto:${email}`} className="text-primary hover:text-accent">{email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-primary text-lg">🕐</div>
                  <div>
                    <div className="font-semibold text-gray-900">Ordinationszeiten</div>
                    <div className="text-gray-600">{hours}</div>
                  </div>
                </div>
              </div>

              {arrivalInfo && (
                <div className="bg-blue-50 rounded-xl p-5 text-sm text-gray-600 mb-8">
                  <strong className="text-gray-800 block mb-1">Anfahrt</strong>
                  {arrivalInfo}
                </div>
              )}

              {/* Map */}
              <div className="rounded-2xl overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2734.3475924916957!2d14.2839469407867!3d46.73832814765176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47706e709e1c1edb%3A0xe2d39fb3b4b847b7!2sFeldkirchner%20Str.%202%2C%209556%20Liebenfels!5e0!3m2!1sde!2sat!4v1772911334638!5m2!1sde!2sat"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Terminanfrage</h2>
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impressum */}
      <section id="impressum" className="py-12 bg-gray-50 border-t border-gray-200 scroll-mt-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Impressum</h2>
          <div className="text-gray-600 text-sm space-y-2 prose-content">
            <p>Information gemäß § 5 E-Commerce-Gesetz und Offenlegung gemäß § 25 Mediengesetz:</p>
            <p><strong>Diensteanbieter und Medieninhaber:</strong><br />
            Dr. Thomas Schöffmann<br />
            Feldkrichnerstr. 2, 9556 Liebenfels<br />
            Tel.: +43 676 4839648<br />
            E-Mail: ordination@dr-schoeffmann.at<br />
            Homepage: www.dr-schoeffmann.at</p>
            <p>Mitglied der Ärztekammer für Kärnten<br />
            Berufsbezeichnung: Facharzt für Orthopädie und Traumatologie (verliehen in Österreich)<br />
            Tätigkeit unterliegt dem Ärztegesetz 1998 (<a href="http://www.ris.bka.gv.at/bundesrecht" className="text-primary hover:text-accent" target="_blank" rel="noreferrer">www.ris.bka.gv.at</a>)</p>
          </div>
        </div>
      </section>
    </>
  )
}
