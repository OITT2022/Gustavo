# Gallery Website — Gustavo Bar Valenzuela Fine Art

A production-ready art gallery and portfolio website built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

### Public Site
- Elegant homepage with hero image and featured artworks
- Gallery pages organized by period and category
- Individual artwork detail pages with image gallery
- "For Sale" page with pricing and availability
- Contact form with server-side storage
- SEO metadata, Open Graph, sitemap, and robots.txt
- Fully responsive, mobile-first design

### Admin Dashboard
- Secure credential-based login (NextAuth.js v5)
- Full CRUD for artworks, categories, and pages
- Contact message inbox with read/unread tracking
- Image upload via Cloudinary
- Site settings management
- Dashboard with statistics overview

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v5
- **Images:** Cloudinary (unsigned upload)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- Cloudinary account (optional, for image uploads)

### Setup

1. **Clone and install:**
   ```bash
   cd gallery-website
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your values.

3. **Start the database:**
   ```bash
   docker compose up -d
   ```

4. **Run migrations and seed:**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the dev server:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   - Public site: http://localhost:3000
   - Admin: http://localhost:3000/admin/login
   - Default credentials: `admin@gallery.com` / `changeme123`

### Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |

## Project Structure

```
src/
├── app/           # Next.js App Router pages
│   ├── (admin)/   # Admin dashboard (protected)
│   └── api/       # API routes (auth, upload)
├── components/    # Reusable React components
│   ├── ui/        # Base primitives (button, input, etc.)
│   ├── layout/    # Header, footer, sidebar
│   ├── artwork/   # Artwork-specific components
│   ├── forms/     # Form components
│   └── shared/    # Shared components
├── actions/       # Server actions (data mutations)
├── validations/   # Zod validation schemas
├── lib/           # Utilities, Prisma client, auth config
└── types/         # TypeScript type definitions
```

## Cloudinary Setup

1. Create a free Cloudinary account
2. Create an unsigned upload preset named `gallery-unsigned`
3. Add your cloud name, API key, and secret to `.env`
4. Images uploaded through admin will use Cloudinary

Without Cloudinary configured, the image upload falls back to browser object URLs (dev only).

## Deployment

### Vercel (Frontend)

1. Connect your GitHub repo to Vercel
2. Set all environment variables from `.env.example`
3. Deploy — Vercel auto-detects Next.js

### Database (Railway / Supabase / Render)

1. Create a PostgreSQL instance
2. Get the connection URL
3. Set `DATABASE_URL` in Vercel environment variables
4. Run `npx prisma migrate deploy` after first deploy

### Production Checklist

- [ ] Change `NEXTAUTH_SECRET` to a strong random value
- [ ] Change admin password
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your domain
- [ ] Configure Cloudinary
- [ ] Enable HTTPS
- [ ] Set up backup for PostgreSQL
- [ ] Review and customize demo content

## License

Private — all rights reserved.
