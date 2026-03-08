import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import { renderMarkdownToHtml } from '../lib/markdown'

export async function getStaticProps(){
  const dir = path.join(process.cwd(),'draft')
  const file = path.join(dir,'home.md')
  const raw = fs.readFileSync(file,'utf8')
  const { content } = matter(raw)
  const contentHtml = renderMarkdownToHtml(content)
  return { props: { contentHtml } }
}

import Hero from '../components/Hero'

export default function Home({ contentHtml }){
  return (
    <>
      <Hero />
      <main className="max-w-3xl mx-auto p-6">
        <article dangerouslySetInnerHTML={{ __html: contentHtml }} className="prose" />
      </main>
    </>
  )
}
