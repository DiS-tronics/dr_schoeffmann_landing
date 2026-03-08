import '../styles/globals.css'
import Nav from '../components/Nav'
import Meta from '../components/Meta'
export default function App({ Component, pageProps }) {
  return (
    <>
      <Meta />
      <Nav />
      <main className="min-h-screen">
        <Component {...pageProps} />
      </main>
      <footer className="text-center py-8 text-sm text-gray-500">© {new Date().getFullYear()} Dr. Schöffmann</footer>
    </>
  )
}
