import { marked } from 'marked'
export function renderMarkdownToHtml(raw){
  const html = marked(raw)
  return html.replace(/<img src="(?!https?:|\/)([^"]+)"/g, (m, p1) => `<img src="/images/${p1}"`)
}
