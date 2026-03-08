import Image from 'next/image'
export default function Hero(){
  return (
    <section className="bg-white pt-8 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Herzlich Willkommen in der Ordination Dr. Schöffmann</h1>
            <p className="mt-3 text-muted-ink">Facharzt für Orthopädie & Traumatologie — persönliche, moderne Betreuung.</p>
            <div className="mt-6">
              <a href="/contact" className="btn btn-primary">Termin vereinbaren</a>
            </div>
          </div>
          <div className="w-full h-48 md:h-64 relative">
            <Image src="/images/home.jpg" alt="Hero" layout="fill" objectFit="cover" className="rounded-md"/>
          </div>
        </div>
      </div>
    </section>
  )
}
