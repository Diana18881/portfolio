'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type MenuCategory = 'Dinner' | 'Wine' | 'Brunch' | 'Dessert'

type MenuItem = {
  name: string
  detail: string
  price: string
  category: MenuCategory
  image: string
}

type Reservation = {
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  occasion: string
  seating: string
  notes: string
}

type StoredReservation = Reservation & {
  id: string
  createdAt: string
  status: 'Confirmed' | 'Arrived' | 'Cancelled' | 'No-show'
}

const RESERVATIONS_STORAGE_KEY = 'maison-verde-reservations'

const menuCategories: MenuCategory[] = ['Dinner', 'Wine', 'Brunch', 'Dessert']

const dinnerSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']

const brunchSlots = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00']

const seatingAreas = ['Dining room', 'Window table', 'Bar counter', 'Terrace']

const getDateInputValue = (daysFromToday = 0) => {
  const date = new Date()

  date.setDate(date.getDate() + daysFromToday)

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)

  return localDate.toISOString().split('T')[0]
}

const removePastReservations = (items: StoredReservation[], today: string) =>
  items
    .map((item) => ({
      ...item,
      phone: item.phone || 'Not provided',
      seating: item.seating || 'Dining room',
      notes: item.notes || '',
    }))
    .filter((item) => item.date >= today)

const getDayOfWeek = (date: string) => new Date(`${date}T12:00:00`).getDay()

const isClosedDate = (date: string) => getDayOfWeek(date) === 1

const isWeekend = (date: string) => {
  const day = getDayOfWeek(date)

  return day === 0 || day === 6
}

const getTimeSlotsFor = (date: string, occasion: string) =>
  occasion === 'Brunch' && isWeekend(date) ? brunchSlots : dinnerSlots

const menuItems: MenuItem[] = [
  {
    name: 'Charred Cabbage',
    detail: 'Walnut cream, fermented apple, toasted seeds',
    price: '€16',
    category: 'Dinner',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Sea Bass Crudo',
    detail: 'Green apple, cucumber, basil oil, citrus',
    price: '€22',
    category: 'Dinner',
    image:
      'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Handmade Ravioli',
    detail: 'Ricotta, brown butter, sage, hazelnut',
    price: '€24',
    category: 'Dinner',
    image:
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Truffle Potato Gnocchi',
    detail: 'Parmesan foam, chives, roasted mushroom jus',
    price: '€23',
    category: 'Dinner',
    image:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Roasted Beet Tartare',
    detail: 'Horseradish cream, rye crisp, dill oil',
    price: '€15',
    category: 'Dinner',
    image:
      'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Natural Riesling Flight',
    detail: 'Three small pours from Mosel and Pfalz producers',
    price: '€18',
    category: 'Wine',
    image:
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Orange Wine Pairing',
    detail: 'Textured, aromatic pairing for vegetable-led dishes',
    price: '€26',
    category: 'Wine',
    image:
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Botanical Spritz',
    detail: 'Vermouth, elderflower, rosemary, soda',
    price: '€12',
    category: 'Wine',
    image:
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'House Pet Nat',
    detail: 'Light bubbles, peach skin, fresh herbs',
    price: '€14',
    category: 'Wine',
    image:
      'https://images.unsplash.com/photo-1535869462434-f92cc30bf40c?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Herb Omelette',
    detail: 'Whipped goat cheese, chives, sourdough',
    price: '€14',
    category: 'Brunch',
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Buckwheat Pancakes',
    detail: 'Pear compote, salted butter, maple',
    price: '€15',
    category: 'Brunch',
    image:
      'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Market Bowl',
    detail: 'Roasted greens, grains, tahini, soft egg',
    price: '€17',
    category: 'Brunch',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Sourdough French Toast',
    detail: 'Berry compote, mascarpone, toasted almonds',
    price: '€16',
    category: 'Brunch',
    image:
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Olive Oil Cake',
    detail: 'Lemon cream, candied peel, pistachio',
    price: '€11',
    category: 'Dessert',
    image:
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Dark Chocolate Mousse',
    detail: 'Sea salt, espresso caramel, cocoa nibs',
    price: '€12',
    category: 'Dessert',
    image:
      'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Roasted Pear',
    detail: 'Vanilla mascarpone, buckwheat crumble',
    price: '€10',
    category: 'Dessert',
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Pistachio Panna Cotta',
    detail: 'Raspberry, rose syrup, roasted pistachio',
    price: '€11',
    category: 'Dessert',
    image:
      'https://images.unsplash.com/photo-1488477304112-4944851de03d?q=80&w=900&auto=format&fit=crop',
  },
]

const gallery = [
  {
    src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1400&auto=format&fit=crop',
    alt: 'Warm restaurant dining room',
  },
  {
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop',
    alt: 'Chef plating a dish',
  },
  {
    src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop',
    alt: 'Restaurant table with friends',
  },
]

const reviews = [
  {
    quote: 'A confident neighborhood restaurant with the polish of a destination.',
    source: 'Berlin Food Stories',
  },
  {
    quote: 'The site makes the booking decision feel immediate and effortless.',
    source: 'Hospitality UX review',
  },
]

const stats = [
  ['24h', 'reservationFlow'],
  ['4', 'menuModes'],
  ['4.8', 'guestRating'],
  ['100%', 'responsive'],
]

const translations = {
  EN: {
    navExperience: 'Experience',
    navMenu: 'Menu',
    navReserve: 'Reserve',
    navAdmin: 'Admin',
    navPortfolio: 'Portfolio',
    heroLabel: 'Brand website case study',
    heroText:
      'A cinematic restaurant website with a premium visual system, interactive menu, booking flow, social proof and content that turns atmosphere into reservations.',
    bookTable: 'Book a table',
    exploreMenu: 'Explore menu',
    tonight: 'Tonight',
    seasonalDinner: 'Seasonal dinner',
    naturalWine: '18:00 - 23:00 · Kreuzberg · natural wine pairing available',
    nextAvailable: 'Next available',
    reservationFlow: 'reservation flow',
    menuModes: 'menu modes',
    guestRating: 'guest rating',
    responsive: 'responsive',
    experienceLabel: 'Experience',
    experienceTitle: 'Every section has a job: desire, trust, decision.',
    experienceCards: [
      ['Editorial hero', 'Large photography and direct copy make the brand memorable in the first viewport.'],
      ['Fast booking', 'Sticky CTA, reservation form and available time reduce friction for guests.'],
      ['Menu discovery', 'Category tabs let visitors explore dinner, brunch and wine without leaving the page.'],
      ['Trust signals', 'Reviews, location, opening hours and press-style proof support the decision.'],
    ],
    videoLabel: 'Atmosphere video',
    videoTitle: 'Motion makes the brand feel alive.',
    videoText:
      'A video section gives the landing page premium energy and helps recruiters see that the interface supports real hospitality content.',
    gallery: 'Gallery',
    menuTitle: 'A visual menu that feels browsable, premium and alive.',
    menuText:
      'Visitors can switch between dinner, wine, brunch and dessert. Each dish has its own image, price and short description, so the section works like a real restaurant product experience.',
    viewDish: 'View dish details',
    menuHighlights: [
      ['Chef selection', 'Seasonal highlights update weekly.'],
      ['Dietary notes', 'Vegetarian and gluten-free options are clear in the flow.'],
      ['Conversion detail', 'Menu content leads naturally into reservation.'],
    ],
    reserveLabel: 'Reserve',
    reserveTitle: 'A polished booking flow recruiters can click through.',
    address: 'Oranienstrasse 44, 10999 Berlin',
    hours: 'Tue - Sat · 18:00 - 23:00',
    brunchHours: 'Brunch · Saturday and Sunday · 10:00 - 15:00',
    slotsAvailable: 'time slots available for the selected date',
    name: 'Name',
    namePlaceholder: 'Your name',
    phone: 'Phone',
    date: 'Date',
    guests: 'Guests',
    occasion: 'Occasion',
    seating: 'Seating',
    today: 'Today',
    tomorrow: 'Tomorrow',
    availableTime: 'Available time',
    slotsLeft: 'slots left',
    fullyBooked: 'Fully booked for this date',
    fullyBookedHelp: 'This date is fully booked. Please choose another date.',
    closedMonday: 'Maison Verde is closed on Mondays.',
    brunchWeekend: 'Brunch can be reserved only on Saturday and Sunday.',
    emailError: 'Email should include @ and a domain, for example name@email.com.',
    specialRequests: 'Special requests',
    specialRequestsPlaceholder: 'Allergies, stroller, anniversary, quiet table...',
    deposit: 'Deposit:',
    depositText: 'no prepayment for parties under 6.',
    hold: 'Hold:',
    holdText: 'tables are held for 15 minutes.',
    changes: 'Changes:',
    changesText: 'call the restaurant for same-day updates.',
    requestReservation: 'Request reservation',
    bookingConfirmed: 'Booking confirmed',
    addToCalendar: 'Add to calendar',
    manageBooking: 'Manage booking',
    cancelTitle: 'Cancel with booking ID and email.',
    bookingId: 'Booking ID',
    cancel: 'Cancel',
    allergens: 'Allergens:',
    allergensText: 'ask staff',
    diet: 'Diet:',
    dietText: 'seasonal',
    pairing: 'Pairing:',
    pairingText: 'wine available',
    close: 'Close',
    invalidPast: 'Please choose today or a future date.',
    invalidClosed: 'Maison Verde is closed on Mondays. Please choose another date.',
    invalidBrunch: 'Brunch is available only on Saturday and Sunday.',
    invalidTime: 'Please choose an available time for this service.',
    invalidBooked: 'This time is already reserved. Please choose another available slot.',
    invalidForm: 'Please add your name, phone, a valid email with @, date, time and guest count.',
    reservationFound: 'Reservation confirmed for',
    reservationNotFound: 'Reservation not found. Check booking ID and email.',
    reservationCancelled: 'Reservation cancelled. The time slot is available again.',
  },
  DE: {
    navExperience: 'Erlebnis',
    navMenu: 'Speisekarte',
    navReserve: 'Reservieren',
    navAdmin: 'Admin',
    navPortfolio: 'Portfolio',
    heroLabel: 'Brand-Website Case Study',
    heroText:
      'Eine atmosphärische Restaurant-Website mit hochwertigem Look, interaktiver Speisekarte, Reservierungsflow, Social Proof und Inhalten, die direkt zu Buchungen führen.',
    bookTable: 'Tisch reservieren',
    exploreMenu: 'Speisekarte ansehen',
    tonight: 'Heute Abend',
    seasonalDinner: 'Saisonales Dinner',
    naturalWine: '18:00 - 23:00 · Kreuzberg · Naturweinbegleitung verfügbar',
    nextAvailable: 'Nächster Slot',
    reservationFlow: 'Reservierungsflow',
    menuModes: 'Menü-Modi',
    guestRating: 'Gästebewertung',
    responsive: 'responsive',
    experienceLabel: 'Erlebnis',
    experienceTitle: 'Jeder Abschnitt hat eine Aufgabe: Wunsch, Vertrauen, Entscheidung.',
    experienceCards: [
      ['Editorialer Hero', 'Große Fotografie und klare Texte machen die Marke sofort erinnerbar.'],
      ['Schnelle Buchung', 'Sticky CTA, Formular und freie Zeiten reduzieren Reibung für Gäste.'],
      ['Speisekarten-Entdeckung', 'Kategorien lassen Dinner, Brunch und Wein direkt auf der Seite entdecken.'],
      ['Vertrauen', 'Reviews, Standort, Öffnungszeiten und Social Proof unterstützen die Entscheidung.'],
    ],
    videoLabel: 'Atmosphären-Video',
    videoTitle: 'Bewegung macht die Marke lebendig.',
    videoText:
      'Ein Video-Bereich gibt der Seite Premium-Energie und zeigt, dass das Interface echte Hospitality-Inhalte tragen kann.',
    gallery: 'Galerie',
    menuTitle: 'Eine visuelle Speisekarte, die hochwertig und lebendig wirkt.',
    menuText:
      'Gäste können zwischen Dinner, Wein, Brunch und Dessert wechseln. Jedes Gericht hat Bild, Preis und Kurzbeschreibung, wie in einem echten Restaurant-Produkt.',
    viewDish: 'Gericht ansehen',
    menuHighlights: [
      ['Chef-Auswahl', 'Saisonale Highlights werden wöchentlich aktualisiert.'],
      ['Hinweise', 'Vegetarische und glutenfreie Optionen sind im Flow klar sichtbar.'],
      ['Conversion-Detail', 'Die Speisekarte führt natürlich zur Reservierung.'],
    ],
    reserveLabel: 'Reservieren',
    reserveTitle: 'Ein sauberer Buchungsflow, den Recruiter wirklich testen können.',
    address: 'Oranienstraße 44, 10999 Berlin',
    hours: 'Di - Sa · 18:00 - 23:00',
    brunchHours: 'Brunch · Samstag und Sonntag · 10:00 - 15:00',
    slotsAvailable: 'freie Zeiten für das gewählte Datum',
    name: 'Name',
    namePlaceholder: 'Dein Name',
    phone: 'Telefon',
    date: 'Datum',
    guests: 'Gäste',
    occasion: 'Anlass',
    seating: 'Sitzbereich',
    today: 'Heute',
    tomorrow: 'Morgen',
    availableTime: 'Freie Zeit',
    slotsLeft: 'Slots frei',
    fullyBooked: 'Ausgebucht für dieses Datum',
    fullyBookedHelp: 'Dieses Datum ist ausgebucht. Bitte wähle ein anderes Datum.',
    closedMonday: 'Maison Verde ist montags geschlossen.',
    brunchWeekend: 'Brunch kann nur samstags und sonntags reserviert werden.',
    emailError: 'E-Mail muss @ und eine Domain enthalten, zum Beispiel name@email.com.',
    specialRequests: 'Besondere Wünsche',
    specialRequestsPlaceholder: 'Allergien, Kinderwagen, Jahrestag, ruhiger Tisch...',
    deposit: 'Deposit:',
    depositText: 'keine Vorauszahlung für Gruppen unter 6 Personen.',
    hold: 'Hold:',
    holdText: 'Tische werden 15 Minuten gehalten.',
    changes: 'Änderungen:',
    changesText: 'für Änderungen am selben Tag bitte anrufen.',
    requestReservation: 'Reservierung anfragen',
    bookingConfirmed: 'Reservierung bestätigt',
    addToCalendar: 'Zum Kalender hinzufügen',
    manageBooking: 'Reservierung verwalten',
    cancelTitle: 'Mit Buchungs-ID und E-Mail stornieren.',
    bookingId: 'Buchungs-ID',
    cancel: 'Stornieren',
    allergens: 'Allergene:',
    allergensText: 'Personal fragen',
    diet: 'Ernährung:',
    dietText: 'saisonal',
    pairing: 'Pairing:',
    pairingText: 'Wein verfügbar',
    close: 'Schließen',
    invalidPast: 'Bitte wähle heute oder ein zukünftiges Datum.',
    invalidClosed: 'Maison Verde ist montags geschlossen. Bitte wähle ein anderes Datum.',
    invalidBrunch: 'Brunch ist nur samstags und sonntags verfügbar.',
    invalidTime: 'Bitte wähle eine verfügbare Zeit für diesen Service.',
    invalidBooked: 'Diese Zeit ist bereits reserviert. Bitte wähle einen freien Slot.',
    invalidForm: 'Bitte Name, Telefon, gültige E-Mail mit @, Datum, Zeit und Gästezahl ausfüllen.',
    reservationFound: 'Reservierung bestätigt für',
    reservationNotFound: 'Reservierung nicht gefunden. Bitte Buchungs-ID und E-Mail prüfen.',
    reservationCancelled: 'Reservierung storniert. Der Zeitslot ist wieder verfügbar.',
  },
}

export default function BrandWebsitePage() {
  const today = getDateInputValue()
  const tomorrow = getDateInputValue(1)
  const [language, setLanguage] = useState<'EN' | 'DE'>('EN')
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Dinner')
  const [selectedImage, setSelectedImage] = useState(gallery[0])
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null)
  const [reservation, setReservation] = useState<Reservation>({
    name: '',
    email: '',
    phone: '',
    date: today,
    time: '20:30',
    guests: '2 guests',
    occasion: 'Dinner',
    seating: 'Dining room',
    notes: '',
  })
  const [reservations, setReservations] = useState<StoredReservation[]>([])
  const [completedReservation, setCompletedReservation] = useState<StoredReservation | null>(null)
  const [cancelEmail, setCancelEmail] = useState('')
  const [cancelId, setCancelId] = useState('')
  const [message, setMessage] = useState('')
  const copy = translations[language]
  const categoryLabel = (category: string) =>
    language === 'DE'
      ? {
          Dinner: 'Dinner',
          Wine: 'Wein',
          Brunch: 'Brunch',
          Dessert: 'Dessert',
        }[category] || category
      : category
  const seatingLabel = (area: string) =>
    language === 'DE'
      ? {
          'Dining room': 'Gastraum',
          'Window table': 'Fenstertisch',
          'Bar counter': 'Bar',
          Terrace: 'Terrasse',
        }[area] || area
      : area
  const guestLabel = (guests: string) =>
    language === 'DE' ? guests.replace('guests', 'Gäste') : guests
  const occasionLabel = (occasion: string) =>
    language === 'DE'
      ? {
          Dinner: 'Dinner',
          Brunch: 'Brunch',
          Birthday: 'Geburtstag',
          'Date night': 'Date Night',
          'Business dinner': 'Business Dinner',
        }[occasion] || occasion
      : occasion

  const filteredMenu = useMemo(
    () => menuItems.filter((item) => item.category === activeCategory),
    [activeCategory],
  )

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reservation.email.trim())
  const activeTimeSlots = useMemo(
    () => getTimeSlotsFor(reservation.date, reservation.occasion),
    [reservation.date, reservation.occasion],
  )
  const bookedSlots = useMemo(
    () =>
      reservations
        .filter((item) => item.date === reservation.date && item.status !== 'Cancelled')
        .map((item) => item.time),
    [reservation.date, reservations],
  )
  const availableSlots = activeTimeSlots.filter((time) => !bookedSlots.includes(time))
  const selectedSlotIsBooked =
    reservation.date && bookedSlots.includes(reservation.time)
  const selectedDateIsPast = reservation.date && reservation.date < today
  const selectedDateIsClosed = reservation.date && isClosedDate(reservation.date)
  const brunchUnavailable =
    reservation.occasion === 'Brunch' && reservation.date && !isWeekend(reservation.date)
  const canReserve =
    reservation.name.trim() &&
    emailIsValid &&
    reservation.phone.trim().length >= 6 &&
    reservation.date &&
    !selectedDateIsPast &&
    !selectedDateIsClosed &&
    !brunchUnavailable &&
    reservation.time &&
    activeTimeSlots.includes(reservation.time) &&
    !selectedSlotIsBooked &&
    reservation.guests &&
    reservation.occasion

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const savedReservations = window.localStorage.getItem(RESERVATIONS_STORAGE_KEY)

      if (savedReservations) {
        const activeReservations = removePastReservations(
          JSON.parse(savedReservations) as StoredReservation[],
          today,
        )

        window.localStorage.setItem(
          RESERVATIONS_STORAGE_KEY,
          JSON.stringify(activeReservations),
        )
        setReservations(activeReservations)
      }
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [today])

  const handleReservation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canReserve) {
      setMessage(
        selectedDateIsPast
          ? copy.invalidPast
          : selectedDateIsClosed
          ? copy.invalidClosed
          : brunchUnavailable
          ? copy.invalidBrunch
          : !activeTimeSlots.includes(reservation.time)
          ? copy.invalidTime
          : selectedSlotIsBooked
          ? copy.invalidBooked
          : copy.invalidForm,
      )
      return
    }

    const nextReservation: StoredReservation = {
      ...reservation,
      name: reservation.name.trim(),
      email: reservation.email.trim(),
      id: `MV-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Confirmed',
    }
    const nextReservations = removePastReservations(
      [nextReservation, ...reservations],
      today,
    )

    window.localStorage.setItem(
      RESERVATIONS_STORAGE_KEY,
      JSON.stringify(nextReservations),
    )
    setReservations(nextReservations)
    setCompletedReservation(nextReservation)
    setMessage(
      `${copy.reservationFound} ${nextReservation.name} · ${nextReservation.guests} · ${nextReservation.date} · ${nextReservation.time}.`,
    )
    setReservation((current) => ({
      ...current,
      name: '',
      email: '',
      phone: '',
      notes: '',
    }))
  }

  const handleCancelReservation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const updatedReservations = reservations.map((item) =>
      item.id.toLowerCase() === cancelId.trim().toLowerCase() &&
      item.email.toLowerCase() === cancelEmail.trim().toLowerCase()
        ? { ...item, status: 'Cancelled' as const }
        : item,
    )
    const changed = updatedReservations.some(
      (item, index) => item.status !== reservations[index].status,
    )

    if (!changed) {
      setMessage(copy.reservationNotFound)
      return
    }

    window.localStorage.setItem(
      RESERVATIONS_STORAGE_KEY,
      JSON.stringify(updatedReservations),
    )
    setReservations(updatedReservations)
    setCancelEmail('')
    setCancelId('')
    setMessage(copy.reservationCancelled)
  }

  return (
    <main className="min-h-screen bg-[#fbf6ec] text-[#171714]">
      <section className="relative min-h-screen overflow-hidden bg-[#10231d] text-white">
        <img
          src={selectedImage.src}
          alt={selectedImage.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06110d]/90 via-[#10231d]/55 to-black/15" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 md:px-8 lg:px-12">
          <header className="flex flex-col gap-4 border-b border-white/20 pb-5 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="text-sm font-semibold uppercase tracking-[0.35em]">
              Diana Tsymbaliuk
            </Link>
            <nav className="flex flex-wrap gap-4 text-sm text-white/75 sm:gap-6">
              <a href="#experience" className="hover:text-white">{copy.navExperience}</a>
              <a href="#menu" className="hover:text-white">{copy.navMenu}</a>
              <a href="#reserve" className="hover:text-white">{copy.navReserve}</a>
              <Link href="/brand/admin" className="hover:text-white">{copy.navAdmin}</Link>
              <Link href="/" className="hover:text-white">{copy.navPortfolio}</Link>
              <button
                type="button"
                onClick={() => setLanguage((current) => (current === 'EN' ? 'DE' : 'EN'))}
                className="rounded-full border border-white/20 px-3 py-1 text-white"
              >
                {language}
              </button>
            </nav>
          </header>

          <div className="grid flex-1 gap-8 py-12 lg:grid-cols-[1fr_420px] lg:items-end">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d6b86a]">
                {copy.heroLabel}
              </p>
              <h1 className="mt-6 text-6xl font-semibold leading-none sm:text-7xl lg:text-8xl">
                Maison Verde
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl sm:leading-9">
                {copy.heroText}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#reserve"
                  className="rounded-full bg-[#d6b86a] px-6 py-4 text-sm font-semibold text-black"
                >
                  {copy.bookTable}
                </a>
                <a
                  href="#menu"
                  className="rounded-full border border-white/35 px-6 py-4 text-sm font-semibold text-white"
                >
                  {copy.exploreMenu}
                </a>
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-white/20 bg-[#10231d]/55 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d6b86a]">
                {copy.tonight}
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <p className="text-3xl font-semibold">{copy.seasonalDinner}</p>
                  <p className="mt-2 leading-7 text-white/65">
                    {copy.naturalWine}
                  </p>
                </div>
                <div className="rounded-[1rem] bg-white/10 p-4">
                  <p className="text-sm text-white/65">{copy.nextAvailable}</p>
                  <p className="mt-1 text-2xl font-semibold">20:30</p>
                </div>
              </div>
            </aside>
          </div>

          <div className="grid gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="border-t border-white/20 pt-4">
                <p className="text-2xl font-semibold">{value}</p>
                <p className="mt-1 text-sm text-white/60">
                  {label === 'reservationFlow'
                    ? copy.reservationFlow
                    : label === 'menuModes'
                    ? copy.menuModes
                    : label === 'guestRating'
                    ? copy.guestRating
                    : copy.responsive}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#85703a]">
            {copy.experienceLabel}
          </p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {copy.experienceTitle}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            ...copy.experienceCards,
          ].map(([title, text]) => (
            <article key={title} className="rounded-[1.5rem] border border-[#10231d]/10 bg-white p-5 shadow-sm">
              <h3 className="text-2xl font-semibold">{title}</h3>
              <p className="mt-3 leading-7 text-black/60">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-16 sm:px-6 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:pb-24">
        <div className="rounded-[2rem] bg-[#10231d] p-6 text-white md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d6b86a]">
            {copy.videoLabel}
          </p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
            {copy.videoTitle}
          </h2>
          <p className="mt-5 leading-8 text-white/65">
            {copy.videoText}
          </p>
        </div>
        <div className="overflow-hidden rounded-[2rem] bg-[#10231d] p-3 shadow-sm">
          <video
            className="h-[360px] w-full rounded-[1.5rem] object-cover md:h-[460px]"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1400&auto=format&fit=crop"
          >
            <source
              src="https://videos.pexels.com/video-files/3195650/3195650-uhd_2560_1440_25fps.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-16 sm:px-6 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:pb-24">
        <div className="overflow-hidden rounded-[2rem] bg-[#171714] p-3 shadow-sm">
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="h-[420px] w-full rounded-[1.5rem] object-cover sm:h-[520px]"
          />
        </div>
        <div className="grid gap-4">
          {gallery.map((image) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`grid grid-cols-[110px_1fr] items-center gap-4 rounded-[1.5rem] border p-3 text-left transition ${
                selectedImage.src === image.src
                  ? 'border-[#171714] bg-white'
                  : 'border-black/10 bg-white/60 hover:bg-white'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-24 w-full rounded-[1rem] object-cover"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8b6a2e]">
                  {copy.gallery}
                </p>
                <p className="mt-2 font-semibold">{image.alt}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="menu" className="bg-[#10231d] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 lg:px-12 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d6b86a]">
              {copy.navMenu}
            </p>
            <div className="mt-5 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <h2 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                {copy.menuTitle}
              </h2>
              <p className="max-w-2xl leading-8 text-white/65 lg:justify-self-end">
                {copy.menuText}
              </p>
            </div>
            <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
              {menuCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-full px-5 py-3 text-sm font-semibold transition ${
                    activeCategory === category
                      ? 'bg-[#d6b86a] text-black'
                      : 'border border-white/20 text-white/70 hover:text-white'
                  }`}
                >
                  {categoryLabel(category)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredMenu.map((item) => (
              <article
                key={item.name}
                className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-64 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d6b86a]">
                        {categoryLabel(item.category)}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold">{item.name}</h3>
                    </div>
                    <p className="shrink-0 rounded-full bg-white/10 px-3 py-2 text-[#d6b86a]">
                      {item.price}
                    </p>
                  </div>
                  <p className="mt-4 leading-7 text-white/60">{item.detail}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedDish(item)}
                    className="mt-5 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/75 transition hover:text-white"
                  >
                    {copy.viewDish}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              ...copy.menuHighlights,
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-white/10 p-5">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-white/60">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 md:px-8 lg:grid-cols-2 lg:px-12 lg:py-24">
        {reviews.map((review) => (
          <article key={review.source} className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
            <p className="text-2xl font-semibold leading-snug">“{review.quote}”</p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-[#8b6a2e]">
              {review.source}
            </p>
          </article>
        ))}
      </section>

      <section id="reserve" className="mx-auto grid max-w-7xl gap-8 px-4 pb-24 sm:px-6 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#8b6a2e]">
            {copy.reserveLabel}
          </p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {copy.reserveTitle}
          </h2>
          <div className="mt-8 grid gap-3 text-black/65">
            <p>{copy.address}</p>
            <p>{copy.hours}</p>
            <p>{copy.brunchHours}</p>
            <p>{availableSlots.length} {copy.slotsAvailable}</p>
          </div>
        </div>

        <form
          onSubmit={handleReservation}
          className="grid gap-4 rounded-[2rem] bg-white p-5 shadow-sm md:p-7"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold">
              {copy.name}
              <input
                value={reservation.name}
                onChange={(event) =>
                  setReservation((current) => ({ ...current, name: event.target.value }))
                }
                className="rounded-full border border-black/10 px-5 py-4 font-normal outline-none focus:border-black/35"
                placeholder={copy.namePlaceholder}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Email
              <input
                value={reservation.email}
                onChange={(event) =>
                  setReservation((current) => ({ ...current, email: event.target.value }))
                }
                className="rounded-full border border-black/10 px-5 py-4 font-normal outline-none focus:border-black/35"
                placeholder="name@email.com"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              {copy.phone}
              <input
                value={reservation.phone}
                onChange={(event) =>
                  setReservation((current) => ({ ...current, phone: event.target.value }))
                }
                className="rounded-full border border-black/10 px-5 py-4 font-normal outline-none focus:border-black/35"
                placeholder="+49 30 123456"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="grid gap-2 text-sm font-semibold">
              {copy.date}
              <input
                type="date"
                min={today}
                value={reservation.date}
                onChange={(event) =>
                  setReservation((current) => ({ ...current, date: event.target.value }))
                }
                className="rounded-full border border-black/10 px-5 py-4 font-normal outline-none focus:border-black/35"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              {copy.guests}
              <select
                value={reservation.guests}
                onChange={(event) =>
                  setReservation((current) => ({ ...current, guests: event.target.value }))
                }
                className="rounded-full border border-black/10 bg-white px-5 py-4 font-normal outline-none focus:border-black/35"
              >
                {['2 guests', '4 guests', '6 guests', 'Private dining'].map((option) => (
                  <option key={option} value={option}>{guestLabel(option)}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              {copy.occasion}
              <select
                value={reservation.occasion}
                onChange={(event) =>
                  setReservation((current) => {
                    const nextOccasion = event.target.value
                    const nextSlots = getTimeSlotsFor(current.date, nextOccasion)

                    return {
                      ...current,
                      occasion: nextOccasion,
                      time: nextSlots[0] || '',
                    }
                  })
                }
                className="rounded-full border border-black/10 bg-white px-5 py-4 font-normal outline-none focus:border-black/35"
              >
                {['Dinner', 'Brunch', 'Birthday', 'Date night', 'Business dinner'].map((option) => (
                  <option key={option} value={option}>{occasionLabel(option)}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              {copy.seating}
              <select
                value={reservation.seating}
                onChange={(event) =>
                  setReservation((current) => ({ ...current, seating: event.target.value }))
                }
                className="rounded-full border border-black/10 bg-white px-5 py-4 font-normal outline-none focus:border-black/35"
              >
                {seatingAreas.map((area) => (
                  <option key={area} value={area}>{seatingLabel(area)}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              [copy.today, today],
              [copy.tomorrow, tomorrow],
            ].map(([label, date]) => (
              <button
                key={date}
                type="button"
                onClick={() =>
                  setReservation((current) => ({
                    ...current,
                    date,
                    time:
                      getTimeSlotsFor(date, current.occasion).find(
                        (time) =>
                          !reservations.some(
                            (item) =>
                              item.date === date &&
                              item.time === time &&
                              item.status !== 'Cancelled',
                          ),
                      ) || '',
                  }))
                }
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  reservation.date === date
                    ? 'bg-[#10231d] text-white'
                    : 'bg-[#f4f0e8] text-black/60 hover:text-black'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold">{copy.availableTime}</p>
              <p className="text-xs text-black/45">
                {availableSlots.length
                  ? `${availableSlots.length} ${copy.slotsLeft}`
                  : copy.fullyBooked}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {activeTimeSlots.map((time) => {
                const isBooked = reservation.date && bookedSlots.includes(time)
                const isSelected = reservation.time === time

                return (
                  <button
                    key={time}
                    type="button"
                    disabled={Boolean(isBooked)}
                    onClick={() =>
                      setReservation((current) => ({ ...current, time }))
                    }
                    className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                      isBooked
                        ? 'cursor-not-allowed bg-black/5 text-black/30 line-through'
                        : isSelected
                          ? 'bg-[#10231d] text-white'
                          : 'border border-black/10 text-black/65 hover:border-black/30'
                    }`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
            {!availableSlots.length ? (
              <p className="rounded-[1rem] bg-[#fff4db] px-4 py-3 text-sm text-black/70">
                {copy.fullyBookedHelp}
              </p>
            ) : null}
            {selectedDateIsClosed ? (
              <p className="rounded-[1rem] bg-[#fff4db] px-4 py-3 text-sm text-black/70">
                {copy.closedMonday}
              </p>
            ) : null}
            {brunchUnavailable ? (
              <p className="rounded-[1rem] bg-[#fff4db] px-4 py-3 text-sm text-black/70">
                {copy.brunchWeekend}
              </p>
            ) : null}
          </div>

          {reservation.email && !emailIsValid ? (
            <p className="rounded-[1rem] bg-[#fff4db] px-4 py-3 text-sm text-black/70">
              {copy.emailError}
            </p>
          ) : null}

          <label className="grid gap-2 text-sm font-semibold">
            {copy.specialRequests}
            <textarea
              value={reservation.notes}
              onChange={(event) =>
                setReservation((current) => ({ ...current, notes: event.target.value }))
              }
              className="min-h-28 rounded-[1.5rem] border border-black/10 px-5 py-4 font-normal outline-none focus:border-black/35"
              placeholder={copy.specialRequestsPlaceholder}
            />
          </label>

          <div className="grid gap-3 rounded-[1.5rem] bg-[#f4f0e8] p-4 text-sm text-black/65 md:grid-cols-3">
            <p><strong className="text-black">{copy.deposit}</strong> {copy.depositText}</p>
            <p><strong className="text-black">{copy.hold}</strong> {copy.holdText}</p>
            <p><strong className="text-black">{copy.changes}</strong> {copy.changesText}</p>
          </div>

          <button
            type="submit"
            className="rounded-full bg-[#171714] px-6 py-4 font-semibold text-white transition hover:scale-[1.01]"
          >
            {copy.requestReservation}
          </button>

          {message ? (
            <p className="rounded-[1rem] bg-[#f4f0e8] px-4 py-3 text-sm text-black/65">
              {message}
            </p>
          ) : null}

          {completedReservation ? (
            <div className="rounded-[1.5rem] border border-[#10231d]/10 bg-[#f4f0e8] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#85703a]">
                {copy.bookingConfirmed}
              </p>
              <h3 className="mt-3 text-2xl font-semibold">{completedReservation.id}</h3>
              <p className="mt-3 leading-7 text-black/60">
                {completedReservation.date} · {completedReservation.time} ·{' '}
                {guestLabel(completedReservation.guests)} · {seatingLabel(completedReservation.seating)}
              </p>
              <a
                href={`data:text/calendar;charset=utf-8,BEGIN:VCALENDAR%0AVERSION:2.0%0ASUMMARY:Maison Verde reservation ${completedReservation.id}%0ADESCRIPTION:Reservation for ${completedReservation.name}%0AEND:VCALENDAR`}
                download={`${completedReservation.id}.ics`}
                className="mt-4 inline-flex rounded-full bg-[#10231d] px-5 py-3 text-sm font-semibold text-white"
              >
                {copy.addToCalendar}
              </a>
            </div>
          ) : null}
        </form>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-24 sm:px-6 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#85703a]">
            {copy.manageBooking}
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            {copy.cancelTitle}
          </h2>
        </div>
        <form
          onSubmit={handleCancelReservation}
          className="grid gap-4 rounded-[2rem] bg-white p-5 shadow-sm md:grid-cols-[1fr_1fr_auto] md:p-7"
        >
          <input
            value={cancelId}
            onChange={(event) => setCancelId(event.target.value)}
            className="rounded-full border border-black/10 px-5 py-4 outline-none"
            placeholder={copy.bookingId}
          />
          <input
            value={cancelEmail}
            onChange={(event) => setCancelEmail(event.target.value)}
            className="rounded-full border border-black/10 px-5 py-4 outline-none"
            placeholder="Email"
          />
          <button className="rounded-full bg-[#10231d] px-6 py-4 font-semibold text-white">
            {copy.cancel}
          </button>
        </form>
      </section>

      {selectedDish ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-[#fbf6ec] p-4 shadow-2xl md:p-6">
            <img
              src={selectedDish.image}
              alt={selectedDish.name}
              className="h-72 w-full rounded-[1.5rem] object-cover"
            />
            <div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#85703a]">
                  {categoryLabel(selectedDish.category)}
                </p>
                <h2 className="mt-3 text-4xl font-semibold">{selectedDish.name}</h2>
                <p className="mt-3 leading-7 text-black/60">{selectedDish.detail}</p>
              </div>
              <p className="rounded-full bg-[#10231d] px-5 py-3 font-semibold text-white">
                {selectedDish.price}
              </p>
            </div>
            <div className="mt-6 grid gap-3 text-sm md:grid-cols-3">
              <p className="rounded-[1rem] bg-white p-4"><strong>{copy.allergens}</strong> {copy.allergensText}</p>
              <p className="rounded-[1rem] bg-white p-4"><strong>{copy.diet}</strong> {copy.dietText}</p>
              <p className="rounded-[1rem] bg-white p-4"><strong>{copy.pairing}</strong> {copy.pairingText}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDish(null)}
              className="mt-6 rounded-full bg-[#10231d] px-6 py-4 font-semibold text-white"
            >
              {copy.close}
            </button>
          </div>
        </div>
      ) : null}

      <div className="fixed bottom-4 left-4 right-4 z-30 mx-auto flex max-w-md items-center justify-between gap-3 rounded-full bg-[#171714] p-2 pl-5 text-white shadow-2xl md:hidden">
        <span className="text-sm font-semibold">Maison Verde</span>
        <a href="#reserve" className="rounded-full bg-[#e0c15f] px-4 py-3 text-sm font-semibold text-black">
          {copy.bookTable}
        </a>
      </div>
    </main>
  )
}
