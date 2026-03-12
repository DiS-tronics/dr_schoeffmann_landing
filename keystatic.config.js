import { config, singleton, fields } from '@keystatic/core'

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
        benefits: fields.array(
          fields.object({
            img: fields.text({ label: 'Bild-Pfad (z.B. /images/benefits1.png)' }),
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
      path: 'content/about',
      format: { data: 'yaml' },
      schema: {
        pageTitle: fields.text({ label: 'Seitentitel' }),
        pageSubtitle: fields.text({ label: 'Untertitel' }),
        bioText: fields.text({ label: 'Kurzbiografie', multiline: true }),
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
            img: fields.text({ label: 'Bild-Pfad' }),
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
            src: fields.text({ label: 'Bild-Pfad' }),
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
