import Link from 'next/link'
import VideoPreview from './video-preview'

export type Language = 'EN' | 'DE'

const CV_PATH = '/Diana-Tsymbaliuk-Lebenslauf.pdf'
const EMAIL = 'ukrdiana21@gmail.com'
const LINKEDIN = 'https://www.linkedin.com/in/diana-tsymbaliuk-b128b2331'
const GITHUB = 'https://github.com/Diana18881'

const translations = {
  EN: {
    skip: 'Skip to content',
    navAbout: 'About',
    navProjects: 'Projects',
    navResume: 'Resume',
    navContact: 'Contact',
    languageLabel: 'Language',
    available: 'Open to new roles',
    eyebrow: 'Full-Stack Developer · Berlin',
    heroTitle: 'Full-Stack Developer',
    heroSubtitle: 'Web applications from concept to launch.',
    heroText:
      'I build complete web applications: clear, accessible interfaces with React and Next.js, plus the APIs, databases and deployment behind them. Good user experience matters to me as much as clean code.',
    viewProjects: 'View projects',
    downloadCv: 'Download CV (PDF, German)',
    projectsLabel: 'Projects',
    projectsTitle: 'Selected work',
    projectsIntro:
      'Every project here is a working application, not a static mockup. Open it and click through.',
    openProject: 'Open project',
    openCode: 'View code on GitHub',
    projects: [
      {
        title: 'LOGIPAY',
        tag: 'Full-stack · Logistics',
        text: 'Portal for staff, dispatch and payroll in logistics: weekly planning, tours and delivery, live tracking, vehicle records, payroll, reports and an audit log.',
        stack: 'Next.js, React, TypeScript, Drizzle ORM, SQL, MapLibre, PDF generation',
      },
      {
        title: 'E-commerce Platform',
        tag: 'Frontend · Shop',
        text: 'Premium demo store with product pages, quick view, bag and a three-step checkout. Orders show up live in the dashboard.',
        stack: 'Next.js, React, TypeScript, Tailwind CSS',
      },
      {
        title: 'Dashboard System',
        tag: 'Frontend · Data',
        text: 'Admin dashboard for the store: clear KPIs, interactive charts and order management that works on phones.',
        stack: 'Next.js, React, TypeScript, SVG charts',
      },
      {
        title: 'Brand Website',
        tag: 'Frontend · Booking',
        text: 'Fine-dining restaurant site in English and German with menu, gallery and table booking, plus an admin with a 3D floor plan.',
        stack: 'Next.js, React, TypeScript, Tailwind CSS',
      },
    ],
    aboutLabel: 'About me',
    aboutTitle: 'Hi, I’m Diana.',
    aboutLead:
      'Full-stack developer in Berlin with a bachelor’s degree in information systems and a focus on React, TypeScript and Next.js.',
    aboutText: [
      'I take web applications from the first layout to deployment: responsive interfaces, reusable components, REST and GraphQL APIs, databases, tests and release on Vercel or Docker.',
      'Before moving to Germany I worked as a frontend developer at Netpeak Group in Scrum teams. Since then I have earned the telc B2 German certificate and built my own full-stack projects, including LOGIPAY, a portal for the logistics industry.',
      'I care about maintainable code, accessibility (WCAG), privacy and solid web security basics.',
    ],
    resumeLabel: 'Resume',
    experienceLabel: 'Experience',
    experience: [
      {
        period: '01/2026 – 08/2026',
        title: 'Social Media Manager',
        place: 'Dental practice, Berlin',
      },
      {
        period: '2025',
        title: 'German courses & own web projects',
        place: 'Berlin · telc B2 certificate',
      },
      {
        period: '01/2021 – 12/2022',
        title: 'Frontend Developer',
        place: 'Netpeak Group, Ukraine · React, TypeScript, REST/GraphQL, Jest, Cypress',
      },
    ],
    certificatesLabel: 'Certificates',
    certificates: [
      { period: '11/2026', title: 'Core WordPress Development Concepts', place: 'Coursera · Packt' },
      { period: '2025', title: 'German B2', place: 'telc' },
      { period: '2023 – 2024', title: 'Frontend Web Development', place: 'TEL-RAN IT School' },
    ],
    educationLabel: 'Education',
    education: [
      {
        period: '2019 – 2023',
        title: 'Bachelor of Information Systems and Technologies',
        place: 'Igor Sikorsky Kyiv Polytechnic Institute · recognised in Germany',
      },
    ],
    skillsLabel: 'Skills',
    languagesLabel: 'Languages',
    languages: [
      { name: 'German', level: 'B2 (telc)' },
      { name: 'English', level: 'B2' },
      { name: 'Ukrainian', level: 'Native' },
      { name: 'Russian', level: 'Native' },
    ],
    contactLabel: 'Contact',
    contactTitle: 'Let’s build something useful together.',
    contactText: 'I’m looking for a full-time role as a full-stack or frontend developer in Berlin or remote.',
    writeToMe: 'Write to me',
    location: 'Berlin, Germany · remote possible',
    accessibility: 'Accessibility',
    accessibilityHref: '/barrierefreiheit',
  },
  DE: {
    skip: 'Zum Inhalt springen',
    navAbout: 'Über mich',
    navProjects: 'Projekte',
    navResume: 'Lebenslauf',
    navContact: 'Kontakt',
    languageLabel: 'Sprache',
    available: 'Offen für neue Stelle',
    eyebrow: 'Full-Stack-Entwicklerin · Berlin',
    heroTitle: 'Full-Stack-Entwicklerin',
    heroSubtitle: 'Webanwendungen vom Konzept bis zum Launch.',
    heroText:
      'Ich entwickle komplette Webanwendungen: klare, barrierefreie Oberflächen mit React und Next.js und dazu die Schnittstellen, Datenbanken und das Deployment dahinter. Eine gute Nutzererfahrung ist mir genauso wichtig wie sauberer Code.',
    viewProjects: 'Projekte ansehen',
    downloadCv: 'Lebenslauf herunterladen (PDF)',
    projectsLabel: 'Projekte',
    projectsTitle: 'Ausgewählte Arbeiten',
    projectsIntro:
      'Jedes Projekt hier ist eine funktionierende Anwendung, kein statisches Mockup. Einfach öffnen und durchklicken.',
    openProject: 'Projekt öffnen',
    openCode: 'Code auf GitHub ansehen',
    projects: [
      {
        title: 'LOGIPAY',
        tag: 'Full-Stack · Logistik',
        text: 'Portal für Personal, Disposition und Lohnabrechnung in der Logistik: KW-Planung, Touren und Zustellung, Live-Tracking, Fahrzeugakte, Abrechnung, Berichte und Änderungsprotokoll.',
        stack: 'Next.js, React, TypeScript, Drizzle ORM, SQL, MapLibre, PDF-Erzeugung',
      },
      {
        title: 'E-Commerce-Plattform',
        tag: 'Frontend · Shop',
        text: 'Premium-Demoshop mit Produktseiten, Schnellansicht, Warenkorb und dreistufigem Checkout. Bestellungen erscheinen live im Dashboard.',
        stack: 'Next.js, React, TypeScript, Tailwind CSS',
      },
      {
        title: 'Dashboard-System',
        tag: 'Frontend · Daten',
        text: 'Admin-Dashboard für den Shop: verständliche Kennzahlen, interaktive Diagramme und Bestellverwaltung, auch auf dem Smartphone.',
        stack: 'Next.js, React, TypeScript, SVG-Diagramme',
      },
      {
        title: 'Markenwebsite',
        tag: 'Frontend · Reservierung',
        text: 'Restaurant-Website auf Deutsch und Englisch mit Speisekarte, Galerie und Tischreservierung, dazu ein Admin-Bereich mit 3D-Raumplan.',
        stack: 'Next.js, React, TypeScript, Tailwind CSS',
      },
    ],
    aboutLabel: 'Über mich',
    aboutTitle: 'Hallo, ich bin Diana.',
    aboutLead:
      'Full-Stack-Entwicklerin in Berlin mit Bachelorabschluss in Informationssystemen und Schwerpunkt auf React, TypeScript und Next.js.',
    aboutText: [
      'Ich begleite Webanwendungen vom ersten Layout bis zum Deployment: responsive Oberflächen, wiederverwendbare Komponenten, REST- und GraphQL-Schnittstellen, Datenbanken, Tests und Veröffentlichung über Vercel oder Docker.',
      'Vor meinem Umzug nach Deutschland habe ich als Frontend-Entwicklerin bei der Netpeak Group in Scrum-Teams gearbeitet. Seitdem habe ich das telc-Zertifikat Deutsch B2 abgelegt und eigene Full-Stack-Projekte umgesetzt, darunter LOGIPAY, ein Portal für die Logistikbranche.',
      'Mir sind wartbarer Code, Barrierefreiheit (WCAG), Datenschutz und grundlegende Websicherheit wichtig.',
    ],
    resumeLabel: 'Lebenslauf',
    experienceLabel: 'Berufserfahrung',
    experience: [
      {
        period: '01/2026 – 08/2026',
        title: 'Social-Media-Managerin',
        place: 'Zahnarztpraxis, Berlin',
      },
      {
        period: '2025',
        title: 'Deutschkurse & eigene Webprojekte',
        place: 'Berlin · telc-Zertifikat B2',
      },
      {
        period: '01/2021 – 12/2022',
        title: 'Frontend-Entwicklerin',
        place: 'Netpeak Group, Ukraine · React, TypeScript, REST/GraphQL, Jest, Cypress',
      },
    ],
    certificatesLabel: 'Zertifikate',
    certificates: [
      { period: '11/2026', title: 'Core WordPress Development Concepts', place: 'Coursera · Packt' },
      { period: '2025', title: 'Deutsch B2', place: 'telc' },
      { period: '2023 – 2024', title: 'Weiterbildung Frontend Web Development', place: 'TEL-RAN IT School' },
    ],
    educationLabel: 'Ausbildung',
    education: [
      {
        period: '2019 – 2023',
        title: 'Bachelor in Informationssystemen und -technologien',
        place: 'Polytechnisches Institut Kyjiw „Igor Sikorsky“ · in Deutschland anerkannt',
      },
    ],
    skillsLabel: 'Kenntnisse',
    languagesLabel: 'Sprachen',
    languages: [
      { name: 'Deutsch', level: 'B2 (telc)' },
      { name: 'Englisch', level: 'B2' },
      { name: 'Ukrainisch', level: 'Muttersprache' },
      { name: 'Russisch', level: 'Muttersprache' },
    ],
    contactLabel: 'Kontakt',
    contactTitle: 'Lass uns gemeinsam etwas Nützliches bauen.',
    contactText:
      'Ich suche eine Festanstellung als Full-Stack- oder Frontend-Entwicklerin in Berlin oder remote.',
    writeToMe: 'Schreib mir',
    location: 'Berlin, Deutschland · remote möglich',
    accessibility: 'Barrierefreiheit',
    accessibilityHref: '/barrierefreiheit',
  },
}

const projectLinks = [
  { href: 'https://github.com/Diana18881/logipay-portal', external: true, image: '', video: '' },
  { href: '/ecommerce', external: false, image: '/store-tour-card.jpg', video: '/store-tour.mp4' },
  { href: '/dashboard', external: false, image: '/dashboard-tour-card.jpg', video: '/dashboard-tour-v2.mp4' },
  { href: '/brand', external: false, image: '/brand-tour-card.jpg', video: '/brand-tour.mp4' },
]

const skills = [
  { group: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Vue / Nuxt', 'Tailwind CSS', 'Redux'] },
  { group: 'Backend & APIs', items: ['Node.js', 'Express', 'Python / Django', 'PHP', 'REST', 'GraphQL'] },
  { group: 'Data & DevOps', items: ['PostgreSQL', 'MySQL', 'Drizzle ORM', 'Docker', 'Git', 'CI/CD', 'Vercel'] },
  { group: 'Design, CMS & Team', items: ['Figma', 'WordPress', 'Jest', 'Cypress', 'Jira', 'Confluence', 'Scrum'] },
]

const label = 'text-xs font-medium uppercase tracking-[0.3em] text-[#d4af37]'
const sectionWrap = 'mx-auto max-w-6xl px-6 md:px-10'

function Logo() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="10" fill="none" stroke="#d4af37" strokeWidth="1.5" />
      <text
        x="20"
        y="25.5"
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        letterSpacing="1"
        fill="white"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
      >
        DT
      </text>
    </svg>
  )
}

function AvailableBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-300">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {text}
    </span>
  )
}

function TimelineList({ items }: { items: { period: string; title: string; place: string }[] }) {
  return (
    <ol className="relative space-y-8 border-l border-white/10 pl-6">
      {items.map((item) => (
        <li key={item.title} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border border-[#d4af37] bg-[#0d0d0d]"
          />
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/55">{item.period}</p>
          <p className="mt-1.5 font-medium text-white">{item.title}</p>
          <p className="mt-1 text-sm leading-6 text-white/55">{item.place}</p>
        </li>
      ))}
    </ol>
  )
}

export default function HomePage({ language }: { language: Language }) {
  const copy = translations[language]
  const navLinks = [
    { href: '#projects', label: copy.navProjects },
    { href: '#about', label: copy.navAbout },
    { href: '#resume', label: copy.navResume },
    { href: '#contact', label: copy.navContact },
  ]

  const languageToggle = (
    <div role="group" aria-label={copy.languageLabel} className="flex rounded-full border border-white/20 p-0.5 text-xs font-medium">
      {(['DE', 'EN'] as const).map((option) => (
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

  return (
    <div lang={language.toLowerCase()} className="min-h-screen bg-[#0d0d0d] text-white">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-[#d4af37] px-4 py-2 text-sm font-medium text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {copy.skip}
      </a>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md">
        <div className={`${sectionWrap} flex h-16 items-center justify-between gap-4`}>
          <a href="#main" className="flex items-center gap-3" aria-label="Diana Tsymbaliuk">
            <Logo />
            <span className="hidden text-xs font-medium uppercase tracking-[0.3em] text-white/80 sm:inline">
              Diana Tsymbaliuk
            </span>
          </a>
          <nav aria-label="Main" className="hidden items-center gap-7 text-xs font-medium uppercase tracking-[0.2em] text-white/70 lg:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex">
              <AvailableBadge text={copy.available} />
            </span>
            {languageToggle}
          </div>
        </div>
        <nav aria-label="Mobile" className={`${sectionWrap} flex gap-5 overflow-x-auto pb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/70 lg:hidden`}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="shrink-0 hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="main" tabIndex={-1} className="outline-none">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div aria-hidden="true" className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#d4af37]/10 blur-3xl" />
          <div className={`${sectionWrap} relative py-24 md:py-32`}>
            <div className="md:hidden">
              <AvailableBadge text={copy.available} />
            </div>
            <p className={`${label} mt-6 md:mt-0`}>{copy.eyebrow}</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              {copy.heroTitle}
            </h1>
            <p className="mt-6 text-2xl font-light text-white/80 md:text-3xl">{copy.heroSubtitle}</p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/60 md:text-lg">{copy.heroText}</p>
            <div className="mt-10 flex flex-wrap gap-4">
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
        </section>

        {/* Projects */}
        <section id="projects" aria-labelledby="projects-title" className={`${sectionWrap} scroll-mt-24 py-24`}>
          <p className={label}>{copy.projectsLabel}</p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 id="projects-title" className="text-3xl font-semibold md:text-5xl">
              {copy.projectsTitle}
            </h2>
            <p className="max-w-md leading-7 text-white/60">{copy.projectsIntro}</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {projectLinks.map((project, index) => {
              const item = copy.projects[index]
              return (
                <article
                  key={project.href}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:border-white/25"
                >
                  <div className="overflow-hidden">
                    {project.video ? (
                      <VideoPreview
                        src={project.video}
                        poster={project.image}
                        label={item.title}
                        className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex aspect-[16/10] w-full flex-col justify-end bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.35),transparent_55%),linear-gradient(135deg,#1a1a1a,#0d0d0d)] p-8 transition duration-700 group-hover:scale-105"
                      >
                        <p className="text-5xl font-semibold tracking-tight md:text-6xl">LOGIPAY</p>
                        <p className="mt-3 text-sm uppercase tracking-[0.25em] text-white/50">
                          {item.tag}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/55">{item.tag}</p>
                    <h3 className="mt-2 text-2xl font-semibold">{item.title}</h3>
                    <p className="mt-3 leading-7 text-white/65">{item.text}</p>
                    <p className="mt-4 text-sm text-white/55">{item.stack}</p>
                    {project.external ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-auto inline-flex pt-6 text-sm font-medium text-[#d4af37] hover:underline"
                      >
                        {copy.openCode} ↗
                      </a>
                    ) : (
                      <Link href={project.href} className="mt-auto inline-flex pt-6 text-sm font-medium text-[#d4af37] hover:underline">
                        {copy.openProject} →
                      </Link>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* About */}
        <section id="about" aria-labelledby="about-title" className="scroll-mt-24 border-y border-white/10 bg-white/[0.02]">
          <div className={`${sectionWrap} grid gap-12 py-24 lg:grid-cols-[0.9fr_1.1fr]`}>
            <div>
              <p className={label}>{copy.aboutLabel}</p>
              <h2 id="about-title" className="mt-4 text-3xl font-semibold md:text-5xl">
                {copy.aboutTitle}
              </h2>
              <p className="mt-6 text-xl font-light leading-8 text-white/80">{copy.aboutLead}</p>
            </div>
            <div className="space-y-5 leading-7 text-white/65">
              {copy.aboutText.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Resume */}
        <section id="resume" aria-labelledby="resume-title" className={`${sectionWrap} scroll-mt-24 py-24`}>
          <p className={label}>{copy.resumeLabel}</p>
          <h2 id="resume-title" className="sr-only">
            {copy.resumeLabel}
          </h2>

          <div className="mt-10 grid gap-14 lg:grid-cols-3">
            <div>
              <h3 className="mb-8 text-lg font-semibold">{copy.experienceLabel}</h3>
              <TimelineList items={copy.experience} />
            </div>
            <div>
              <h3 className="mb-8 text-lg font-semibold">{copy.certificatesLabel}</h3>
              <TimelineList items={copy.certificates} />
            </div>
            <div>
              <h3 className="mb-8 text-lg font-semibold">{copy.educationLabel}</h3>
              <TimelineList items={copy.education} />
              <h3 className="mb-6 mt-12 text-lg font-semibold">{copy.languagesLabel}</h3>
              <ul className="grid grid-cols-2 gap-3">
                {copy.languages.map((item) => (
                  <li key={item.name} className="rounded-2xl border border-white/10 p-4">
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-white/50">{item.level}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="mb-8 mt-20 text-lg font-semibold">{copy.skillsLabel}</h3>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((group) => (
              <div key={group.group}>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/55">{group.group}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <li key={skill} className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/80">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 border-t border-white/10 bg-white/[0.02]">
          <div className={`${sectionWrap} grid gap-12 py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end`}>
            <div>
              <p className={label}>{copy.contactLabel}</p>
              <h2 id="contact-title" className="mt-4 text-3xl font-semibold md:text-5xl">
                {copy.contactTitle}
              </h2>
              <p className="mt-6 max-w-xl leading-7 text-white/65">{copy.contactText}</p>
            </div>
            <div className="flex flex-wrap gap-4 lg:justify-end">
              <a
                href={`mailto:${EMAIL}`}
                className="rounded-full bg-[#d4af37] px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.02]"
              >
                {copy.writeToMe}
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:border-white/60"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className={`${sectionWrap} grid gap-10 py-14 text-sm text-white/55 md:grid-cols-3`}>
          <div>
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/80">Diana Tsymbaliuk</span>
            </div>
            <p className="mt-4">{copy.heroTitle}</p>
            <p className="mt-1">{copy.location}</p>
          </div>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="space-y-2">
            <li>
              <a href={`mailto:${EMAIL}`} className="hover:text-white">
                {EMAIL}
              </a>
            </li>
            <li>
              <a href={GITHUB} target="_blank" rel="noreferrer" className="hover:text-white">
                GitHub ↗
              </a>
            </li>
            <li>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="hover:text-white">
                LinkedIn ↗
              </a>
            </li>
            <li>
              <Link href={copy.accessibilityHref} className="hover:text-white">
                {copy.accessibility}
              </Link>
            </li>
          </ul>
        </div>
        <p className={`${sectionWrap} pb-10 text-xs text-white/50`}>© {new Date().getFullYear()} Diana Tsymbaliuk</p>
      </footer>
    </div>
  )
}
