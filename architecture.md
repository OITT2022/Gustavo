# Architecture — Gallery Website

## Overview

A full-stack art gallery website with a public portfolio and a protected admin CMS.
Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL.

## Architecture Decisions

| Area | Decision | Reasoning |
|------|----------|-----------|
| Framework | Next.js 15 App Router | Modern React, server components, server actions |
| Auth | NextAuth.js v5 (credentials) | Simple admin-only auth, JWT sessions |
| ORM | Prisma | Type-safe, great DX, migration support |
| Styling | Tailwind CSS 3.4 | Utility-first, fast iteration, consistent design |
| Images | Cloudinary (unsigned preset) | CDN, transforms, free tier, no server processing |
| Forms | React Hook Form + Zod | Performant forms with schema validation |
| Mutations | Server Actions | Colocated with components, no API boilerplate |
| Deployment | Vercel + Railway/Supabase | Optimized for Next.js + managed Postgres |

## Route Architecture

### Public (Server Components)
```
/                    → Homepage: hero + featured artworks + category cards
/about               → About page (editable via admin)
/gallery             → Category listing
/gallery/[slug]      → Category artworks grid
/artwork/[slug]      → Artwork detail with image gallery
/for-sale            → Artworks marked forSale=true
/contact             → Contact form
/drawings-sketches   → Redirect → /gallery/drawings-and-sketches
/special-commissions → Redirect → /gallery/special-commissions
```

### Admin (Protected via middleware)
```
/admin/login         → Credential login (outside admin layout)
/admin               → Dashboard stats
/admin/artworks      → CRUD list
/admin/artworks/new  → Create form
/admin/artworks/[id]/edit → Edit form
/admin/categories    → Category management
/admin/pages         → Editable pages
/admin/pages/[id]/edit → Page editor
/admin/messages      → Contact inbox
/admin/settings      → Site settings
```

## Data Model

```
Artwork ──→ Category (many-to-one)
Page (standalone editable content)
ContactMessage (form submissions)
AdminUser (credentials auth)
SiteSettings (singleton config)
```

### Key Artwork Fields
- `status`: AVAILABLE | SOLD | RESERVED | HIDDEN
- `featured`: shown on homepage
- `forSale`: shown on /for-sale page
- `galleryImages[]`: Postgres string array

### Category Types
- PERIOD (e.g., 2004-2016, 2017-2024)
- DRAWINGS
- COMMISSIONS
- SALE
- GENERAL

## Auth Flow

1. Middleware intercepts `/admin/*` routes
2. Unauthenticated → redirect to `/admin/login`
3. Login form → server action → NextAuth credentials provider
4. JWT session stored in cookie
5. Admin layout renders sidebar + content

## Data Flow

### Public Pages (read)
```
Page (Server Component) → Prisma query → Render
```

### Admin Mutations (write)
```
Form (Client) → Server Action → Zod validate → Prisma → revalidatePath
```

### Image Upload
```
Admin form → Cloudinary unsigned upload (browser) → URL → Server Action → DB
```

## Component Architecture

```
components/
├── ui/          # Design primitives (Button, Input, Card, Badge, etc.)
├── layout/      # Structural (Header, Footer, AdminSidebar)
├── artwork/     # Domain (ArtworkCard, ArtworkGrid, ArtworkDetail)
├── home/        # Homepage-specific (HeroSection, FeaturedArtworks)
├── forms/       # All form components
└── shared/      # Cross-cutting (PageHero, StatusBadge, SocialLinks)
```

## Admin Permissions

| Role | Capabilities |
|------|-------------|
| ADMIN | Full access: CRUD everything, manage settings |
| EDITOR | Create/edit artworks and categories (future use) |

Currently single-admin system. Role-based access is modeled but not enforced.
