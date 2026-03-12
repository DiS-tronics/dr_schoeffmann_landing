import '../styles/globals.css'
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

function DefaultLayout({ children }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/icon.png" />
      </Head>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App({ Component, pageProps }) {
  // Pages can opt out of the default layout by defining getLayout.
  // e.g. KeystaticPage.getLayout = (page) => page
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>)
  return getLayout(<Component {...pageProps} />)
}
