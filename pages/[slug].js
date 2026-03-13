import Head from 'next/head'
import { createReader } from '@keystatic/core/reader'
import { DocumentRenderer } from '@keystatic/core/renderer'
import keystaticConfig from '../keystatic.config'

export async function getStaticPaths() {
  const reader = createReader(process.cwd(), keystaticConfig)
  const slugs = await reader.collections.pages.list()
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const reader = createReader(process.cwd(), keystaticConfig)
  const page = await reader.collections.pages.read(params.slug)
  if (!page) return { notFound: true }

  const rawContent = await page.content()
  const content = JSON.parse(JSON.stringify(rawContent))
  return {
    props: {
      title: page.title,
      content,
    },
  }
}

export default function DynamicPage({ title, content }) {
  return (
    <>
      <Head>
        <title>{title} – Ordination Dr. Thomas Schöffmann</title>
      </Head>

      <div className="bg-hero-beige py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-footer-brown mb-3">{title}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
        <DocumentRenderer document={content} />
      </div>
    </>
  )
}
