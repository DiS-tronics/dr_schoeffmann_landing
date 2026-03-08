import '../styles/globals.css'
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/icon.png" />
      </Head>
      <Nav />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}
