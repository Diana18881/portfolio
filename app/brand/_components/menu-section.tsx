'use client'

import Image from 'next/image'
import { useState } from 'react'
import { IMAGES, menu, type Copy, type Language, type MenuCategory } from '../_lib/content'

const CATEGORIES: MenuCategory[] = ['Dinner', 'Wine', 'Brunch', 'Dessert']

export default function MenuSection({ copy, language }: { copy: Copy; language: Language }) {
  const [category, setCategory] = useState<MenuCategory>('Dinner')
  const items = menu.filter((item) => item.category === category)
  const activeIndex = CATEGORIES.indexOf(category)

  return (
    <section id="menu" className="scroll-mt-20 bg-[#f3ede2] py-24 text-[#14281f] md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1fr_22rem]">
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-[#8a6d3b]">{copy.menuEyebrow}</p>
          <h2 className="mt-5 font-display text-5xl font-medium md:text-6xl">{copy.menuTitle}</h2>

          <div role="tablist" aria-label={copy.menuEyebrow} className="relative mt-10 grid grid-cols-4 border-b border-[#14281f]/15">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={category === item}
                aria-controls="menu-panel"
                onClick={() => setCategory(item)}
                className={`pb-4 text-sm transition sm:text-base ${category === item ? 'text-[#14281f]' : 'text-[#14281f]/45 hover:text-[#14281f]'}`}
              >
                {copy.categories[item]}
              </button>
            ))}
            <span
              aria-hidden="true"
              className="absolute -bottom-px h-0.5 w-1/4 bg-[#c8a46a] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(${activeIndex * 100}%)` }}
            />
          </div>

          <ul id="menu-panel" role="tabpanel" key={category} className="mt-4 divide-y divide-[#14281f]/10">
            {items.map((item, index) => (
              <li
                key={item.name}
                className="py-6 motion-safe:animate-[fade-up_0.6s_ease-out_both]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="flex items-baseline gap-4">
                  <h3 className="font-display text-2xl font-medium md:text-3xl">{item.name}</h3>
                  {item.tags ? (
                    <span className="flex gap-1">
                      {item.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-[#14281f]/20 px-1.5 py-0.5 text-[0.6rem] font-medium tracking-wider text-[#14281f]/60">
                          {tag}
                        </span>
                      ))}
                    </span>
                  ) : null}
                  <span aria-hidden="true" className="mb-1.5 flex-1 border-b border-dotted border-[#14281f]/25" />
                  <span className="font-display text-2xl">€{item.price}</span>
                </div>
                <p className="mt-1.5 text-[#14281f]/60">{item.detail[language]}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs tracking-wide text-[#14281f]/50">{copy.legend}</p>
        </div>

        <aside className="reveal relative self-start overflow-hidden rounded-[2rem] bg-[#14281f] text-[#f3ede2] lg:sticky lg:top-28">
          <Image src={IMAGES.wine} alt="" width={700} height={500} sizes="22rem" className="aspect-[4/3] w-full object-cover opacity-80" />
          <div className="p-7">
            <p className="text-xs uppercase tracking-[0.4em] text-[#c8a46a]">7 ✦</p>
            <h3 className="mt-3 font-display text-4xl">{copy.tastingTitle}</h3>
            <p className="mt-3 leading-7 text-white/65">{copy.tastingText}</p>
            <p className="mt-5 border-t border-white/10 pt-5 font-display text-xl text-[#e3cf9f]">{copy.tastingPrice}</p>
            <a href="#reserve" className="mt-6 inline-flex rounded-full bg-[#c8a46a] px-6 py-3 text-sm font-medium text-[#0f1f1a] transition hover:bg-[#e0c48e]">
              {copy.reserve}
            </a>
          </div>
        </aside>
      </div>
    </section>
  )
}
