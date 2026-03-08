export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, phone, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Pflichtfelder fehlen' })
  }

  // Log the submission
  console.log('Kontaktformular:', { name, email, phone, message, timestamp: new Date().toISOString() })

  // Optional: webhook
  if (process.env.CONTACT_WEBHOOK) {
    fetch(process.env.CONTACT_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message }),
    }).catch(err => console.error('Webhook error:', err))
  }

  return res.status(200).json({ ok: true })
}
