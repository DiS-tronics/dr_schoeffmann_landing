import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import Nav from '../components/Nav'

export async function getStaticProps(){
  const dir = path.join(process.cwd(),'draft')
  const file = path.join(dir,'services.md')
  const raw = fs.readFileSync(file,'utf8')
  const { content } = matter(raw)
  const processed = await remark().use(html).process(content)
  const contentHtml = processed.toString()
  return { props: { contentHtml } }
}

export default function Services({ contentHtml }){
  return (
    <div>
      <Nav />
      <main className="max-w-3xl mx-auto p-6">
        <article dangerouslySetInnerHTML={{ __html: contentHtml }} className="prose" />
      </main>
    </div>
  )
}
