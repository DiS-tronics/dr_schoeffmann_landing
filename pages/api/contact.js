export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { name, email, message } = req.body || {}
  if (!name || !message || (!email && !process.env.CONTACT_EMAIL)) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // simple validation
  const emailValid = email ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) : true
  if (email && !emailValid) return res.status(400).json({ error: 'Invalid email' })

  // Try to send via configured SMTP webhook or fallback to mailto
  const contactEmail = process.env.CONTACT_EMAIL
  if (contactEmail) {
    // If a third‑party service webhook is configured, forward the payload
    try {
      // Example: webhook URL in CONTACT_WEBHOOK
      if (process.env.CONTACT_WEBHOOK) {
        await fetch(process.env.CONTACT_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        })
        return res.status(200).json({ ok: true })
      }
      // Otherwise: simple mailto fallback server‑side (not sending email)
      return res.status(200).json({ ok: true, note: 'CONTACT_EMAIL set but no webhook; please configure CONTACT_WEBHOOK to send emails.' })
    } catch (err) {
      console.error('contact webhook error', err)
      return res.status(502).json({ error: 'Failed to forward message' })
    }
  }

  // No CONTACT_EMAIL configured: instruct client to use mailto fallback
  return res.status(200).json({ ok: true, mailto: `mailto:?subject=${encodeURIComponent('Kontakt über Website von ' + (name||'Anfragender'))}&body=${encodeURIComponent(message + '\n\n' + (email?('Antwort an: '+email):''))}` })
}
