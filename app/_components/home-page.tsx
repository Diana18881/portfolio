import Image from 'next/image'
import Link from 'next/link'
import VideoPreview from './video-preview'

export type Language = 'EN' | 'DE'

const translations = {
  EN: {
    navAbout: 'About',
    navProjects: 'Projects',
    navSkills: 'Skills',
    navContact: 'Contact',
    languageLabel: 'Language',
    eyebrow: 'FRONTEND DEVELOPER • UI ENGINEER • BERLIN',
    heroTitle: 'Frontend Developer building polished web interfaces.',
    heroText:
      'I build responsive, modern interfaces with React, Next.js and TypeScript, with an eye for detail and motion. Based in Berlin and open to frontend roles.',
    viewProjects: 'View projects',
    downloadCv: 'Download CV (PDF, German)',
    focus: 'Focus',
    focusStack: 'years of frontend experience with React / Next.js, TypeScript and responsive UI',
    focusUi: 'clean layouts, animations, accessible components',
    focusBerlin: 'open to full-time roles and freelance projects',
    aboutLabel: 'About',
    aboutTitle: 'Frontend developer with a strong eye for UI details.',
    aboutTextOne:
      'I enjoy turning ideas into interfaces people actually use: product catalogs and checkout flows, data dashboards, booking forms and the admin tools behind them. Every project on this site is a working app, not a static mockup.',
    aboutTextTwo:
      'With a bachelor’s degree in information systems and around three years of frontend experience, I take websites from the first layout to deployment: responsive UI, components, APIs, data, tests and release. I care about maintainable code, accessibility (WCAG), privacy and solid web security basics.',
    educationLabel: 'Education',
    education: [
      {
        title: 'Bachelor of Information Systems and Technologies',
        place: 'Igor Sikorsky Kyiv Polytechnic Institute · recognised in Germany',
        period: '2019 – 2023',
      },
      {
        title: 'Frontend Web Development, further training',
        place: 'TEL-RAN IT School, Germany',
        period: '2023 – 2024',
      },
    ],
    languagesLabel: 'Languages',
    languages: [
      { name: 'German', level: 'B2 (telc)' },
      { name: 'English', level: 'B2' },
      { name: 'Ukrainian', level: 'Native' },
      { name: 'Russian', level: 'Native' },
    ],
    toolkitLabel: 'Toolkit',
    skillsLabel: 'Skills',
    features: [
      {
        title: 'Clean UI',
        text: 'Thoughtful layouts, clear hierarchy and careful visual details.',
      },
      {
        title: 'Responsive',
        text: 'Mobile-first design that works on phones, tablets and desktops without compromises.',
      },
      {
        title: 'Performance',
        text: 'Optimized loading, smooth animations and fast interfaces.',
      },
    ],
    projectsLabel: 'Projects',
    selectedWork: 'Selected Work',
    projectsIntro:
      'A selection of frontend projects focused on responsive UI, clean component structure, performance and smooth user experience.',
    projects: [
      {
        title: 'E-commerce Platform',
        text: 'Premium demo store with product pages, quick view, bag and three-step checkout. Orders show up live in the dashboard.',
      },
      {
        title: 'Dashboard System',
        text: 'Admin dashboard for the Luma store: clear KPIs, interactive charts and order management that works on phones. Live orders from the shop appear instantly.',
      },
      {
        title: 'Brand Website',
        text: 'Fine-dining restaurant site in English and German: signature dishes, menu, gallery and a three-step table booking, plus an admin with a 3D floor plan.',
      },
    ],
    openCase: 'Open project',
    contactLabel: 'Contact',
    contactTitle: 'Let’s build something useful together.',
    contactText:
      'I’m open to frontend developer roles and freelance projects in Berlin or remote.',
    writeToMe: 'Write to me',
  },
  DE: {
    navAbout: 'Über mich',
    navProjects: 'Projekte',
    navSkills: 'Kompetenzen',
    navContact: 'Kontakt',
    languageLabel: 'Sprache',
    eyebrow: 'FRONTEND-ENTWICKLERIN • UI-ENTWICKLUNG • BERLIN',
    heroTitle: 'Frontend-Entwicklerin für durchdachte Weboberflächen.',
    heroText:
      'Ich entwickle responsive, moderne Benutzeroberflächen mit React, Next.js und TypeScript, mit Liebe zum Detail und zu Animationen. Ich lebe in Berlin und suche eine Stelle als Frontend-Entwicklerin.',
    viewProjects: 'Projekte ansehen',
    downloadCv: 'Lebenslauf herunterladen (PDF)',
    focus: 'Fokus',
    focusStack: 'Jahre Erfahrung in der Frontend-Entwicklung mit React / Next.js, TypeScript und responsivem UI',
    focusUi: 'klare Layouts, Animationen, barrierefreie Komponenten',
    focusBerlin: 'offen für Festanstellung und Freelance-Projekte',
    aboutLabel: 'Über mich',
    aboutTitle: 'Frontend-Entwicklerin mit Blick fürs Detail.',
    aboutTextOne:
      'Ich verwandle Ideen in Oberflächen, die Menschen wirklich nutzen: Produktkataloge und Checkouts, Daten-Dashboards, Buchungsformulare und die Admin-Tools dahinter. Jedes Projekt auf dieser Seite ist eine funktionierende Anwendung, kein statisches Mockup.',
    aboutTextTwo:
      'Mit einem Bachelorabschluss in Informationssystemen und rund drei Jahren Erfahrung in der Frontend-Entwicklung begleite ich Websites vom ersten Layout bis zum Deployment: responsive Oberflächen, Komponenten, Schnittstellen, Daten, Tests und Veröffentlichung. Mir sind wartbarer Code, Barrierefreiheit (WCAG), Datenschutz und grundlegende Websicherheit wichtig.',
    educationLabel: 'Ausbildung',
    education: [
      {
        title: 'Bachelor in Informationssystemen und -technologien',
        place: 'Polytechnisches Institut Kyjiw „Igor Sikorsky“ · in Deutschland anerkannt',
        period: '2019 – 2023',
      },
      {
        title: 'Weiterbildung Frontend Web Development',
        place: 'TEL-RAN IT School, Deutschland',
        period: '2023 – 2024',
      },
    ],
    languagesLabel: 'Sprachen',
    languages: [
      { name: 'Deutsch', level: 'B2 (telc)' },
      { name: 'Englisch', level: 'B2' },
      { name: 'Ukrainisch', level: 'Muttersprache' },
      { name: 'Russisch', level: 'Muttersprache' },
    ],
    toolkitLabel: 'Werkzeuge',
    skillsLabel: 'Kompetenzen',
    features: [
      {
        title: 'Klares UI',
        text: 'Durchdachte Layouts, klare Hierarchie und sorgfältige visuelle Details.',
      },
      {
        title: 'Responsive',
        text: 'Mobile-first-Design für Smartphone, Tablet und Desktop ohne Kompromisse.',
      },
      {
        title: 'Performance',
        text: 'Schnelle Ladezeiten, flüssige Animationen und reaktionsschnelle Oberflächen.',
      },
    ],
    projectsLabel: 'Projekte',
    selectedWork: 'Ausgewählte Projekte',
    projectsIntro:
      'Eine Auswahl meiner Frontend-Projekte mit Fokus auf responsive Oberflächen, saubere Komponentenstruktur, Performance und eine angenehme Nutzererfahrung.',
    projects: [
      {
        title: 'E-Commerce-Plattform',
        text: 'Premium-Demoshop mit Produktseiten, Schnellansicht, Warenkorb und dreistufigem Checkout. Bestellungen erscheinen live im Dashboard.',
      },
      {
        title: 'Dashboard-System',
        text: 'Admin-Dashboard für den Luma-Shop: verständliche Kennzahlen, interaktive Diagramme und Bestellverwaltung, auch auf dem Smartphone. Live-Bestellungen aus dem Shop erscheinen sofort.',
      },
      {
        title: 'Markenwebsite',
        text: 'Restaurant-Website auf Deutsch und Englisch: Signature-Gerichte, Speisekarte, Galerie und Tischreservierung in drei Schritten, dazu ein Admin-Bereich mit 3D-Raumplan.',
      },
    ],
    openCase: 'Projekt ansehen',
    contactLabel: 'Kontakt',
    contactTitle: 'Lass uns gemeinsam etwas Nützliches bauen.',
    contactText:
      'Ich bin offen für Stellen als Frontend-Entwicklerin und für Freelance-Projekte, in Berlin oder remote.',
    writeToMe: 'Schreib mir',
  },
}

const projects = [
  {
    href: '/ecommerce',
    image: '/store-tour-card.jpg',
    video: '/store-tour.mp4',
  },
  {
    href: '/dashboard',
    image: '/dashboard-tour-card.jpg',
    video: '/dashboard-tour-v2.mp4',
  },
  {
    href: '/brand',
    image: '/brand-card.jpg',
  },
]

const toolkit = [
  { group: 'Frontend', items: 'React, Next.js, TypeScript, JavaScript, Tailwind CSS, Redux' },
  { group: 'Backend & Data', items: 'Node.js, Express, REST, GraphQL, SQL, PostgreSQL' },
  { group: 'Quality', items: 'Jest, Cypress, React Testing Library, Git, CI/CD, Vercel' },
]

const CV_PATH = '/Diana-Tsymbaliuk-Lebenslauf.pdf'

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
  const languageToggle = (
    <div
      role="group"
      aria-label={copy.languageLabel}
      className="flex rounded-full border border-white/20 p-0.5 text-xs font-medium"
    >
      {(['EN', 'DE'] as const).map((option) => (
        <Link
          key={option}
          href={option === 'EN' ? '/' : '/de'}
          hrefLang={option.toLowerCase()}
          aria-current={option === language ? 'page' : undefined}
          className={`rounded-full px-3 py-1 transition ${
            option === language ? 'bg-white text-black' : 'text-white/60 hover:text-white'
          }`}
        >
          {option}
        </Link>
      ))}
    </div>
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
                <a
                  href={CV_PATH}
                  download
                  className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:border-white/60"
                >
                  {copy.downloadCv}
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

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">{copy.educationLabel}</p>
            <ul className="mt-6 space-y-6">
              {copy.education.map((item) => (
                <li key={item.title}>
                  <p className="text-sm text-[#d4af37]">{item.period}</p>
                  <p className="mt-1 font-medium">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-white/55">{item.place}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">{copy.languagesLabel}</p>
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {copy.languages.map((item) => (
                <li key={item.name} className="rounded-2xl bg-white/[0.04] p-4">
                  <p className="font-medium">{item.name}</p>
                  <p className="mt-1 text-sm text-white/55">{item.level}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">{copy.toolkitLabel}</p>
            <ul className="mt-6 space-y-5">
              {toolkit.map((item) => (
                <li key={item.group}>
                  <p className="font-medium">{item.group}</p>
                  <p className="mt-1 text-sm leading-6 text-white/55">{item.items}</p>
                </li>
              ))}
            </ul>
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
                {project.video ? (
                  <VideoPreview
                    src={project.video}
                    poster={project.image}
                    label={copy.projects[index].title}
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    width={1200}
                    height={800}
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    src={project.image}
                    alt={copy.projects[index].title}
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-7">
                <h3 className="text-2xl font-semibold">{copy.projects[index].title}</h3>
                <p className="mt-3 leading-7 text-white/70">{copy.projects[index].text}</p>
                <Link href={project.href} className="mt-6 inline-flex text-sm text-[#d4af37]">
                  {copy.openCase} →
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
            <a
              href={CV_PATH}
              download
              className="ml-3 mt-8 inline-flex rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:border-white/60"
            >
              CV
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
