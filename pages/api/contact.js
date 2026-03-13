// Simple in-memory rate limit: 5 submissions per IP per 10 minutes
const rateLimitMap = new Map()
const RATE_LIMIT = 5
const WINDOW_MS = 10 * 60 * 1000

function isRateLimited(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip) ?? { count: 0, windowStart: now }
  if (now - entry.windowStart > WINDOW_MS) {
    entry.count = 0
    entry.windowStart = now
  }
  entry.count++
  rateLimitMap.set(ip, entry)
  return entry.count > RATE_LIMIT
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ?? req.socket.remoteAddress ?? 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Zu viele Anfragen. Bitte versuchen Sie es später.' })
  }

  // Server-side input validation
  const { name, email, phone, message } = req.body ?? {}

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    return res.status(400).json({ error: 'Bitte geben Sie Ihren Namen an (2–100 Zeichen).' })
  }
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 200) {
    return res.status(400).json({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse an.' })
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
    return res.status(400).json({ error: 'Ihre Nachricht muss zwischen 10 und 2000 Zeichen lang sein.' })
  }
  if (phone && (typeof phone !== 'string' || phone.length > 30)) {
    return res.status(400).json({ error: 'Ungültige Telefonnummer.' })
  }

  // No PII in logs — log only that a submission was received
  console.log('[contact] form submission received', { timestamp: new Date().toISOString() })

  // Webhook (operator-configured HTTPS endpoint only — prevents SSRF via HTTP redirection)
  const webhookUrl = process.env.CONTACT_WEBHOOK
  if (webhookUrl) {
    if (!webhookUrl.startsWith('https://')) {
      console.error('[contact] CONTACT_WEBHOOK must use HTTPS — skipping')
    } else {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email,
          phone: phone ? phone.trim() : undefined,
          message: message.trim(),
        }),
      }).catch(err => console.error('[contact] Webhook delivery failed:', err.message))
    }
  }

  return res.status(200).json({ ok: true })
}
