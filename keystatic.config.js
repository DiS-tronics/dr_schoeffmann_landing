import { config, singleton, fields } from '@keystatic/core'

// Reusable image field factory — images live in public/images/
const imgField = (label) => fields.image({
  label,
  directory: 'public/images',
  publicPath: '/images/',
})

// Reusable extra-sections array (paragraph / image+caption / highlight).
// NOTE: fields.blocks() crashes Keystatic's internal schema traversal in v0.5.x,
// so we use fields.array(fields.object()) with an explicit `type` select instead.
const extraSectionsField = fields.array(
  fields.object({
    type: fields.select({
      label: 'Art der Sektion',
      options: [
        { label: 'Textabschnitt', value: 'paragraph' },
        { label: 'Bild mit Beschriftung', value: 'imageBlock' },
        { label: 'Hinweisbox', value: 'highlight' },
      ],
      defaultValue: 'paragraph',
    }),
    // Paragraph / highlight fields
    heading: fields.text({ label: 'Überschrift (bei Textabschnitt, optional)' }),
    text: fields.text({ label: 'Text (bei Textabschnitt und Hinweisbox)', multiline: true }),
    // Image block fields
    image: imgField('Bild (bei Bildsektion)'),
    caption: fields.text({ label: 'Beschriftung (bei Bildsektion, optional)' }),
  }),
  {
    label: 'Zusätzliche Sektionen',
    itemLabel: (props) => props.fields.heading.value || props.fields.type.value,
  }
)

// In production, log loudly if GitHub repo env vars are missing (prevents silent misconfiguration).
// Uses console.error rather than throw so static builds don't fail when vars are absent locally.
if (process.env.NODE_ENV === 'production') {
  if (!process.env.GITHUB_REPO_OWNER) console.error('[keystatic] GITHUB_REPO_OWNER is not set — CMS writes will target wrong repo. Set this in Vercel env vars.')
  if (!process.env.GITHUB_REPO_NAME) console.error('[keystatic] GITHUB_REPO_NAME is not set — CMS writes will target wrong repo. Set this in Vercel env vars.')
}

export default config({
  storage: {
    kind: process.env.NODE_ENV === 'production' ? 'github' : 'local',
    repo: {
      owner: process.env.GITHUB_REPO_OWNER || 'owner',
      name: process.env.GITHUB_REPO_NAME || 'dr_schoeffmann_cms',
    },
  },

  singletons: {
    home: singleton({
      label: 'Startseite',
      path: 'content/home',
      format: { data: 'yaml' },
      schema: {
        heroTitle: fields.text({ label: 'Hero Titel' }),
        heroSubtitle: fields.text({ label: 'Hero Untertitel' }),
        heroPortrait: imgField('Hero Porträtfoto'),
        benefits: fields.array(
          fields.object({
            img: imgField('Vorteil Bild'),
            title: fields.text({ label: 'Titel' }),
            desc: fields.text({ label: 'Beschreibung', multiline: true }),
          }),
          { label: 'Vorteile', itemLabel: (props) => props.fields.title.value }
        ),
        ctaTitle: fields.text({ label: 'CTA Titel' }),
        ctaSubtitle: fields.text({ label: 'CTA Untertitel', multiline: true }),
      },
    }),

    about: singleton({
      label: 'Über mich',
      // contentField format: YAML front-matter + mdoc body for bioContent
      path: 'content/about',
      format: { contentField: 'bioContent' },
      schema: {
        pageTitle: fields.text({ label: 'Seitentitel' }),
        pageSubtitle: fields.text({ label: 'Untertitel' }),
        portrait: imgField('Porträtfoto'),
        bioContent: fields.document({
          label: 'Biografie',
          formatting: {
            inlineMarks: { bold: true, italic: true, underline: true },
            listTypes: { ordered: true, unordered: true },
            headingLevels: [2, 3],
            blockTypes: { blockquote: true },
            softBreaks: true,
          },
          links: true,
        }),
        education: fields.array(
          fields.object({
            institution: fields.text({ label: 'Institution / Titel' }),
            detail: fields.text({ label: 'Detail (optional)' }),
          }),
          { label: 'Ausbildung', itemLabel: (props) => props.fields.institution.value }
        ),
        career: fields.array(
          fields.object({
            years: fields.text({ label: 'Zeitraum' }),
            description: fields.text({ label: 'Beschreibung', multiline: true }),
          }),
          { label: 'Beruflicher Werdegang', itemLabel: (props) => props.fields.years.value }
        ),
        specializations: fields.array(
          fields.object({
            label: fields.text({ label: 'Spezialisierung' }),
          }),
          { label: 'Spezialisierungen', itemLabel: (props) => props.fields.label.value }
        ),
        memberships: fields.array(
          fields.object({
            label: fields.text({ label: 'Mitgliedschaft' }),
          }),
          { label: 'Mitgliedschaften', itemLabel: (props) => props.fields.label.value }
        ),
        extraSections: extraSectionsField,
      },
    }),

    services: singleton({
      label: 'Leistungen',
      path: 'content/services',
      format: { data: 'yaml' },
      schema: {
        introText: fields.text({ label: 'Einleitungstext', multiline: true }),
        services: fields.array(
          fields.object({
            label: fields.text({ label: 'Leistung' }),
          }),
          { label: 'Leistungen', itemLabel: (props) => props.fields.label.value }
        ),
        operativeProcedures: fields.array(
          fields.object({
            img: imgField('Bild'),
            title: fields.text({ label: 'Eingriff Titel' }),
            desc: fields.text({ label: 'Beschreibung', multiline: true }),
            category: fields.select({
              label: 'Kategorie',
              options: [
                { label: 'Wirbelsäulenchirurgie', value: 'spine' },
                { label: 'Hüftendoprothetik', value: 'hip' },
                { label: 'Sonstige', value: 'other' },
              ],
              defaultValue: 'spine',
            }),
          }),
          { label: 'Operative Leistungen', itemLabel: (props) => props.fields.title.value }
        ),
        additionalProcedures: fields.array(
          fields.object({
            label: fields.text({ label: 'Eingriff' }),
          }),
          { label: 'Weitere operative Leistungen', itemLabel: (props) => props.fields.label.value }
        ),
        operativeNote: fields.text({ label: 'Hinweis operative Leistungen', multiline: true }),
        extraSections: extraSectionsField,
      },
    }),

    ordination: singleton({
      label: 'Ordination',
      path: 'content/ordination',
      format: { data: 'yaml' },
      schema: {
        pageTitle: fields.text({ label: 'Seitentitel' }),
        pageSubtitle: fields.text({ label: 'Untertitel' }),
        introText: fields.text({ label: 'Einleitungstext', multiline: true }),
        images: fields.array(
          fields.object({
            src: imgField('Bild'),
            alt: fields.text({ label: 'Alt-Text' }),
          }),
          { label: 'Bilder', itemLabel: (props) => props.fields.alt.value }
        ),
      },
    }),

    contact: singleton({
      label: 'Kontakt',
      path: 'content/contact',
      format: { data: 'yaml' },
      schema: {
        address: fields.text({ label: 'Adresse', multiline: true }),
        phone: fields.text({ label: 'Telefon' }),
        email: fields.text({ label: 'E-Mail' }),
        hours: fields.text({ label: 'Ordinationszeiten' }),
        arrivalInfo: fields.text({ label: 'Anfahrt Information', multiline: true }),
        mapEmbedUrl: fields.url({ label: 'Google Maps Embed URL (optional)' }),
      },
    }),
  },
})
