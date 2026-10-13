'use client'

import { useState, useSyncExternalStore } from 'react'
import { translations, type Language } from '../_lib/content'
import { isClosed, toDateKey } from '../_lib/reservations'
import Gallery from './gallery'
import Hero from './hero'
import MenuSection from './menu-section'
import Reservation from './reservation'
import Reviews from './reviews'
import Signatures from './signatures'
import SiteHeader from './site-header'
import Story from './story'
import Visit from './visit'

const subscribeNothing = () => () => {}
const useHydrated = () => useSyncExternalStore(subscribeNothing, () => true, () => false)

export default function BrandSite() {
  const [language, setLanguage] = useState<Language>('EN')
  const hydrated = useHydrated()
  const copy = translations[language]
  const openToday = hydrated ? !isClosed(toDateKey(new Date())) : null

  return (
    <div lang={language.toLowerCase()} className="bg-[#f3ede2]">
      <SiteHeader copy={copy} language={language} onLanguage={setLanguage} />
      <main>
        <Hero copy={copy} openToday={openToday} />
        <Story copy={copy} />
        <Signatures copy={copy} language={language} />
        <MenuSection copy={copy} language={language} />
        <Gallery copy={copy} language={language} />
        <Reviews copy={copy} language={language} />
        {hydrated ? (
          <Reservation copy={copy} language={language} />
        ) : (
          <section id="reserve" className="min-h-[46rem] bg-[#0f1f1a]" aria-hidden="true" />
        )}
        <Visit copy={copy} />
      </main>
    </div>
  )
}
