import Image from 'next/image'
import { IMAGES, type Copy } from '../_lib/content'

export default function Story({ copy }: { copy: Copy }) {
  return (
    <section id="story" className="scroll-mt-20 bg-[#f3ede2] py-24 text-[#14281f] md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
        <div className="reveal relative pb-16 pr-12 sm:pr-24">
          <Image
            src={IMAGES.chef}
            alt="Chef plating a dish"
            width={900}
            height={1125}
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="aspect-[4/5] w-full rounded-[2rem] object-cover"
          />
          <Image
            src={IMAGES.room}
            alt="Velvet booth in the dining room"
            width={500}
            height={620}
            sizes="(min-width: 1024px) 18vw, 40vw"
            className="absolute bottom-0 right-0 aspect-[4/5] w-[45%] rounded-[1.5rem] border-[6px] border-[#f3ede2] object-cover shadow-2xl"
          />
        </div>
        <div className="reveal">
          <p className="text-xs uppercase tracking-[0.45em] text-[#8a6d3b]">{copy.storyEyebrow}</p>
          <h2 className="mt-5 font-display text-5xl font-medium leading-[1.02] md:text-6xl">{copy.storyTitle}</h2>
          <p className="mt-7 max-w-lg text-lg leading-8 text-[#14281f]/70">{copy.storyText}</p>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-[#14281f]/15 pt-8">
            {copy.storyStats.map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-5xl text-[#14281f]">{value}</dd>
                <dd className="mt-1 text-xs uppercase tracking-[0.18em] text-[#14281f]/55">{label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 font-display text-2xl italic text-[#8a6d3b]">— Lina Brandt, chef</p>
        </div>
      </div>
    </section>
  )
}
