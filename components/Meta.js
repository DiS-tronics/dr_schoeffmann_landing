import Head from 'next/head'
export default function Meta({title, description, image, url}){
  const siteTitle = title ? `${title} — Dr. Schöffmann` : 'Dr. Schöffmann'
  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={description || 'Ordination für Allgemeinmedizin'} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description || 'Ordination für Allgemeinmedizin'} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
