import { useState } from 'react'
import { contact, isPlaceholder } from '../data/resume'
import { DoodleStar } from './SvgDefs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FIELD =
  'paper w-full border-2 border-dashed border-ink/40 px-4 py-3 text-base text-ink transition-colors placeholder:text-ink/35 focus:border-coral focus:ring-2 focus:ring-coral/25 focus:outline-none'

const EMPTY = { name: '', email: '', message: '', botcheck: '' }

function validate({ name, email, message }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Please add your name.'
  if (!email.trim()) errors.email = 'Please add your email.'
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'That email doesn’t look right.'
  if (!message.trim()) errors.message = 'Please write a message.'
  else if (message.trim().length < 10) errors.message = 'A little more detail, please (10+ characters).'
  return errors
}

/**
 * Static-friendly contact form.
 *
 * When `contact.formEndpoint` is configured it POSTs JSON to that endpoint
 * (Formspree or Web3Forms compatible). Until then it falls back to a prefilled
 * `mailto:` so the section works out of the box with zero signup.
 */
export default function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [notice, setNotice] = useState('')

  const configured = !isPlaceholder(contact.formEndpoint)
  const accessKey = typeof contact.formAccessKey === 'string' ? contact.formAccessKey.trim() : ''

  const update = (field) => (event) => {
    const { value } = event.target
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  const mailtoHref = () => {
    const subject = encodeURIComponent(`Portfolio message from ${values.name.trim() || 'someone'}`)
    const body = encodeURIComponent(`${values.message.trim()}\n\n— ${values.name.trim()}\n${values.email.trim()}`)
    return `mailto:${contact.email}?subject=${subject}&body=${body}`
  }

  async function handleSubmit(event) {
    event.preventDefault()

    // honeypot — pretend success so bots don't learn anything
    if (values.botcheck) {
      setStatus('sent')
      return
    }

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setStatus('idle')
      return
    }

    if (!configured) {
      window.location.href = mailtoHref()
      setStatus('sent')
      setNotice('Your mail app should open with the message ready to send.')
      return
    }

    setStatus('sending')
    setNotice('')

    try {
      const response = await fetch(contact.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          subject: `Portfolio message from ${values.name.trim()}`,
          ...(accessKey ? { access_key: accessKey } : {}),
        }),
      })
      if (!response.ok) throw new Error(`Request failed (${response.status})`)
      setValues(EMPTY)
      setStatus('sent')
    } catch (error) {
      setStatus('error')
      setNotice(error.message || 'Something went wrong — please try email instead.')
    }
  }

  function reset() {
    setValues(EMPTY)
    setErrors({})
    setNotice('')
    setStatus('idle')
  }

  if (status === 'sent') {
    return (
      <div role="status" className="stitch-border mx-auto mt-8 max-w-xl bg-ink/5 px-6 py-12">
        <DoodleStar className="mx-auto w-9 text-mustard" />
        <p className="mt-4 font-display text-3xl tracking-tight uppercase">Message on its way</p>
        <p className="mt-3 text-sm text-ink-soft">
          {notice || 'Thanks for reaching out — I’ll get back to you soon.'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="stamp mt-6 bg-paper px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-transform hover:-translate-y-1"
        >
          Send another
        </button>
      </div>
    )
  }

  const fieldProps = (field) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    onChange: update(field),
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
  })

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto mt-8 max-w-xl text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="font-mono text-xs tracking-widest text-ink-soft uppercase">
            Name
          </label>
          <input type="text" autoComplete="name" placeholder="Ada Lovelace" {...fieldProps('name')} className={`mt-2 ${FIELD}`} />
          {errors.name && (
            <p id="contact-name-error" className="mt-1.5 font-hand text-lg text-coral">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="font-mono text-xs tracking-widest text-ink-soft uppercase">
            Email
          </label>
          <input type="email" autoComplete="email" placeholder="you@example.com" {...fieldProps('email')} className={`mt-2 ${FIELD}`} />
          {errors.email && (
            <p id="contact-email-error" className="mt-1.5 font-hand text-lg text-coral">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-message" className="font-mono text-xs tracking-widest text-ink-soft uppercase">
          Message
        </label>
        <textarea rows={5} placeholder="Tell me about the idea, role or project…" {...fieldProps('message')} className={`mt-2 resize-y ${FIELD}`} />
        {errors.message && (
          <p id="contact-message-error" className="mt-1.5 font-hand text-lg text-coral">
            {errors.message}
          </p>
        )}
      </div>

      {/* honeypot */}
      <input
        type="text"
        name="botcheck"
        value={values.botcheck}
        onChange={update('botcheck')}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="mt-7 flex justify-center">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="stamp bg-coral px-8 py-3 text-sm font-bold tracking-widest text-paper uppercase transition-transform hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send message ↗'}
        </button>
      </div>

      <p role="status" aria-live="polite" className={`mt-4 text-center font-hand text-lg text-coral ${status === 'error' ? '' : 'sr-only'}`}>
        {status === 'error' ? notice : ''}
      </p>
    </form>
  )
}
