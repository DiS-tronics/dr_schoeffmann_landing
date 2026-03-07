import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

export async function getStaticProps(){
  const dir = path.join(process.cwd(),'draft')
  const file = path.join(dir,'home.md')
  const raw = fs.readFileSync(file,'utf8')
  const { content } = matter(raw)
  const processed = await remark().use(html).process(content)
  const contentHtml = processed.toString()
  return { props: { contentHtml } }
}

export default function Home({ contentHtml }){
  return (
    <main className="max-w-3xl mx-auto p-6">
      <article dangerouslySetInnerHTML={{ __html: contentHtml }} className="prose" />
    </main>
  )
}
