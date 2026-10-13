import Image from 'next/image'
import Link from 'next/link'

export type Language = 'EN' | 'DE'

const translations = {
  EN: {
    navAbout: 'About',
    navProjects: 'Projects',
    navSkills: 'Skills',
    navContact: 'Contact',
    eyebrow: 'FRONTEND DEVELOPER • UI ENGINEER • BERLIN',
    heroTitle: 'Frontend Developer building polished web interfaces.',
    heroText:
      'I build responsive, modern interfaces with React, Next.js, TypeScript and motion-focused UI. Based in Berlin and open to frontend / UI engineer roles.',
    viewProjects: 'View projects',
    focus: 'Focus',
    focusStack: 'React / Next.js, TypeScript, responsive UI, performance',
    focusUi: 'clean layouts, animations, accessible components',
    focusBerlin: 'open to frontend roles, freelance and full-time',
    aboutLabel: 'About',
    aboutTitle: 'Frontend developer with a strong eye for UI details.',
    aboutTextOne:
      'I enjoy turning ideas into interfaces people actually use: product catalogs and checkout flows, data dashboards, booking forms and the admin tools behind them. Every project on this site is a working app, not a static mockup.',
    aboutTextTwo:
      'I create responsive, accessible and visually polished interfaces with React, Next.js and TypeScript. My focus is clean component structure, smooth interactions, performance and layouts that feel sharp on both desktop and mobile.',
    skillsLabel: 'Skills',
    features: [
      {
        title: 'Clean UI',
        text: 'Thoughtful layouts, clear hierarchy and careful visual details.',
      },
      {
        title: 'Responsive',
        text: 'Responsive design for mobile, tablet and desktop without compromises.',
      },
      {
        title: 'Performance',
        text: 'Optimized loading, smooth animations and high performance.',
      },
    ],
    projectsLabel: 'Projects',
    selectedWork: 'Selected Work',
    projectsIntro:
      'A selection of frontend projects focused on responsive UI, clean component structure, performance and smooth user experience.',
    projects: [
      {
        title: 'E-commerce Platform',
        text: 'Product catalog, cart flow, filters and responsive shopping experience built with modern frontend patterns.',
      },
      {
        title: 'Dashboard System',
        text: 'Component-based approach, charts, tables and user-friendly scenarios.',
      },
      {
        title: 'Brand Website',
        text: 'Landing page with atmosphere, strong typography and content that sells.',
      },
    ],
    openCase: 'Open case',
    contactLabel: 'Contact',
    contactTitle: 'Let’s build something useful together.',
    contactText:
      'I’m open to frontend developer, UI engineer and freelance opportunities in Berlin and remote.',
    writeToMe: 'Write to me',
    switchLanguage: 'Switch to German',
  },
  DE: {
    navAbout: 'Über mich',
    navProjects: 'Projekte',
    navSkills: 'Skills',
    navContact: 'Kontakt',
    eyebrow: 'FRONTEND DEVELOPER • UI ENGINEER • BERLIN',
    heroTitle: 'Frontend Developerin für hochwertige Web Interfaces.',
    heroText:
      'Ich entwickle responsive, moderne Interfaces mit React, Next.js, TypeScript und motion-fokussierter UI. Ich lebe in Berlin und bin offen für Frontend- und UI-Engineer-Rollen.',
    viewProjects: 'Projekte ansehen',
    focus: 'Fokus',
    focusStack: 'React / Next.js, TypeScript, responsive UI, Performance',
    focusUi: 'klare Layouts, Animationen, zugängliche Komponenten',
    focusBerlin: 'offen für Frontend-Rollen, Freelance und Vollzeit',
    aboutLabel: 'Über mich',
    aboutTitle: 'Frontend Developerin mit starkem Blick für UI Details.',
    aboutTextOne:
      'Ich verwandle Ideen gern in Interfaces, die wirklich genutzt werden: Produktkataloge und Checkout-Flows, Daten-Dashboards, Buchungsformulare und die Admin-Tools dahinter. Jedes Projekt auf dieser Seite ist eine funktionierende App, kein statisches Mockup.',
    aboutTextTwo:
      'Ich erstelle responsive, zugängliche und visuell präzise Interfaces mit React, Next.js und TypeScript. Mein Fokus liegt auf sauberer Komponentenstruktur, smoothen Interaktionen, Performance und Layouts, die auf Desktop und Mobile stark wirken.',
    skillsLabel: 'Skills',
    features: [
      {
        title: 'Clean UI',
        text: 'Durchdachte Layouts, klare Hierarchie und sorgfältige visuelle Details.',
      },
      {
        title: 'Responsive',
        text: 'Responsive Design für Mobile, Tablet und Desktop ohne Kompromisse.',
      },
      {
        title: 'Performance',
        text: 'Optimiertes Laden, flüssige Animationen und hohe Geschwindigkeit.',
      },
    ],
    projectsLabel: 'Projekte',
    selectedWork: 'Ausgewählte Arbeiten',
    projectsIntro:
      'Eine Auswahl an Frontend-Projekten mit Fokus auf responsive UI, saubere Komponentenstruktur, Performance und gute User Experience.',
    projects: [
      {
        title: 'E-Commerce Plattform',
        text: 'Produktkatalog, Warenkorb, Filter und responsive Shopping Experience mit modernen Frontend-Patterns.',
      },
      {
        title: 'Dashboard System',
        text: 'Komponentenbasierter Ansatz mit Charts, Tabellen und nutzerfreundlichen Szenarien.',
      },
      {
        title: 'Brand Website',
        text: 'Landingpage mit Atmosphäre, starker Typografie und Content, der verkauft.',
      },
    ],
    openCase: 'Case öffnen',
    contactLabel: 'Kontakt',
    contactTitle: 'Lass uns etwas Nützliches bauen.',
    contactText:
      'Ich bin offen für Frontend Developer, UI Engineer und Freelance Opportunities in Berlin oder remote.',
    writeToMe: 'Schreib mir',
    switchLanguage: 'Zu Englisch wechseln',
  },
}

const projects = [
  {
    href: '/ecommerce',
    image:
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1200&auto=format&fit=crop',
  },
  {
    href: '/dashboard',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
  },
  {
    href: '/brand',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
  },
]

const contacts = [
  { label: 'Email', value: 'ukrdiana21@gmail.com', href: 'mailto:ukrdiana21@gmail.com' },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/diana-tsymbaliuk-b128b2331',
    href: 'https://www.linkedin.com/in/diana-tsymbaliuk-b128b2331',
  },
  { label: 'GitHub', value: 'github.com/Diana18881', href: 'https://github.com/Diana18881' },
]

export default function HomePage({ language }: { language: Language }) {
  const copy = translations[language]
  const otherLanguage = language === 'EN' ? 'DE' : 'EN'
  const languageToggle = (
    <Link
      href={otherLanguage === 'EN' ? '/' : '/de'}
      hrefLang={otherLanguage.toLowerCase()}
      aria-label={copy.switchLanguage}
      className="rounded-full border border-white/20 px-3 py-1 text-sm text-white hover:border-white/50"
    >
      {otherLanguage}
    </Link>
  )
  const navLinks = [
    { href: '#about', label: copy.navAbout },
    { href: '#projects', label: copy.navProjects },
    { href: '#skills', label: copy.navSkills },
    { href: '#contact', label: copy.navContact },
  ]

  return (
    <main lang={language.toLowerCase()} className="min-h-screen bg-[#0d0d0d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-[#d4af37]/15 blur-3xl" />
          <div className="absolute -right-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-white/[0.06] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d]" />
        </div>

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-between px-6 py-8 md:px-10 lg:px-16">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm uppercase tracking-[0.35em] text-white/70">
                Diana Tsymbaliuk
              </p>
              <div className="md:hidden">{languageToggle}</div>
            </div>
            <nav className="hidden items-center gap-8 text-sm text-white/80 md:flex">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              ))}
              {languageToggle}
            </nav>
            <nav className="flex flex-wrap gap-3 text-sm text-white/80 md:hidden">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-white/15 px-3 py-2 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </header>
          <div className="grid items-end gap-10 py-20 lg:grid-cols-[1.4fr_0.6fr] lg:py-28">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#d4af37]">
                {copy.eyebrow}
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">
                {copy.heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
                {copy.heroText}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#projects"
                  className="rounded-full bg-[#d4af37] px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.02]"
                >
                  {copy.viewProjects}
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.35em] text-white/55">{copy.focus}</p>
              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-4xl font-semibold">3+</p>
                  <p className="mt-2 text-white/70">
                    {copy.focusStack}
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-semibold">UI</p>
                  <p className="mt-2 text-white/70">
                    {copy.focusUi}
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-semibold">Berlin</p>
                  <p className="mt-2 text-white/70">
                    {copy.focusBerlin}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#d4af37]">{copy.aboutLabel}</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              {copy.aboutTitle}
            </h2>
          </div>
          <div className="space-y-5 leading-7 text-white/75">
            <p>
              {copy.aboutTextOne}
            </p>
            <p>
              {copy.aboutTextTwo}
            </p>
          </div>
        </div>
      </section>

      <section id="skills" className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-16">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d4af37]">{copy.skillsLabel}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {copy.features.map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-black/30 p-8"
              >
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 leading-7 text-white/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#d4af37]">{copy.projectsLabel}</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">{copy.selectedWork}</h2>
          </div>
          <p className="max-w-xl leading-7 text-white/70">
            {copy.projectsIntro}
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project.href}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]"
            >
              <div className="overflow-hidden">
                <Image
                  width={1200}
                  height={800}
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  src={project.image}
                  alt={copy.projects[index].title}
                  className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-7">
                <h3 className="text-2xl font-semibold">{copy.projects[index].title}</h3>
                <p className="mt-3 leading-7 text-white/70">{copy.projects[index].text}</p>
                <Link href={project.href} className="mt-6 inline-flex text-sm text-[#d4af37]">
 →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:px-10 lg:grid-cols-[1fr_0.9fr] lg:px-16">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#d4af37]">{copy.contactLabel}</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              {copy.contactTitle}
            </h2>
            <p className="mt-6 max-w-xl leading-7 text-white/70">
              {copy.contactText}
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-8">
            <ul className="space-y-5 text-white/75">
              {contacts.map((contact) => (
                <li key={contact.label}>
                  {contact.label}:{' '}
                  <a
                    href={contact.href}
                    target={contact.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="break-all text-white underline decoration-white/30 underline-offset-4 hover:decoration-[#d4af37]"
                  >
                    {contact.value}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="mailto:ukrdiana21@gmail.com"
              className="mt-8 inline-flex rounded-full bg-[#d4af37] px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.02]"
            >
              {copy.writeToMe}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
