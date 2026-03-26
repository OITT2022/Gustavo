-- CreateTable
CREATE TABLE "Artwork" (
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
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    CONSTRAINT "Artwork_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "type" TEXT NOT NULL DEFAULT 'GENERAL',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Page" (
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContactMessage" (
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

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteSettings" (
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Artwork_slug_key" ON "Artwork"("slug");

-- CreateIndex
CREATE INDEX "Artwork_categoryId_idx" ON "Artwork"("categoryId");

-- CreateIndex
CREATE INDEX "Artwork_status_idx" ON "Artwork"("status");

-- CreateIndex
CREATE INDEX "Artwork_forSale_idx" ON "Artwork"("forSale");

-- CreateIndex
CREATE INDEX "Artwork_featured_idx" ON "Artwork"("featured");

-- CreateIndex
CREATE INDEX "Artwork_sortOrder_idx" ON "Artwork"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_type_idx" ON "Category"("type");

-- CreateIndex
CREATE INDEX "Category_sortOrder_idx" ON "Category"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
