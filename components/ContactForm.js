import { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name ist erforderlich'
    if (!form.email.trim()) e.email = 'E-Mail ist erforderlich'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ungültige E-Mail-Adresse'
    if (!form.message.trim()) e.message = 'Nachricht ist erforderlich'
    return e
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Vielen Dank!</h3>
        <p className="text-green-700">Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns so bald wie möglich bei Ihnen.</p>
      </div>
    )
  }

  const inputClass = (field) =>
    `w-full border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input name="name" value={form.name} onChange={handleChange} className={inputClass('name')} placeholder="Ihr vollständiger Name" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail *</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass('email')} placeholder="ihre@email.at" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon <span className="text-gray-400">(optional)</span></label>
        <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass('phone')} placeholder="+43 ..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nachricht *</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows={5} className={inputClass('message')} placeholder="Bitte beschreiben Sie Ihr Anliegen..." />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>
      {status === 'error' && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
          Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-btn-warm text-hero-beige font-semibold py-3 rounded-lg hover:bg-footer-brown transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-lg"
      >
        {status === 'loading' ? 'Wird gesendet...' : 'Nachricht senden'}
      </button>
      <p className="text-xs text-gray-400 text-center">* Pflichtfelder</p>
    </form>
  )
}
