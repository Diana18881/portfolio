'use client'

import { useMemo, useRef, useState } from 'react'
import type { Copy, Language } from '../_lib/content'
import {
  OCCASIONS,
  SEATING_AREAS,
  TABLES_PER_SLOT,
  addDaysKey,
  addReservation,
  calendarFile,
  cancelReservation,
  fromDateKey,
  isClosed,
  isWeekend,
  newReservationId,
  slotsFor,
  tablesLeft,
  toDateKey,
  useReservations,
  type Service,
  type StoredReservation,
} from '../_lib/reservations'
import { ArrowButton } from './arrows'

const DAYS_AHEAD = 21
const MAX_GUESTS = 6

type Details = { name: string; email: string; phone: string; notes: string }

export default function Reservation({ copy, language }: { copy: Copy; language: Language }) {
  const reservations = useReservations()
  const stripRef = useRef<HTMLDivElement>(null)
  const [todayKey] = useState(() => toDateKey(new Date()))
  const firstOpen = isClosed(todayKey) ? addDaysKey(todayKey, 1) : todayKey
  const [step, setStep] = useState(0)
  const [service, setService] = useState<Service>('Dinner')
  const [date, setDate] = useState(firstOpen)
  const [guests, setGuests] = useState(2)
  const [time, setTime] = useState('')
  const [seating, setSeating] = useState<(typeof SEATING_AREAS)[number]>('Dining room')
  const [occasion, setOccasion] = useState<(typeof OCCASIONS)[number]>('None')
  const [details, setDetails] = useState<Details>({ name: '', email: '', phone: '', notes: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof Details | 'time', string>>>({})
  const [confirmed, setConfirmed] = useState<StoredReservation | null>(null)
  const [cancelForm, setCancelForm] = useState({ id: '', email: '' })
  const [cancelMessage, setCancelMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const locale = language === 'DE' ? 'de-DE' : 'en-GB'
  const days = useMemo(() => Array.from({ length: DAYS_AHEAD }, (_, index) => addDaysKey(todayKey, index)), [todayKey])
  const slots = slotsFor(date, service)
  const now = new Date()
  const slotInfo = slots.map((slot) => {
    const [hours, minutes] = slot.split(':').map(Number)
    const past = date === todayKey && hours * 60 + minutes <= now.getHours() * 60 + now.getMinutes()
    return { slot, left: past ? 0 : tablesLeft(reservations, date, slot), past }
  })
  const openSlots = slotInfo.filter((info) => info.left > 0).length

  const dayAvailable = (key: string) => !isClosed(key) && (service === 'Dinner' || isWeekend(key))

  const chooseService = (next: Service) => {
    setService(next)
    setTime('')
    if (next === 'Brunch' && !isWeekend(date)) {
      const weekend = days.find((key) => isWeekend(key))
      if (weekend) setDate(weekend)
    }
  }

  const validate = () => {
    const next: typeof errors = {}
    if (!details.name.trim()) next.name = copy.errors.name
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) next.email = copy.errors.email
    if (details.phone.replace(/\D/g, '').length < 6) next.phone = copy.errors.phone
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) document.getElementById(`res-${first}`)?.focus()
    return !first
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    const reservation: StoredReservation = {
      id: newReservationId(),
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
      date,
      time,
      guests: `${guests} ${guests === 1 ? 'guest' : 'guests'}`,
      occasion: service === 'Brunch' ? 'Brunch' : occasion === 'None' ? 'Dinner' : occasion,
      seating,
      notes: details.notes.trim(),
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
    }
    addReservation(reservation)
    setConfirmed(reservation)
  }

  const reset = () => {
    setConfirmed(null)
    setStep(0)
    setTime('')
    setDetails({ name: '', email: '', phone: '', notes: '' })
    setErrors({})
  }

  const downloadCalendar = (reservation: StoredReservation) => {
    const url = URL.createObjectURL(new Blob([calendarFile(reservation)], { type: 'text/calendar' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `maison-verde-${reservation.id}.ics`
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatLong = (key: string) =>
    fromDateKey(key).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })

  const steps = [copy.stepDate, copy.stepTime, copy.stepDetails]
  const field = (key: keyof Details, label: string, type = 'text', autoComplete?: string) => (
    <div>
      <label htmlFor={`res-${key}`} className="text-xs font-medium uppercase tracking-[0.15em] text-[#14281f]/60">
        {label}
      </label>
      <input
        id={`res-${key}`}
        type={type}
        autoComplete={autoComplete}
        value={details[key]}
        onChange={(event) => {
          setDetails((current) => ({ ...current, [key]: event.target.value }))
          if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
        }}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `res-${key}-error` : undefined}
        className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-[#14281f] ${errors[key] ? 'border-[#b3261e]' : 'border-[#14281f]/15'}`}
      />
      {errors[key] ? (
        <p id={`res-${key}-error`} className="mt-1.5 text-sm text-[#b3261e]">
          {errors[key]}
        </p>
      ) : null}
    </div>
  )

  return (
    <section id="reserve" className="relative scroll-mt-16 overflow-hidden bg-[#0f1f1a] py-24 text-[#f3ede2] md:py-32">
      <div aria-hidden="true" className="absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-[#c8a46a]/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.45em] text-[#c8a46a]">{copy.reserveEyebrow}</p>
          <h2 className="mt-5 font-display text-5xl font-medium leading-tight md:text-6xl">{copy.reserveTitle}</h2>
          <p className="mt-6 max-w-sm text-lg leading-8 text-white/65">{copy.reserveText}</p>
        </div>

        <div className="min-w-0 rounded-[2rem] bg-[#f3ede2] p-5 text-[#14281f] shadow-2xl md:p-8 lg:row-span-2">
          {confirmed ? (
            <div className="motion-safe:animate-[modal-in_0.5s_cubic-bezier(0.22,1,0.36,1)]">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#14281f] text-2xl text-[#c8a46a]">✓</div>
              <h3 className="mt-5 text-center font-display text-5xl">{copy.confirmedTitle}</h3>
              <p className="mt-2 text-center text-[#14281f]/60">
                {copy.confirmedText} <strong className="text-[#14281f]">{confirmed.email}</strong>
              </p>
              {/* Ticket */}
              <div className="relative mt-8 overflow-hidden rounded-[1.5rem] bg-[#14281f] text-[#f3ede2]">
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#c8a46a]">Maison Verde</p>
                  <p className="mt-2 font-display text-3xl capitalize">{formatLong(confirmed.date)}</p>
                  <p className="mt-1 text-white/65">
                    {confirmed.time} · {copy.guests(guests)} · {copy.seatingAreas[seating]}
                  </p>
                </div>
                <div className="relative border-t border-dashed border-white/20 px-6 py-4">
                  <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#f3ede2]" />
                  <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-[#f3ede2]" />
                  <p className="flex justify-between text-sm">
                    <span className="text-white/55">{copy.bookingId}</span>
                    <strong className="font-mono tracking-wider text-[#e3cf9f]">{confirmed.id}</strong>
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => downloadCalendar(confirmed)} className="flex-1 rounded-full bg-[#14281f] px-6 py-3.5 text-sm font-medium text-[#f3ede2] transition hover:bg-black">
                  {copy.addToCalendar}
                </button>
                <button type="button" onClick={reset} className="flex-1 rounded-full border border-[#14281f]/20 px-6 py-3.5 text-sm font-medium transition hover:border-[#14281f]">
                  {copy.newBooking}
                </button>
              </div>
            </div>
          ) : (
            <>
              <ol className="grid grid-cols-3 gap-2" aria-label="Steps">
                {steps.map((label, index) => (
                  <li key={label}>
                    <button
                      type="button"
                      disabled={index > step}
                      onClick={() => setStep(index)}
                      aria-current={index === step ? 'step' : undefined}
                      className="w-full text-left disabled:cursor-default"
                    >
                      <span className={`block h-1 rounded-full transition ${index <= step ? 'bg-[#c8a46a]' : 'bg-[#14281f]/10'}`} />
                      <span className={`mt-2 block text-xs uppercase tracking-[0.15em] ${index === step ? 'text-[#14281f]' : 'text-[#14281f]/45'}`}>
                        {index + 1}. {label}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>

              {step === 0 ? (
                <div className="mt-8 space-y-8">
                  <div role="group" aria-label={copy.service} className="inline-flex rounded-full bg-[#14281f]/[0.06] p-1">
                    {(['Dinner', 'Brunch'] as Service[]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={service === option}
                        onClick={() => chooseService(option)}
                        className={`rounded-full px-5 py-2 text-sm transition ${service === option ? 'bg-[#14281f] text-[#f3ede2]' : 'text-[#14281f]/60'}`}
                      >
                        {option === 'Dinner' ? copy.dinner : copy.brunch}
                      </button>
                    ))}
                  </div>
                  {service === 'Brunch' ? <p className="-mt-5 text-sm text-[#14281f]/55">{copy.brunchNote}</p> : null}

                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#14281f]/60">{copy.stepDate}</p>
                      <div className="flex gap-2">
                        <ArrowButton direction="prev" label={copy.prev} onClick={() => stripRef.current?.scrollBy({ left: -300, behavior: 'smooth' })} />
                        <ArrowButton direction="next" label={copy.next} onClick={() => stripRef.current?.scrollBy({ left: 300, behavior: 'smooth' })} />
                      </div>
                    </div>
                    <div ref={stripRef} className="-mx-1 mt-3 flex gap-2 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none]">
                      {days.map((key) => {
                        const day = fromDateKey(key)
                        const available = dayAvailable(key)
                        const selected = key === date
                        return (
                          <button
                            key={key}
                            type="button"
                            disabled={!available}
                            onClick={() => {
                              setDate(key)
                              setTime('')
                            }}
                            aria-pressed={selected}
                            aria-label={`${day.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}${isClosed(key) ? `, ${copy.closedMonday}` : ''}`}
                            className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border py-3 transition disabled:cursor-not-allowed ${
                              selected
                                ? 'border-[#14281f] bg-[#14281f] text-[#f3ede2]'
                                : available
                                  ? 'border-[#14281f]/12 bg-white hover:border-[#14281f]/50'
                                  : 'border-transparent bg-[#14281f]/[0.04] text-[#14281f]/30'
                            }`}
                          >
                            <span className="text-[0.65rem] uppercase tracking-wider opacity-70">
                              {day.toLocaleDateString(locale, { weekday: 'short' })}
                            </span>
                            <span className="mt-1 font-display text-2xl leading-none">{day.getDate()}</span>
                            <span className="mt-1 text-[0.6rem] uppercase opacity-60">
                              {isClosed(key) ? '—' : day.toLocaleDateString(locale, { month: 'short' })}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    <p className="mt-2 text-xs text-[#14281f]/45">{copy.closedMonday}</p>
                  </div>

                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#14281f]/60">{copy.stepGuests}</p>
                      <p className="mt-1 font-display text-3xl">{copy.guests(guests)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} disabled={guests <= 1} aria-label="−1" className="grid h-12 w-12 place-items-center rounded-full border border-[#14281f]/20 text-xl transition hover:bg-[#14281f] hover:text-white disabled:opacity-30">
                        −
                      </button>
                      <button type="button" onClick={() => setGuests(Math.min(MAX_GUESTS, guests + 1))} disabled={guests >= MAX_GUESTS} aria-label="+1" className="grid h-12 w-12 place-items-center rounded-full border border-[#14281f]/20 text-xl transition hover:bg-[#14281f] hover:text-white disabled:opacity-30">
                        +
                      </button>
                    </div>
                  </div>

                  <button type="button" onClick={() => setStep(1)} className="w-full rounded-full bg-[#14281f] px-6 py-4 text-sm font-medium text-[#f3ede2] transition hover:bg-black">
                    {copy.continue} · <span className="capitalize">{formatLong(date)}</span>
                  </button>
                </div>
              ) : null}

              {step === 1 ? (
                <div className="mt-8 space-y-7">
                  <p className="font-display text-3xl capitalize">
                    {formatLong(date)} · {copy.guests(guests)}
                  </p>
                  {openSlots ? (
                    <div role="radiogroup" aria-label={copy.stepTime} className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {slotInfo.map(({ slot, left }) => (
                        <button
                          key={slot}
                          type="button"
                          role="radio"
                          aria-checked={time === slot}
                          disabled={left <= 0}
                          onClick={() => {
                            setTime(slot)
                            setErrors((current) => ({ ...current, time: undefined }))
                          }}
                          className={`rounded-2xl border px-2 py-3 text-center transition disabled:cursor-not-allowed disabled:opacity-35 ${
                            time === slot ? 'border-[#14281f] bg-[#14281f] text-[#f3ede2]' : 'border-[#14281f]/12 bg-white hover:border-[#14281f]/50'
                          }`}
                        >
                          <span className="block font-display text-2xl leading-none">{slot}</span>
                          <span className={`mt-1.5 block text-[0.65rem] ${time === slot ? 'text-white/65' : left === 1 ? 'text-[#b3261e]' : 'text-[#14281f]/50'}`}>
                            {left <= 0 ? copy.full : left < TABLES_PER_SLOT ? copy.tablesLeft(left) : '✓'}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-2xl bg-[#14281f]/5 p-5 text-[#14281f]/70">{copy.noSlots}</p>
                  )}
                  {errors.time ? <p role="alert" className="text-sm text-[#b3261e]">{errors.time}</p> : null}

                  {service === 'Dinner' ? (
                    <>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#14281f]/60">{copy.seating}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {SEATING_AREAS.map((area) => (
                            <button key={area} type="button" aria-pressed={seating === area} onClick={() => setSeating(area)} className={`rounded-full px-4 py-2 text-sm transition ${seating === area ? 'bg-[#c8a46a] text-[#0f1f1a]' : 'bg-white text-[#14281f]/70 hover:text-[#14281f]'}`}>
                              {copy.seatingAreas[area]}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#14281f]/60">{copy.occasion}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {OCCASIONS.map((item) => (
                            <button key={item} type="button" aria-pressed={occasion === item} onClick={() => setOccasion(item)} className={`rounded-full px-4 py-2 text-sm transition ${occasion === item ? 'bg-[#c8a46a] text-[#0f1f1a]' : 'bg-white text-[#14281f]/70 hover:text-[#14281f]'}`}>
                              {copy.occasions[item]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(0)} className="rounded-full border border-[#14281f]/20 px-6 py-4 text-sm">
                      {copy.back}
                    </button>
                    <button
                      type="button"
                      onClick={() => (time ? setStep(2) : setErrors((current) => ({ ...current, time: copy.errors.time })))}
                      className="flex-1 rounded-full bg-[#14281f] px-6 py-4 text-sm font-medium text-[#f3ede2] transition hover:bg-black"
                    >
                      {copy.continue}
                      {time ? ` · ${time}` : ''}
                    </button>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <form noValidate onSubmit={submit} className="mt-8 space-y-5">
                  <p className="rounded-2xl bg-[#14281f]/[0.05] px-5 py-4 font-display text-2xl capitalize">
                    {formatLong(date)} · {time} · {copy.guests(guests)}
                  </p>
                  {field('name', copy.name, 'text', 'name')}
                  <div className="grid gap-5 sm:grid-cols-2">
                    {field('email', copy.email, 'email', 'email')}
                    {field('phone', copy.phone, 'tel', 'tel')}
                  </div>
                  <div>
                    <label htmlFor="res-notes" className="text-xs font-medium uppercase tracking-[0.15em] text-[#14281f]/60">
                      {copy.notes}
                    </label>
                    <textarea
                      id="res-notes"
                      rows={2}
                      value={details.notes}
                      onChange={(event) => setDetails((current) => ({ ...current, notes: event.target.value }))}
                      placeholder={copy.notesPlaceholder}
                      className="mt-2 w-full rounded-xl border border-[#14281f]/15 bg-white px-4 py-3 outline-none focus:border-[#14281f]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="rounded-full border border-[#14281f]/20 px-6 py-4 text-sm">
                      {copy.back}
                    </button>
                    <button type="submit" className="flex-1 rounded-full bg-[#c8a46a] px-6 py-4 text-sm font-medium text-[#0f1f1a] transition hover:bg-[#e0c48e]">
                      {copy.confirm}
                    </button>
                  </div>
                </form>
              ) : null}
            </>
          )}
        </div>

        <form
          className="min-w-0 max-w-sm self-start rounded-[1.5rem] border border-white/10 p-6 lg:col-start-1 lg:row-start-2"
          onSubmit={(event) => {
            event.preventDefault()
            const ok = cancelReservation(cancelForm.id, cancelForm.email)
            setCancelMessage({ ok, text: ok ? copy.cancelled : copy.notFound })
            if (ok) setCancelForm({ id: '', email: '' })
          }}
        >
          <p className="font-display text-2xl">{copy.manageTitle}</p>
          <p className="mt-1 text-sm text-white/55">{copy.manageText}</p>
          <div className="mt-4 grid gap-3">
            <input
              value={cancelForm.id}
              onChange={(event) => setCancelForm((current) => ({ ...current, id: event.target.value }))}
              placeholder={`${copy.bookingId} (MV-1234)`}
              aria-label={copy.bookingId}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#c8a46a]"
            />
            <input
              type="email"
              value={cancelForm.email}
              onChange={(event) => setCancelForm((current) => ({ ...current, email: event.target.value }))}
              placeholder={copy.email}
              aria-label={copy.email}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#c8a46a]"
            />
            <button type="submit" className="rounded-full border border-white/25 px-5 py-3 text-sm transition hover:bg-white hover:text-[#0f1f1a]">
              {copy.cancel}
            </button>
          </div>
          {cancelMessage ? (
            <p role="status" className={`mt-3 text-sm ${cancelMessage.ok ? 'text-[#9fd6aa]' : 'text-[#f0a48e]'}`}>
              {cancelMessage.text}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  )
}
