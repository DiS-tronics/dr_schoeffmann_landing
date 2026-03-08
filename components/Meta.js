import Head from 'next/head'
export default function Meta({title, description, image, url}){
  const siteTitle = title ? `${title} — Dr. Schöffmann` : 'Dr. Schöffmann'
  // fallback: explicitly include generated CSS if Next does not inject it on deploy
  const cssHref = '/_next/static/css/d5787dc79e93ab17.css'
  const staticCss = '/css/main.css'
  return (
    <Head>
      <title>{siteTitle}</title>
      <link rel="stylesheet" href={cssHref} />
      <link rel="stylesheet" href={staticCss} />
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
