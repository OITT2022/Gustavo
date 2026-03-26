-- =============================================
-- D1 Database Setup: Schema + Seed Data
-- Run this against your Cloudflare D1 database
-- =============================================

-- Create Tables (order matters for foreign keys)
CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "type" TEXT NOT NULL DEFAULT 'GENERAL',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Artwork" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "artistName" TEXT NOT NULL DEFAULT 'Gustavo Bar Valenzuela',
    "year" INTEGER,
    "medium" TEXT,
    "dimensionsText" TEXT,
    "width" REAL,
    "height" REAL,
    "depth" REAL,
    "unit" TEXT DEFAULT 'cm',
    "shortDescription" TEXT,
    "fullDescription" TEXT,
    "mainImageUrl" TEXT NOT NULL,
    "galleryImages" TEXT NOT NULL DEFAULT '[]',
    "categoryId" TEXT,
    "collectionPeriod" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "price" REAL,
    "currency" TEXT DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "forSale" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" DATETIME,
    CONSTRAINT "Artwork_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "heroImageUrl" TEXT,
    "bodyContent" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "artworkReference" TEXT,
    "isHandled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "artistName" TEXT NOT NULL DEFAULT 'Gustavo Bar Valenzuela',
    "siteTitle" TEXT NOT NULL DEFAULT 'Gustavo Bar Valenzuela — Fine Art',
    "tagline" TEXT,
    "aboutSnippet" TEXT,
    "contactEmail" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "youtube" TEXT,
    "linkedin" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "Artwork_slug_key" ON "Artwork"("slug");
CREATE INDEX IF NOT EXISTS "Artwork_categoryId_idx" ON "Artwork"("categoryId");
CREATE INDEX IF NOT EXISTS "Artwork_status_idx" ON "Artwork"("status");
CREATE INDEX IF NOT EXISTS "Artwork_forSale_idx" ON "Artwork"("forSale");
CREATE INDEX IF NOT EXISTS "Artwork_featured_idx" ON "Artwork"("featured");
CREATE INDEX IF NOT EXISTS "Artwork_sortOrder_idx" ON "Artwork"("sortOrder");
CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");
CREATE INDEX IF NOT EXISTS "Category_type_idx" ON "Category"("type");
CREATE INDEX IF NOT EXISTS "Category_sortOrder_idx" ON "Category"("sortOrder");
CREATE UNIQUE INDEX IF NOT EXISTS "Page_slug_key" ON "Page"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_email_key" ON "AdminUser"("email");

-- =============================================
-- SEED DATA
-- =============================================

-- Admin user (password: changeme123)
INSERT OR IGNORE INTO "AdminUser" ("id", "name", "email", "passwordHash", "role", "updatedAt")
VALUES ('admin1', 'Admin', 'admin@gallery.com', '$2a$12$EwSUabjidtq5Ud2NO83aJOoABlIB/2H6o9XS7dYGN77AzmHuRiLvm', 'ADMIN', datetime('now'));

-- Site Settings
INSERT OR IGNORE INTO "SiteSettings" ("id", "artistName", "siteTitle", "tagline", "contactEmail", "instagram", "facebook", "updatedAt")
VALUES ('default', 'Gustavo Bar Valenzuela', 'Gustavo Bar Valenzuela — Fine Art', 'Original paintings, drawings, and fine art', 'contact@gustavobarvalenzuela.art', 'https://instagram.com/gustavobarvalenzuela', 'https://facebook.com/gustavobarvalenzuela', datetime('now'));

-- Categories
INSERT OR IGNORE INTO "Category" ("id", "name", "slug", "description", "type", "coverImageUrl", "sortOrder", "updatedAt")
VALUES ('cat1', 'Period 2004–2016', 'period-2004-2016', 'Works from the early and formative period.', 'PERIOD', 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80', 1, datetime('now'));

INSERT OR IGNORE INTO "Category" ("id", "name", "slug", "description", "type", "coverImageUrl", "sortOrder", "updatedAt")
VALUES ('cat2', 'Period 2017–2024', 'period-2017-2024', 'Recent works with bold compositions and deeper thematic exploration.', 'PERIOD', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80', 2, datetime('now'));

INSERT OR IGNORE INTO "Category" ("id", "name", "slug", "description", "type", "coverImageUrl", "sortOrder", "updatedAt")
VALUES ('cat3', 'Drawings & Sketches', 'drawings-and-sketches', 'Pencil, charcoal, and ink works on paper.', 'DRAWINGS', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80', 3, datetime('now'));

INSERT OR IGNORE INTO "Category" ("id", "name", "slug", "description", "type", "coverImageUrl", "sortOrder", "updatedAt")
VALUES ('cat4', 'Special Commissions', 'special-commissions', 'Custom pieces created for private collectors and institutions.', 'COMMISSIONS', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80', 4, datetime('now'));

-- Artworks
INSERT OR IGNORE INTO "Artwork" ("id", "title", "slug", "artistName", "year", "medium", "width", "height", "unit", "shortDescription", "fullDescription", "mainImageUrl", "galleryImages", "categoryId", "collectionPeriod", "tags", "price", "currency", "status", "featured", "forSale", "sortOrder", "updatedAt", "publishedAt")
VALUES ('art1', 'Mediterranean Dawn', 'mediterranean-dawn', 'Gustavo Bar Valenzuela', 2008, 'Oil on canvas', 120, 80, 'cm', 'A luminous seascape capturing the first light over the Mediterranean coast.', 'This piece captures the ethereal quality of dawn as it breaks over the Mediterranean coastline.', 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&q=80', '["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"]', 'cat1', '2004-2016', '["seascape","oil","mediterranean"]', 4500, 'USD', 'AVAILABLE', 1, 1, 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO "Artwork" ("id", "title", "slug", "artistName", "year", "medium", "width", "height", "unit", "shortDescription", "fullDescription", "mainImageUrl", "galleryImages", "categoryId", "collectionPeriod", "tags", "price", "currency", "status", "featured", "forSale", "sortOrder", "updatedAt", "publishedAt")
VALUES ('art2', 'Urban Fragments III', 'urban-fragments-iii', 'Gustavo Bar Valenzuela', 2012, 'Mixed media on canvas', 100, 100, 'cm', 'An abstract exploration of urban architecture.', 'Part of the Urban Fragments series, this piece deconstructs the visual language of the city.', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80', '[]', 'cat1', '2004-2016', '["abstract","mixed media","urban"]', 3800, 'USD', 'SOLD', 1, 0, 2, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO "Artwork" ("id", "title", "slug", "artistName", "year", "medium", "width", "height", "unit", "shortDescription", "fullDescription", "mainImageUrl", "galleryImages", "categoryId", "collectionPeriod", "tags", "price", "currency", "status", "featured", "forSale", "sortOrder", "updatedAt", "publishedAt")
VALUES ('art3', 'Silent Garden', 'silent-garden', 'Gustavo Bar Valenzuela', 2019, 'Oil on linen', 150, 100, 'cm', 'A contemplative landscape of an overgrown garden at twilight.', 'Silent Garden captures the poetic stillness of an abandoned garden as evening settles in.', 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200&q=80', '["https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80"]', 'cat2', '2017-2024', '["landscape","oil","garden"]', 6200, 'USD', 'AVAILABLE', 1, 1, 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO "Artwork" ("id", "title", "slug", "artistName", "year", "medium", "width", "height", "unit", "shortDescription", "mainImageUrl", "galleryImages", "categoryId", "collectionPeriod", "tags", "price", "currency", "status", "featured", "forSale", "sortOrder", "updatedAt", "publishedAt")
VALUES ('art4', 'Composition in Red', 'composition-in-red', 'Gustavo Bar Valenzuela', 2021, 'Acrylic on canvas', 90, 120, 'cm', 'A bold abstract study in red and earth tones.', 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1200&q=80', '[]', 'cat2', '2017-2024', '["abstract","acrylic","red"]', 5100, 'USD', 'RESERVED', 0, 1, 2, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO "Artwork" ("id", "title", "slug", "artistName", "year", "medium", "width", "height", "unit", "shortDescription", "mainImageUrl", "galleryImages", "categoryId", "tags", "price", "currency", "status", "featured", "forSale", "sortOrder", "updatedAt", "publishedAt")
VALUES ('art5', 'Figure Study No. 7', 'figure-study-no-7', 'Gustavo Bar Valenzuela', 2015, 'Charcoal on paper', 50, 70, 'cm', 'A classical figure study in charcoal.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80', '[]', 'cat3', '["figure","charcoal","drawing"]', 1200, 'USD', 'AVAILABLE', 0, 1, 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO "Artwork" ("id", "title", "slug", "artistName", "year", "medium", "width", "height", "unit", "shortDescription", "mainImageUrl", "galleryImages", "categoryId", "collectionPeriod", "tags", "price", "currency", "status", "featured", "forSale", "sortOrder", "updatedAt", "publishedAt")
VALUES ('art6', 'Autumn Reflections', 'autumn-reflections', 'Gustavo Bar Valenzuela', 2023, 'Oil on canvas', 130, 90, 'cm', 'A vibrant autumn landscape with lake reflections.', 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200&q=80', '["https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80","https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80"]', 'cat2', '2017-2024', '["landscape","oil","autumn"]', 7500, 'USD', 'AVAILABLE', 1, 1, 3, datetime('now'), datetime('now'));

-- Pages
INSERT OR IGNORE INTO "Page" ("id", "title", "slug", "heroTitle", "heroSubtitle", "isPublished", "bodyContent", "updatedAt")
VALUES ('page1', 'About', 'about', 'About the Artist', 'A lifetime dedicated to art', 1, '[{"type":"paragraph","text":"Gustavo Bar Valenzuela is a contemporary artist whose work spans painting, drawing, and mixed media."},{"type":"paragraph","text":"Born with an innate passion for visual expression, Gustavo studied fine arts and developed a distinctive style."},{"type":"paragraph","text":"Working primarily in oil and mixed media, Gustavo creates pieces that invite contemplation."}]', datetime('now'));

INSERT OR IGNORE INTO "Page" ("id", "title", "slug", "heroTitle", "heroSubtitle", "isPublished", "bodyContent", "updatedAt")
VALUES ('page2', 'Home', 'home', 'Gustavo Bar Valenzuela', 'Original paintings, drawings, and fine art', 1, '[]', datetime('now'));

-- Demo contact message
INSERT OR IGNORE INTO "ContactMessage" ("id", "fullName", "email", "subject", "message", "artworkReference", "isHandled")
VALUES ('msg1', 'Sarah Johnson', 'sarah@example.com', 'Inquiry about Silent Garden', 'Hello, I am very interested in the Silent Garden piece. Could you provide more details?', 'silent-garden', 0);
