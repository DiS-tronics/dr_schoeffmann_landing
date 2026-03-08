import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'

const images = [
  { src: '/images/ordination1.jpg', alt: 'Ordination Ansicht 1' },
  { src: '/images/ordination2.jpg', alt: 'Ordination Ansicht 2' },
  { src: '/images/ordination3.jpg', alt: 'Ordination Ansicht 3' },
  { src: '/images/ordination4.jpg', alt: 'Ordination Ansicht 4' },
  { src: '/images/ordination5.jpg', alt: 'Ordination Ansicht 5' },
]

export default function Ordination() {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <Head>
        <title>Ordination – Dr. Thomas Schöffmann</title>
        <meta name="description" content="Einblicke in die Ordination Dr. Schöffmann in Liebenfels." />
      </Head>

      <div className="bg-primary py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-3">Ordination</h1>
          <p className="text-blue-100 text-lg">Eindrücke aus der Therapraxis Liebenfels</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-gray-600 text-lg mb-10 text-center max-w-2xl mx-auto">
            Hier einige Eindrücke von der Therapraxis. Wir freuen uns, Sie schon bald in unserer Ordination begrüßen zu dürfen!
          </p>

          {/* Gallery grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <button
                key={img.src}
                onClick={() => setSelected(i)}
                className="relative aspect-video rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] aspect-video" onClick={e => e.stopPropagation()}>
            <Image
              src={images[selected].src}
              alt={images[selected].alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            onClick={() => setSelected(null)}
          >
            ✕
          </button>
          {selected > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300"
              onClick={e => { e.stopPropagation(); setSelected(s => s - 1) }}
            >‹</button>
          )}
          {selected < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300"
              onClick={e => { e.stopPropagation(); setSelected(s => s + 1) }}
            >›</button>
          )}
        </div>
      )}
    </>
  )
}
