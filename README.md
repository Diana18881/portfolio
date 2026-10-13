# Diana Tsymbaliuk — Portfolio

**Live: [diana-portfolio-two-roan.vercel.app](https://diana-portfolio-two-roan.vercel.app)**

![Portfolio homepage](docs/home.jpg)

Personal portfolio site for a Frontend Developer / UI Engineer based in Berlin. The homepage has About, Skills, Projects and Contact sections and links to three working demo apps.

## Features

- English (`/`) and German (`/de`) versions, statically rendered
- **E-commerce Platform** (`/ecommerce`): premium demo store "Luma" with a hero slider, interactive CSS 3D showroom, quick-view pop-ups, product galleries with zoom, wishlist, persistent bag and a three-step checkout. Includes a 30-second 3D video tour (`public/store-tour.mp4`)
- **Dashboard System** (`/dashboard`): charts and tables; orders placed in the shop appear here (shared via `localStorage`)
- **Brand Website** (`/brand`): restaurant site with menu, gallery and table reservations, managed in an admin view (`/brand/admin`)
- Responsive layout, optimized images (`next/image`), Open Graph preview image, CV download

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Deployed on [Vercel](https://vercel.com).
