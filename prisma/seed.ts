import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "changeme123",
    12
  );
  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@gallery.com" },
    update: {},
    create: {
      name: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@gallery.com",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("✓ Admin user created");

  // Site settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      artistName: "Gustavo Bar Valenzuela",
      siteTitle: "Gustavo Bar Valenzuela — Fine Art",
      tagline: "Original paintings, drawings, and fine art",
      contactEmail: "contact@gustavobarvalenzuela.art",
      instagram: "https://instagram.com/gustavobarvalenzuela",
      facebook: "https://facebook.com/gustavobarvalenzuela",
    },
  });
  console.log("✓ Site settings created");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "period-2004-2016" },
      update: {},
      create: {
        name: "Period 2004–2016",
        slug: "period-2004-2016",
        description:
          "Works from the early and formative period, exploring identity and landscape through oil and mixed media.",
        type: "PERIOD",
        coverImageUrl:
          "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "period-2017-2024" },
      update: {},
      create: {
        name: "Period 2017–2024",
        slug: "period-2017-2024",
        description:
          "Recent works reflecting a mature artistic vision with bold compositions and deeper thematic exploration.",
        type: "PERIOD",
        coverImageUrl:
          "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "drawings-and-sketches" },
      update: {},
      create: {
        name: "Drawings & Sketches",
        slug: "drawings-and-sketches",
        description:
          "Pencil, charcoal, and ink works on paper — the foundation of all visual expression.",
        type: "DRAWINGS",
        coverImageUrl:
          "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "special-commissions" },
      update: {},
      create: {
        name: "Special Commissions",
        slug: "special-commissions",
        description:
          "Custom pieces created for private collectors, institutions, and special projects.",
        type: "COMMISSIONS",
        coverImageUrl:
          "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
        sortOrder: 4,
      },
    }),
  ]);
  console.log("✓ Categories created");

  // Artworks
  const artworks = [
    {
      title: "Mediterranean Dawn",
      slug: "mediterranean-dawn",
      year: 2008,
      medium: "Oil on canvas",
      width: 120,
      height: 80,
      unit: "cm",
      shortDescription:
        "A luminous seascape capturing the first light over the Mediterranean coast.",
      fullDescription:
        "This piece captures the ethereal quality of dawn as it breaks over the Mediterranean coastline. Painted en plein air during a residency in southern Spain, it reflects the artist's fascination with the interplay of water and light. The warm golden hues of the sky gradually merge with the cool blues of the sea, creating a harmonious balance that invites quiet contemplation.",
      mainImageUrl:
        "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      ],
      categoryId: categories[0].id,
      collectionPeriod: "2004-2016",
      tags: ["seascape", "oil", "mediterranean", "landscape"],
      price: 4500,
      status: "AVAILABLE" as const,
      featured: true,
      forSale: true,
      sortOrder: 1,
    },
    {
      title: "Urban Fragments III",
      slug: "urban-fragments-iii",
      year: 2012,
      medium: "Mixed media on canvas",
      width: 100,
      height: 100,
      unit: "cm",
      shortDescription:
        "An abstract exploration of urban architecture and human density.",
      fullDescription:
        "Part of the Urban Fragments series, this piece deconstructs the visual language of the city into geometric forms and layered textures. Through a combination of acrylic paint, newspaper clippings, and graphite, the work reflects on the complexity of modern urban life — its rhythms, its contradictions, and its hidden beauty.",
      mainImageUrl:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80",
      galleryImages: [],
      categoryId: categories[0].id,
      collectionPeriod: "2004-2016",
      tags: ["abstract", "mixed media", "urban", "geometric"],
      price: 3800,
      status: "SOLD" as const,
      featured: true,
      forSale: false,
      sortOrder: 2,
    },
    {
      title: "Silent Garden",
      slug: "silent-garden",
      year: 2019,
      medium: "Oil on linen",
      width: 150,
      height: 100,
      unit: "cm",
      shortDescription:
        "A contemplative landscape of an overgrown garden at twilight.",
      fullDescription:
        "Silent Garden captures the poetic stillness of an abandoned garden as evening settles in. Rich greens and deep purples create a sense of mystery, while subtle hints of golden light suggest a world just beyond the frame. This work marks a shift toward a more introspective and emotionally charged palette.",
      mainImageUrl:
        "https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
      ],
      categoryId: categories[1].id,
      collectionPeriod: "2017-2024",
      tags: ["landscape", "oil", "garden", "twilight"],
      price: 6200,
      status: "AVAILABLE" as const,
      featured: true,
      forSale: true,
      sortOrder: 1,
    },
    {
      title: "Composition in Red",
      slug: "composition-in-red",
      year: 2021,
      medium: "Acrylic on canvas",
      width: 90,
      height: 120,
      unit: "cm",
      shortDescription:
        "A bold abstract study in red and earth tones.",
      fullDescription:
        "Composition in Red is an exercise in restraint and boldness. Working within a limited palette of reds, ochres, and burnt umbers, the artist creates a dynamic tension between form and space. The large, sweeping gestures are balanced by areas of delicate detail, resulting in a work that rewards close examination.",
      mainImageUrl:
        "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1200&q=80",
      galleryImages: [],
      categoryId: categories[1].id,
      collectionPeriod: "2017-2024",
      tags: ["abstract", "acrylic", "red", "contemporary"],
      price: 5100,
      status: "RESERVED" as const,
      featured: false,
      forSale: true,
      sortOrder: 2,
    },
    {
      title: "Figure Study No. 7",
      slug: "figure-study-no-7",
      year: 2015,
      medium: "Charcoal on paper",
      width: 50,
      height: 70,
      unit: "cm",
      shortDescription:
        "A classical figure study in charcoal.",
      fullDescription:
        "This charcoal study demonstrates the artist's commitment to classical drawing techniques. The figure emerges from the paper through careful modulation of tone and line weight, creating a sense of volume and presence that is both timeless and immediate.",
      mainImageUrl:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80",
      galleryImages: [],
      categoryId: categories[2].id,
      tags: ["figure", "charcoal", "drawing", "classical"],
      status: "AVAILABLE" as const,
      featured: false,
      forSale: true,
      price: 1200,
      sortOrder: 1,
    },
    {
      title: "Landscape Sketch — Galilee",
      slug: "landscape-sketch-galilee",
      year: 2018,
      medium: "Pencil and ink on paper",
      width: 40,
      height: 30,
      unit: "cm",
      shortDescription:
        "A quick field sketch from the hills of Galilee.",
      fullDescription:
        "Captured during an afternoon hike in the Galilee region, this sketch distills the rolling hills and ancient olive groves into essential lines and washes. The immediacy of the drawing preserves the energy of the moment.",
      mainImageUrl:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80",
      galleryImages: [],
      categoryId: categories[2].id,
      tags: ["landscape", "sketch", "pencil", "galilee"],
      status: "AVAILABLE" as const,
      featured: false,
      forSale: true,
      price: 800,
      sortOrder: 2,
    },
    {
      title: "Portrait Commission — The Cellist",
      slug: "portrait-commission-cellist",
      year: 2022,
      medium: "Oil on canvas",
      width: 80,
      height: 100,
      unit: "cm",
      shortDescription:
        "A commissioned portrait of a concert cellist in performance.",
      fullDescription:
        "Created for a private collector, this portrait captures the intense focus and physical grace of a cellist in the midst of a performance. The dramatic lighting and flowing composition convey both the music and the musician, creating an image that transcends simple portraiture.",
      mainImageUrl:
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80",
      galleryImages: [],
      categoryId: categories[3].id,
      tags: ["portrait", "commission", "music", "oil"],
      status: "SOLD" as const,
      featured: false,
      forSale: false,
      sortOrder: 1,
    },
    {
      title: "Autumn Reflections",
      slug: "autumn-reflections",
      year: 2023,
      medium: "Oil on canvas",
      width: 130,
      height: 90,
      unit: "cm",
      shortDescription:
        "A vibrant autumn landscape with lake reflections.",
      fullDescription:
        "Autumn Reflections captures the fleeting beauty of fall foliage mirrored in still lake waters. Rich oranges, golds, and crimson hues dominate the upper portion while the water below creates a dreamlike inversion, blending reality with reflection in a meditation on impermanence and beauty.",
      mainImageUrl:
        "https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
        "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80",
      ],
      categoryId: categories[1].id,
      collectionPeriod: "2017-2024",
      tags: ["landscape", "oil", "autumn", "reflections"],
      price: 7500,
      status: "AVAILABLE" as const,
      featured: true,
      forSale: true,
      sortOrder: 3,
    },
  ];

  for (const artwork of artworks) {
    await prisma.artwork.upsert({
      where: { slug: artwork.slug },
      update: {},
      create: {
        ...artwork,
        currency: "USD",
        artistName: "Gustavo Bar Valenzuela",
        publishedAt: new Date(),
      },
    });
  }
  console.log(`✓ ${artworks.length} artworks created`);

  // Pages
  const pages = [
    {
      title: "About",
      slug: "about",
      heroTitle: "About the Artist",
      heroSubtitle: "A lifetime dedicated to art",
      isPublished: true,
      bodyContent: [
        {
          type: "paragraph",
          text: "Gustavo Bar Valenzuela is a contemporary artist whose work spans painting, drawing, and mixed media. With a career stretching over two decades, his art explores themes of identity, landscape, and the human condition.",
        },
        {
          type: "paragraph",
          text: "Born with an innate passion for visual expression, Gustavo studied fine arts and developed a distinctive style that bridges traditional techniques with contemporary sensibilities. His work has been exhibited in galleries across multiple countries and resides in private collections worldwide.",
        },
        {
          type: "paragraph",
          text: "Working primarily in oil and mixed media, Gustavo creates pieces that invite contemplation and emotional engagement. Each work represents a dialogue between the artist and the canvas — an exploration of color, form, and meaning.",
        },
      ],
    },
    {
      title: "Home",
      slug: "home",
      heroTitle: "Gustavo Bar Valenzuela",
      heroSubtitle: "Original paintings, drawings, and fine art",
      isPublished: true,
      bodyContent: [],
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }
  console.log("✓ Pages created");

  // Demo contact message
  await prisma.contactMessage.create({
    data: {
      fullName: "Sarah Johnson",
      email: "sarah@example.com",
      subject: "Inquiry about Silent Garden",
      message:
        "Hello, I'm very interested in the Silent Garden piece. Could you provide more details about availability and shipping? I'm based in New York. Thank you!",
      artworkReference: "silent-garden",
      isHandled: false,
    },
  });
  console.log("✓ Demo contact message created");

  console.log("\n✅ Seeding complete!");
  console.log(
    `   Admin login: ${process.env.ADMIN_EMAIL || "admin@gallery.com"} / ${process.env.ADMIN_PASSWORD || "changeme123"}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
