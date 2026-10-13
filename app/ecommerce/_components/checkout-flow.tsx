'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { saveOrder, type PortfolioOrder } from '../_lib/orders'
import {
  EXPRESS_SHIPPING,
  FREE_SHIPPING_FROM,
  PROMO_CODE,
  STANDARD_SHIPPING,
  formatPrice,
} from '../_lib/products'
import { clearCart, getCartLines, useHydrated, useStore } from '../_lib/store'

type Form = {
  email: string
  firstName: string
  lastName: string
  address: string
  zip: string
  city: string
  country: string
  delivery: 'standard' | 'express'
  cardName: string
  cardNumber: string
  expiry: string
  cvc: string
}

type Field = keyof Form

const steps = ['Information', 'Delivery', 'Payment'] as const

const countries = ['Germany', 'Austria', 'Switzerland', 'Netherlands', 'France']

const initialForm: Form = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  zip: '',
  city: '',
  country: 'Germany',
  delivery: 'standard',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
}

const passesLuhn = (digits: string) => {
  let sum = 0

  for (let index = 0; index < digits.length; index += 1) {
    let digit = Number(digits[digits.length - 1 - index])
    if (index % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }

  return sum % 10 === 0
}

const isFutureExpiry = (value: string) => {
  const match = /^(\d{2})\/(\d{2})$/.exec(value)
  if (!match) return false

  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  const now = new Date()

  return month >= 1 && month <= 12 && new Date(year, month) > now
}

const validators: Partial<Record<Field, (value: string) => string>> = {
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Enter a valid email address.',
  firstName: (value) => (value.trim() ? '' : 'Enter your first name.'),
  lastName: (value) => (value.trim() ? '' : 'Enter your last name.'),
  address: (value) => (value.trim().length >= 4 ? '' : 'Enter your street and house number.'),
  zip: (value) => (/^\d{4,5}$/.test(value.trim()) ? '' : 'Enter a 4–5 digit postcode.'),
  city: (value) => (value.trim() ? '' : 'Enter your city.'),
  cardName: (value) => (value.trim() ? '' : 'Enter the name on the card.'),
  cardNumber: (value) => {
    const digits = value.replace(/\s/g, '')
    return digits.length === 16 && passesLuhn(digits) ? '' : 'Enter a valid 16-digit card number.'
  },
  expiry: (value) => (isFutureExpiry(value) ? '' : 'Use MM/YY with a future date.'),
  cvc: (value) => (/^\d{3,4}$/.test(value) ? '' : 'Enter the 3–4 digit code.'),
}

const stepFields: Field[][] = [
  ['email', 'firstName', 'lastName', 'address', 'zip', 'city'],
  [],
  ['cardName', 'cardNumber', 'expiry', 'cvc'],
]

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export default function CheckoutFlow() {
  const { cart } = useStore()
  const hydrated = useHydrated()
  const lines = getCartLines(cart)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Form>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [order, setOrder] = useState<PortfolioOrder | null>(null)

  const itemCount = lines.reduce((total, line) => total + line.quantity, 0)
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.quantity, 0)
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
  const shipping =
    form.delivery === 'express'
      ? EXPRESS_SHIPPING
      : subtotal >= FREE_SHIPPING_FROM
        ? 0
        : STANDARD_SHIPPING
  const total = subtotal - discount + shipping

  const update = (field: Field, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validators[field]?.(value) ?? '' }))
    }
  }

  const validateStep = () => {
    const stepErrors = Object.fromEntries(
      stepFields[step].map((field) => [field, validators[field]?.(form[field]) ?? '']),
    )
    setErrors((current) => ({ ...current, ...stepErrors }))

    const firstInvalid = stepFields[step].find((field) => stepErrors[field])
    if (firstInvalid) document.getElementById(firstInvalid)?.focus()

    return !firstInvalid
  }

  const applyPromo = () => {
    if (promoInput.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoError('This code isn’t valid.')
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateStep()) return

    if (step < steps.length - 1) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const newOrder: PortfolioOrder = {
      id: `#${Math.floor(2000 + Math.random() * 7000)}`,
      customer: `${form.firstName.trim()} ${form.lastName.trim()}`,
      email: form.email.trim(),
      product: lines.map((line) => `${line.quantity}x ${line.product.name}`).join(', '),
      status: 'Paid',
      revenue: total,
      channel: 'Checkout demo',
      date: 'Just now',
      items: itemCount,
    }

    saveOrder(newOrder)
    clearCart()
    setOrder(newOrder)
    window.scrollTo({ top: 0 })
  }

  if (order) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-20 text-center md:px-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#171412] text-2xl text-[#d4af37]">
          ✓
        </div>
        <h1 className="mt-6 text-4xl font-semibold">Thank you, {form.firstName.trim()}!</h1>
        <p className="mt-4 text-lg leading-8 text-black/60">
          Order <strong className="text-black">{order.id}</strong> is confirmed. A confirmation
          would be sent to {order.email} in a real store.
        </p>
        <div className="mt-8 rounded-2xl bg-white p-6 text-left">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8c6a2f]">Behind the scenes</p>
          <p className="mt-2 leading-7 text-black/65">
            This order was saved to <code className="text-sm">localStorage</code>. Open the
            dashboard case to see it in the revenue chart and orders table.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-[#171412] px-7 py-3.5 text-sm font-medium text-white"
          >
            See it in the dashboard →
          </Link>
          <Link
            href="/ecommerce"
            className="rounded-full border border-black/15 px-7 py-3.5 text-sm font-medium"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    )
  }

  if (!hydrated) return <main className="min-h-[60vh]" />

  if (!lines.length) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 text-center md:px-8">
        <h1 className="text-3xl font-semibold">Your bag is empty</h1>
        <p className="mt-3 text-black/60">Add a few products before checking out.</p>
        <Link
          href="/ecommerce#catalog"
          className="mt-8 inline-flex rounded-full bg-[#171412] px-7 py-3.5 text-sm font-medium text-white"
        >
          Back to the shop
        </Link>
      </main>
    )
  }

  const inputClass = (field: Field) =>
    `mt-1.5 w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-black/50 ${
      errors[field] ? 'border-red-600' : 'border-black/15'
    }`

  const textField = (
    field: Field,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
    format: (value: string) => string = (value) => value,
  ) => (
    <div>
      <label htmlFor={field} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={field}
        name={field}
        value={form[field]}
        onChange={(event) => update(field, format(event.target.value))}
        onBlur={() =>
          form[field] &&
          setErrors((current) => ({ ...current, [field]: validators[field]?.(form[field]) ?? '' }))
        }
        aria-invalid={Boolean(errors[field])}
        aria-describedby={errors[field] ? `${field}-error` : undefined}
        className={inputClass(field)}
        {...props}
      />
      {errors[field] ? (
        <p id={`${field}-error`} className="mt-1.5 text-sm text-red-700">
          {errors[field]}
        </p>
      ) : null}
    </div>
  )

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:px-8 lg:grid-cols-[1fr_400px] lg:gap-16">
      <div>
        <h1 className="text-3xl font-semibold md:text-4xl">Checkout</h1>

        <ol className="mt-6 flex gap-2 text-sm" aria-label="Checkout steps">
          {steps.map((label, index) => (
            <li key={label} className="flex items-center gap-2">
              <button
                type="button"
                disabled={index >= step}
                onClick={() => setStep(index)}
                aria-current={index === step ? 'step' : undefined}
                className={`rounded-full px-4 py-2 transition ${
                  index === step
                    ? 'bg-[#171412] text-white'
                    : index < step
                      ? 'bg-white text-black hover:bg-black/5'
                      : 'text-black/40'
                }`}
              >
                {index + 1}. {label}
              </button>
            </li>
          ))}
        </ol>

        <form noValidate onSubmit={handleSubmit} className="mt-8">
          {step === 0 ? (
            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="mb-5 text-lg font-medium">Contact and shipping address</legend>
              <div className="sm:col-span-2">
                {textField('email', 'Email', { type: 'email', autoComplete: 'email' })}
              </div>
              {textField('firstName', 'First name', { autoComplete: 'given-name' })}
              {textField('lastName', 'Last name', { autoComplete: 'family-name' })}
              <div className="sm:col-span-2">
                {textField('address', 'Street and house number', { autoComplete: 'street-address' })}
              </div>
              {textField(
                'zip',
                'Postcode',
                { inputMode: 'numeric', autoComplete: 'postal-code' },
                (value) => value.replace(/\D/g, '').slice(0, 5),
              )}
              {textField('city', 'City', { autoComplete: 'address-level2' })}
              <div className="sm:col-span-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Country
                </label>
                <select
                  id="country"
                  value={form.country}
                  onChange={(event) => update('country', event.target.value)}
                  autoComplete="country-name"
                  className={inputClass('country')}
                >
                  {countries.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </div>
            </fieldset>
          ) : null}

          {step === 1 ? (
            <fieldset>
              <legend className="mb-5 text-lg font-medium">Delivery method</legend>
              <div className="grid gap-3">
                {(
                  [
                    {
                      value: 'standard',
                      title: 'Standard',
                      text: '2–4 working days',
                      price:
                        subtotal >= FREE_SHIPPING_FROM ? 'Free' : formatPrice(STANDARD_SHIPPING),
                    },
                    {
                      value: 'express',
                      title: 'Express',
                      text: 'Next working day',
                      price: formatPrice(EXPRESS_SHIPPING),
                    },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border bg-white p-5 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#d4af37] ${
                      form.delivery === option.value ? 'border-[#171412]' : 'border-black/10'
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="delivery"
                        value={option.value}
                        checked={form.delivery === option.value}
                        onChange={() => update('delivery', option.value)}
                        className="h-4 w-4 accent-[#171412]"
                      />
                      <span>
                        <span className="block font-medium">{option.title}</span>
                        <span className="text-sm text-black/55">{option.text}</span>
                      </span>
                    </span>
                    <span className="font-medium">{option.price}</span>
                  </label>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-white p-5 text-sm leading-6 text-black/65">
                <p className="font-medium text-black">Shipping to</p>
                <p className="mt-1">
                  {form.firstName} {form.lastName}, {form.address}, {form.zip} {form.city},{' '}
                  {form.country}
                </p>
              </div>
            </fieldset>
          ) : null}

          {step === 2 ? (
            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="mb-2 text-lg font-medium">Payment</legend>
              <p className="mb-3 rounded-xl bg-[#d4af37]/15 px-4 py-3 text-sm text-[#5c4718] sm:col-span-2">
                Demo checkout, no real payment. Use test card{' '}
                <button
                  type="button"
                  onClick={() => update('cardNumber', '4242 4242 4242 4242')}
                  className="font-medium underline underline-offset-4"
                >
                  4242 4242 4242 4242
                </button>{' '}
                with any future date.
              </p>
              <div className="sm:col-span-2">
                {textField('cardName', 'Name on card', { autoComplete: 'cc-name' })}
              </div>
              <div className="sm:col-span-2">
                {textField(
                  'cardNumber',
                  'Card number',
                  { inputMode: 'numeric', autoComplete: 'cc-number', placeholder: '1234 5678 9012 3456' },
                  formatCardNumber,
                )}
              </div>
              {textField(
                'expiry',
                'Expiry date',
                { inputMode: 'numeric', autoComplete: 'cc-exp', placeholder: 'MM/YY' },
                formatExpiry,
              )}
              {textField(
                'cvc',
                'Security code',
                { inputMode: 'numeric', autoComplete: 'cc-csc', placeholder: '123' },
                (value) => value.replace(/\D/g, '').slice(0, 4),
              )}
            </fieldset>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="text-sm text-black/60 underline-offset-4 hover:text-black hover:underline"
              >
                ← Back
              </button>
            ) : (
              <Link
                href="/ecommerce"
                className="text-sm text-black/60 underline-offset-4 hover:text-black hover:underline"
              >
                ← Continue shopping
              </Link>
            )}
            <button
              type="submit"
              className="rounded-full bg-[#171412] px-8 py-4 text-sm font-medium text-white transition hover:bg-black"
            >
              {step === steps.length - 1 ? `Pay ${formatPrice(total)}` : `Continue to ${steps[step + 1].toLowerCase()}`}
            </button>
          </div>
        </form>
      </div>

      <aside className="h-fit rounded-[2rem] bg-white p-6 lg:sticky lg:top-28">
        <h2 className="font-medium">
          Order summary <span className="text-black/50">({itemCount})</span>
        </h2>
        <ul className="mt-5 space-y-4">
          {lines.map((line) => (
            <li key={`${line.productId}-${line.size}`} className="flex items-center gap-4">
              <div className="relative">
                <Image
                  width={120}
                  height={150}
                  src={line.product.image}
                  alt=""
                  className="h-20 w-16 rounded-lg object-cover"
                />
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#171412] px-1 text-xs text-white">
                  {line.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{line.product.name}</p>
                <p className="text-sm text-black/50">{line.size}</p>
              </div>
              <p className="text-sm">{formatPrice(line.product.price * line.quantity)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-black/10 pt-5">
          {promoApplied ? (
            <p className="flex justify-between text-sm">
              <span>
                Code <strong>{PROMO_CODE}</strong> applied
              </span>
              <button
                type="button"
                onClick={() => setPromoApplied(false)}
                className="text-black/50 underline underline-offset-4 hover:text-black"
              >
                Remove
              </button>
            </p>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(event) => setPromoInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      applyPromo()
                    }
                  }}
                  placeholder={`Promo code (try ${PROMO_CODE})`}
                  aria-label="Promo code"
                  className="min-w-0 flex-1 rounded-xl border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black/50"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="rounded-xl border border-black/15 px-4 text-sm font-medium hover:border-black/40"
                >
                  Apply
                </button>
              </div>
              {promoError ? <p className="mt-2 text-sm text-red-700">{promoError}</p> : null}
            </>
          )}
        </div>

        <dl className="mt-5 space-y-2 border-t border-black/10 pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-black/60">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          {discount ? (
            <div className="flex justify-between text-[#8c6a2f]">
              <dt>Discount (10%)</dt>
              <dd>−{formatPrice(discount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between">
            <dt className="text-black/60">Shipping</dt>
            <dd>{shipping ? formatPrice(shipping) : 'Free'}</dd>
          </div>
          <div className="flex justify-between border-t border-black/10 pt-3 text-lg font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
      </aside>
    </main>
  )
}
