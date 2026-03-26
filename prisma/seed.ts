import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "changeme123", 12);
  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@gallery.com" },
    update: {},
    create: { name: "Admin", email: process.env.ADMIN_EMAIL || "admin@gallery.com", passwordHash, role: "ADMIN" },
  });
  console.log("✓ Admin user");

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", artistName: "Gustavo Bar Valenzuela", siteTitle: "Gustavo Bar Valenzuela — Fine Art", tagline: "Original paintings, drawings, and fine art", contactEmail: "contact@gustavobarvalenzuela.art", instagram: "https://instagram.com/gustavobarvalenzuela", facebook: "https://facebook.com/gustavobarvalenzuela" },
  });
  console.log("✓ Site settings");

  const cats = await Promise.all([
    prisma.category.upsert({ where: { slug: "period-2004-2016" }, update: {}, create: { name: "Period 2004–2016", slug: "period-2004-2016", description: "Works from the early and formative period.", type: "PERIOD", coverImageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80", sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: "period-2017-2024" }, update: {}, create: { name: "Period 2017–2024", slug: "period-2017-2024", description: "Recent works with bold compositions.", type: "PERIOD", coverImageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80", sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: "drawings-and-sketches" }, update: {}, create: { name: "Drawings & Sketches", slug: "drawings-and-sketches", description: "Pencil, charcoal, and ink works on paper.", type: "DRAWINGS", coverImageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80", sortOrder: 3 } }),
    prisma.category.upsert({ where: { slug: "special-commissions" }, update: {}, create: { name: "Special Commissions", slug: "special-commissions", description: "Custom pieces for private collectors.", type: "COMMISSIONS", coverImageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80", sortOrder: 4 } }),
  ]);
  console.log("✓ Categories");

  const artworks = [
    { title: "Mediterranean Dawn", slug: "mediterranean-dawn", year: 2008, medium: "Oil on canvas", width: 120, height: 80, unit: "cm", shortDescription: "A luminous seascape.", mainImageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&q=80", galleryImages: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"], categoryId: cats[0].id, collectionPeriod: "2004-2016", tags: ["seascape", "oil", "mediterranean"], price: 4500, status: "AVAILABLE", featured: true, forSale: true, sortOrder: 1 },
    { title: "Urban Fragments III", slug: "urban-fragments-iii", year: 2012, medium: "Mixed media on canvas", width: 100, height: 100, unit: "cm", shortDescription: "Abstract urban architecture.", mainImageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80", galleryImages: [], categoryId: cats[0].id, collectionPeriod: "2004-2016", tags: ["abstract", "mixed media"], price: 3800, status: "SOLD", featured: true, forSale: false, sortOrder: 2 },
    { title: "Silent Garden", slug: "silent-garden", year: 2019, medium: "Oil on linen", width: 150, height: 100, unit: "cm", shortDescription: "A contemplative landscape at twilight.", mainImageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200&q=80", galleryImages: ["https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80"], categoryId: cats[1].id, collectionPeriod: "2017-2024", tags: ["landscape", "oil"], price: 6200, status: "AVAILABLE", featured: true, forSale: true, sortOrder: 1 },
    { title: "Composition in Red", slug: "composition-in-red", year: 2021, medium: "Acrylic on canvas", width: 90, height: 120, unit: "cm", shortDescription: "A bold abstract study.", mainImageUrl: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1200&q=80", galleryImages: [], categoryId: cats[1].id, collectionPeriod: "2017-2024", tags: ["abstract", "acrylic"], price: 5100, status: "RESERVED", featured: false, forSale: true, sortOrder: 2 },
    { title: "Figure Study No. 7", slug: "figure-study-no-7", year: 2015, medium: "Charcoal on paper", width: 50, height: 70, unit: "cm", shortDescription: "A classical figure study.", mainImageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80", galleryImages: [], categoryId: cats[2].id, tags: ["figure", "charcoal"], price: 1200, status: "AVAILABLE", forSale: true, sortOrder: 1 },
    { title: "Autumn Reflections", slug: "autumn-reflections", year: 2023, medium: "Oil on canvas", width: 130, height: 90, unit: "cm", shortDescription: "Vibrant autumn with lake reflections.", mainImageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200&q=80", galleryImages: ["https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80", "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80"], categoryId: cats[1].id, collectionPeriod: "2017-2024", tags: ["landscape", "oil", "autumn"], price: 7500, status: "AVAILABLE", featured: true, forSale: true, sortOrder: 3 },
  ];

  for (const a of artworks) {
    await prisma.artwork.upsert({ where: { slug: a.slug }, update: {}, create: { ...a, currency: "USD", artistName: "Gustavo Bar Valenzuela", publishedAt: new Date() } });
  }
  console.log(`✓ ${artworks.length} artworks`);

  await prisma.page.upsert({ where: { slug: "about" }, update: {}, create: { title: "About", slug: "about", heroTitle: "About the Artist", heroSubtitle: "A lifetime dedicated to art", isPublished: true, bodyContent: JSON.stringify([{ type: "paragraph", text: "Gustavo Bar Valenzuela is a contemporary artist whose work spans painting, drawing, and mixed media." }, { type: "paragraph", text: "Working primarily in oil and mixed media, Gustavo creates pieces that invite contemplation." }]) } });
  await prisma.page.upsert({ where: { slug: "home" }, update: {}, create: { title: "Home", slug: "home", heroTitle: "Gustavo Bar Valenzuela", heroSubtitle: "Original paintings, drawings, and fine art", isPublished: true } });
  console.log("✓ Pages");

  await prisma.contactMessage.create({ data: { fullName: "Sarah Johnson", email: "sarah@example.com", subject: "Inquiry about Silent Garden", message: "I'm interested in the Silent Garden piece.", artworkReference: "silent-garden" } });
  console.log("✓ Demo message");
  console.log("\n✅ Done! Login: admin@gallery.com / changeme123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
