import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export async function getStaticProps(){
  const dir = path.join(process.cwd(),'draft')
  const file = path.join(dir,'home.md')
  const raw = fs.readFileSync(file,'utf8')
  const { content } = matter(raw)
  const contentHtml = marked(content)
  return { props: { contentHtml } }
}

export default function Home({ contentHtml }){
  return (
    <main className="max-w-3xl mx-auto p-6">
      <article dangerouslySetInnerHTML={{ __html: contentHtml }} className="prose" />
    </main>
  )
}
