import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with real artist data...");

  // Clear existing data
  await prisma.contactMessage.deleteMany();
  await prisma.artwork.deleteMany();
  await prisma.category.deleteMany();
  await prisma.page.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.siteSettings.deleteMany();
  console.log("✓ Cleared old data");

  // Admin user
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "changeme123", 12);
  await prisma.adminUser.create({
    data: { name: "Admin", email: process.env.ADMIN_EMAIL || "admin@gallery.com", passwordHash, role: "ADMIN" },
  });
  console.log("✓ Admin user");

  // Site settings with real data
  await prisma.siteSettings.create({
    data: {
      id: "default",
      artistName: "Gustavo Bar Valenzuela",
      siteTitle: "Valenzuelarts — Gustavo Bar Valenzuela",
      tagline: "Chilean-Israeli Artist — Tradition of Technique and Materials",
      contactEmail: "valenzuelarts@gmail.com",
      phone: "972-549246080",
      address: "Abba Hillel 126, Ramat-Gan, Israel",
      instagram: "https://www.instagram.com/valenzuela_arts_/",
      facebook: "https://www.facebook.com/valenzuelarts",
      youtube: "https://www.youtube.com/@gustavobarvalenzuela6440",
    },
  });
  console.log("✓ Site settings");

  // Categories
  const cat2004 = await prisma.category.create({
    data: { name: "Period 2004–2016", slug: "period-2004-2016", description: "At this time my painting is influenced by the beauty of everyday moments in Israel and its culture.", type: "PERIOD", coverImageUrl: "/artworks/period-2004/let-go-at-3.jpg", sortOrder: 1 },
  });
  const cat2017 = await prisma.category.create({
    data: { name: "Period 2017–2024", slug: "period-2017-2024", description: "Recent works exploring transformation, gravity, color transgression, and the human figure.", type: "PERIOD", coverImageUrl: "/artworks/period-2017/nude-2017.jpg", sortOrder: 2 },
  });
  const catDrawings = await prisma.category.create({
    data: { name: "Drawings & Sketches", slug: "drawings-and-sketches", description: "Charcoal, conte, and graphite works on paper — the foundation of classical technique.", type: "DRAWINGS", coverImageUrl: "/artworks/drawings/sketch-shishy-i.jpg", sortOrder: 3 },
  });
  const catCommissions = await prisma.category.create({
    data: { name: "Special Commissions", slug: "special-commissions", description: "Custom pieces created for private collectors, institutions, and military commemorations.", type: "COMMISSIONS", coverImageUrl: "/artworks/commissions/israeli-navy-exercise.jpg", sortOrder: 4 },
  });
  console.log("✓ Categories");

  // Helper
  let order = 0;
  const art = (data: { title: string; slug: string; year?: number; medium: string; dimensions: string; imageUrl: string; categoryId: string; forSale?: boolean; featured?: boolean; tags?: string[]; collectionPeriod?: string }) => {
    order++;
    const dims = data.dimensions.match(/(\d+[\.,]?\d*)\s*[xX×]\s*(\d+[\.,]?\d*)/);
    return prisma.artwork.create({
      data: {
        title: data.title, slug: data.slug, artistName: "Gustavo Bar Valenzuela",
        year: data.year, medium: data.medium, dimensionsText: data.dimensions,
        width: dims ? parseFloat(dims[1].replace(",", ".")) : undefined,
        height: dims ? parseFloat(dims[2].replace(",", ".")) : undefined,
        unit: "cm", mainImageUrl: data.imageUrl, galleryImages: [],
        categoryId: data.categoryId, collectionPeriod: data.collectionPeriod,
        tags: data.tags || [], status: "AVAILABLE", featured: data.featured || false,
        forSale: data.forSale || false, sortOrder: order, publishedAt: new Date(),
      },
    });
  };

  // ===== PERIOD 2004-2016 =====
  await art({ title: "Let Go at 3:00", slug: "let-go-at-3", year: 2004, medium: "Oil color and alkyd resin on canvas", dimensions: "100x150 cm", imageUrl: "/artworks/period-2004/let-go-at-3.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["realism", "Israel"], featured: true });
  await art({ title: "Nostalgia in Israel", slug: "nostalgia-in-israel", year: 2006, medium: "Oil color and alkyd resin on canvas", dimensions: "100x150 cm", imageUrl: "/artworks/period-2004/nostalgia-in-israel.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["Israel", "nostalgia"] });
  await art({ title: "The Acordionist", slug: "the-acordionist", year: 2006, medium: "Oil on canvas laid on board", dimensions: "100x140 cm", imageUrl: "/artworks/period-2004/the-acordionist.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["music", "portrait"], featured: true });
  await art({ title: "The Acordenist II", slug: "the-acordenist-ii", year: 2015, medium: "Oil on canvas", dimensions: "100x140 cm", imageUrl: "/artworks/period-2004/the-acordenist-ii.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["music", "portrait"] });
  await art({ title: "Cellist in Ramat-Gan", slug: "cellist-in-ramat-gan", year: 2013, medium: "Oil on canvas", dimensions: "90x120 cm", imageUrl: "/artworks/period-2004/cellist-in-ramat-gan.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["music", "cello"] });
  await art({ title: "Tel-Avivi Artist", slug: "tel-avivi-artist", year: 2010, medium: "Oil on canvas", dimensions: "80x140 cm", imageUrl: "/artworks/period-2004/tel-avivi-artist.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["Tel Aviv", "portrait"] });
  await art({ title: "Shimon Peres", slug: "shimon-peres", year: 2014, medium: "Oil on linen glued to board", dimensions: "70x100 cm", imageUrl: "/artworks/period-2004/shimon-peres.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["portrait", "political"], featured: true });
  await art({ title: "Sunset in Tel Aviv", slug: "sunset-in-tel-aviv", year: 2008, medium: "Oil on canvas", dimensions: "70x100 cm", imageUrl: "/artworks/period-2004/sunset-in-tel-aviv.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["landscape", "Tel Aviv", "sunset"] });
  await art({ title: "Sunset on Frishman Street", slug: "sunset-on-frishman", year: 2015, medium: "Oil on canvas", dimensions: "80x100 cm", imageUrl: "/artworks/period-2004/sunset-on-frishman.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["landscape", "Tel Aviv"] });
  await art({ title: "Winter in Tel Aviv", slug: "winter-in-tel-aviv", year: 2012, medium: "Oil on canvas", dimensions: "90x120 cm", imageUrl: "/artworks/period-2004/winter-in-tel-aviv.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["landscape", "Tel Aviv", "winter"] });
  await art({ title: "Jerusalem with Snow", slug: "jerusalem-with-snow", year: 2014, medium: "Oil on canvas", dimensions: "80x130 cm", imageUrl: "/artworks/period-2004/jerusalem-with-snow.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["landscape", "Jerusalem", "snow"] });
  await art({ title: "Love in Tel Aviv", slug: "love-in-tel-aviv", year: 2016, medium: "Oil on canvas", dimensions: "90x120 cm", imageUrl: "/artworks/period-2004/love-in-tel-aviv.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["Tel Aviv", "love"] });
  await art({ title: "View from Yafo to Tel Aviv", slug: "view-from-yafo", year: 2014, medium: "Oil on canvas", dimensions: "120x90 cm", imageUrl: "/artworks/period-2004/view-from-yafo.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["landscape", "Jaffa", "Tel Aviv"] });
  await art({ title: "Light in Jaffa", slug: "light-in-jaffa", year: 2012, medium: "Oil on canvas", dimensions: "100x120 cm", imageUrl: "/artworks/period-2004/light-in-jaffa.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["landscape", "Jaffa"] });
  await art({ title: "Kineret", slug: "kineret", year: 2011, medium: "Oil on canvas", dimensions: "130x180 cm", imageUrl: "/artworks/period-2004/kineret.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["landscape", "Kineret", "Galilee"] });

  // ===== PERIOD 2017-2024 =====
  await art({ title: "Nude", slug: "nude-2017", year: 2017, medium: "Oil on canvas", dimensions: "90x120 cm", imageUrl: "/artworks/period-2017/nude-2017.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["figure", "nude"] });
  await art({ title: "Asking God", slug: "asking-god", year: 2018, medium: "Oil on canvas", dimensions: "100x100 cm", imageUrl: "/artworks/period-2017/asking-god.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["spiritual", "figure"], forSale: true, featured: true });
  await art({ title: "Portrait of Penelope", slug: "portrait-of-penelope", year: 2018, medium: "Oil on canvas", dimensions: "130x180 cm", imageUrl: "/artworks/period-2017/portrait-of-penelope.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "transformation"], forSale: true });
  await art({ title: "Geisha", slug: "geisha", year: 2019, medium: "Oil on canvas", dimensions: "120x120 cm", imageUrl: "/artworks/period-2017/geisha.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "geisha"], forSale: true, featured: true });
  await art({ title: "The Pain of Them", slug: "the-pain-of-them", year: 2020, medium: "Oil on canvas", dimensions: "180x130 cm", imageUrl: "/artworks/period-2017/the-pain-of-them.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["figure", "emotion"], forSale: true });
  await art({ title: "Contrast Portrait", slug: "contrast-portrait", year: 2020, medium: "Oil on canvas", dimensions: "140x100 cm", imageUrl: "/artworks/period-2017/contrast-portrait.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "contrast"] });
  await art({ title: "Pelope's Uncertainty", slug: "pelopes-uncertainty", year: 2020, medium: "Oil on canvas", dimensions: "100x100 cm", imageUrl: "/artworks/period-2017/pelopes-uncertainty.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "uncertainty"], forSale: true });
  await art({ title: "Transgression Color", slug: "transgression-color", year: 2018, medium: "Oil on canvas", dimensions: "140x100 cm", imageUrl: "/artworks/period-2017/transgression-color.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["color", "transgression"] });
  await art({ title: "Green Gum", slug: "green-gum", year: 2020, medium: "Oil on canvas", dimensions: "90x120 cm", imageUrl: "/artworks/period-2017/green-gum.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "bubblegum"] });
  await art({ title: "Hipster from Tokio", slug: "hipster-from-tokio", year: 2021, medium: "Oil on canvas", dimensions: "130x180 cm", imageUrl: "/artworks/period-2017/hipster-from-tokio.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "hipster", "Tokyo"] });
  await art({ title: "Sweet Invitation", slug: "sweet-invitation", year: 2021, medium: "Oil on canvas", dimensions: "140x100 cm", imageUrl: "/artworks/period-2017/sweet-invitation.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "invitation"] });
  await art({ title: "Anastasia and the Watermelon", slug: "anastasia-and-the-watermelon", year: 2022, medium: "Oil on canvas", dimensions: "90x120 cm", imageUrl: "/artworks/period-2017/anastasia-and-the-watermelon.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "watermelon"], forSale: true });
  await art({ title: "Arlecchino", slug: "arlecchino", year: 2020, medium: "Oil on canvas", dimensions: "140x100 cm", imageUrl: "/artworks/period-2017/arlecchino.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["gravity", "harlequin"], forSale: true, featured: true });
  await art({ title: "Hipster Meditation", slug: "hipster-meditation", year: 2020, medium: "Oil on canvas", dimensions: "100x140 cm", imageUrl: "/artworks/period-2017/hipster-meditation.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "meditation"] });
  await art({ title: "Transgression of Color - Pink", slug: "transgression-pink", year: 2022, medium: "Oil on canvas", dimensions: "100x100 cm", imageUrl: "/artworks/period-2017/transgression-pink.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["color", "transgression", "pink"], forSale: true });
  await art({ title: "Entropia (Caos)", slug: "entropia-caos", year: 2023, medium: "Oil on canvas", dimensions: "130x130 cm", imageUrl: "/artworks/period-2017/entropia-caos.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["entropy", "chaos"], forSale: true });
  await art({ title: "Alice's Fall into Wonderland", slug: "alices-fall-into-wonderland", year: 2024, medium: "Oil on canvas", dimensions: "140x100 cm", imageUrl: "/artworks/period-2017/alices-fall-into-wonderland.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["gravity", "alice", "wonderland"], forSale: true, featured: true });

  // ===== DRAWINGS & SKETCHES =====
  await art({ title: "Sketch for Shishy I", slug: "sketch-shishy-i", year: 2015, medium: "Charcoal on paper", dimensions: "38x57 cm", imageUrl: "/artworks/drawings/sketch-shishy-i.jpg", categoryId: catDrawings.id, tags: ["sketch", "charcoal", "portrait"] });
  await art({ title: "Sketch for Mother", slug: "sketch-for-mother", year: 2015, medium: "Charcoal on paper", dimensions: "37x57 cm", imageUrl: "/artworks/drawings/sketch-for-mother.jpg", categoryId: catDrawings.id, tags: ["sketch", "charcoal", "portrait"] });
  await art({ title: "Sketch for Father", slug: "sketch-for-father", year: 2015, medium: "Charcoal on paper", dimensions: "37x57 cm", imageUrl: "/artworks/drawings/sketch-for-father.jpg", categoryId: catDrawings.id, tags: ["sketch", "charcoal", "portrait"] });
  await art({ title: "Sketch for Sol", slug: "sketch-for-sol", year: 2012, medium: "Conte on paper", dimensions: "70x100 cm", imageUrl: "/artworks/drawings/sketch-for-sol.jpg", categoryId: catDrawings.id, tags: ["sketch", "conte"] });
  await art({ title: "Sketch for Alma", slug: "sketch-for-alma", year: 2015, medium: "Conte on paper", dimensions: "41x60 cm", imageUrl: "/artworks/drawings/sketch-for-alma.jpg", categoryId: catDrawings.id, tags: ["sketch", "conte", "portrait"] });
  await art({ title: "Yafo Street Jerusalem", slug: "yafo-street-jerusalem", year: 2016, medium: "Charcoal and graphite", dimensions: "20x35 cm", imageUrl: "/artworks/drawings/yafo-street-jerusalem.jpg", categoryId: catDrawings.id, tags: ["sketch", "Jerusalem", "street"] });
  await art({ title: "Sweet Wet in Pandemic", slug: "sweet-wet-pandemic", year: 2022, medium: "Drawing on paper", dimensions: "50x70 cm", imageUrl: "/artworks/drawings/sweet-wet-pandemic.jpg", categoryId: catDrawings.id, tags: ["drawing", "pandemic"], forSale: true });
  await art({ title: "Wet Green Bubblegum", slug: "wet-green-bubblegum", year: 2022, medium: "Drawing on paper", dimensions: "50x70 cm", imageUrl: "/artworks/drawings/wet-green-bubblegum.jpg", categoryId: catDrawings.id, tags: ["drawing", "bubblegum"], forSale: true });

  // ===== SPECIAL COMMISSIONS =====
  await art({ title: "Israeli Navy Exercise", slug: "israeli-navy-exercise", year: 2020, medium: "Oil on canvas", dimensions: "80x100 cm", imageUrl: "/artworks/commissions/israeli-navy-exercise.jpg", categoryId: catCommissions.id, tags: ["military", "navy", "commission"] });
  await art({ title: "Soldiers Praying Shacharit", slug: "soldiers-praying-shacharit", year: 2020, medium: "Oil on canvas", dimensions: "100x80 cm", imageUrl: "/artworks/commissions/soldiers-praying-shacharit.jpg", categoryId: catCommissions.id, tags: ["military", "prayer", "commission"] });
  await art({ title: "Israel Marine Graduation", slug: "israel-marine-graduation", year: 2020, medium: "Oil on canvas", dimensions: "100x80 cm", imageUrl: "/artworks/commissions/israel-marine-graduation.jpg", categoryId: catCommissions.id, tags: ["military", "marines", "commission"] });
  await art({ title: "Warriors at the Kotel", slug: "warriors-at-the-kotel", year: 2020, medium: "Oil on canvas", dimensions: "80x100 cm", imageUrl: "/artworks/commissions/warriors-at-the-kotel.jpg", categoryId: catCommissions.id, tags: ["military", "kotel", "commission"] });
  await art({ title: "Nahal Brigade", slug: "nahal-brigade", year: 2022, medium: "Oil on canvas", dimensions: "80x100 cm", imageUrl: "/artworks/commissions/nahal-brigade.jpg", categoryId: catCommissions.id, tags: ["military", "nahal", "commission"] });
  await art({ title: "The Sibyl Gabriela Mistral", slug: "sibyl-gabriela-mistral", year: 2019, medium: "Oil on canvas", dimensions: "80x100 cm", imageUrl: "/artworks/commissions/sibyl-gabriela-mistral.jpg", categoryId: catCommissions.id, tags: ["portrait", "Chile", "embassy", "commission"], featured: true });
  await art({ title: "Baruch Family", slug: "baruch-family", year: 2018, medium: "Oil on canvas", dimensions: "84x90 cm", imageUrl: "/artworks/commissions/baruch-family.jpg", categoryId: catCommissions.id, tags: ["portrait", "family", "commission"] });

  console.log(`✓ ${order} artworks created`);

  // About page with real bio
  const aboutBody = JSON.stringify([
    { type: "paragraph", text: "Born in Chile, 1974" },
    { type: "paragraph", text: "1992-1997, Graduate from Arte Real International Painting Academy" },
    { type: "paragraph", text: "1993-1996, SEK International University of Chile. BA in Art History and Art Restoration. Lives and works in Israel." },
    { type: "heading", text: "Solo Exhibitions" },
    { type: "paragraph", text: "Israel from the Inside, Santiago, Chile, Circle Israeli of Santiago, 2016" },
    { type: "paragraph", text: "In the Eye of the Beholder, Tel Aviv, Israel, Montefiore Gallery, 2014" },
    { type: "paragraph", text: "Magical Realism, Tel Aviv, Horace Richter Gallery, 2004" },
    { type: "heading", text: "Group Exhibitions" },
    { type: "paragraph", text: "Fresh Paint 2023 Art Fair, Tel Aviv, Wertheimer gallery, May 2023" },
    { type: "paragraph", text: "Daily Lives, Tel Aviv, Lemon Frame gallery, Dec 2022" },
    { type: "paragraph", text: "Interface, Tel Aviv, Lemon Frame gallery, Aug 2022" },
    { type: "paragraph", text: "Commedia della Vita, Tel Aviv, Lemon Frame gallery, Feb 2022" },
    { type: "paragraph", text: "Dreamers, Florence, Italy, ArtExpertise Gallery and Mentana Gallery, 2017" },
    { type: "paragraph", text: "Chilean Artists Exhibition, Netanya and Kiryat Ono, Israel, 2013" },
    { type: "paragraph", text: "Group Exhibition, Miami, US, Tribes Gallery at Red Dot Miami, 2012" },
    { type: "paragraph", text: "Duo exhibition, Israel, Tiroche Gallery, 2011" },
    { type: "paragraph", text: "Group Exhibition, New York, US, Smart-Publishing Gallery at Arte Expo, 2005" },
    { type: "paragraph", text: "Group Exhibition, Israel, Chilean Embassy, 2004" },
    { type: "paragraph", text: "Group Exhibition, Chile, SEK International University, 1996. Honorary mention for 'A Look to the North'" },
  ]);

  await prisma.page.create({
    data: { title: "About", slug: "about", heroTitle: "Gustavo Bar Valenzuela", heroSubtitle: "Chilean-Israeli Artist", heroImageUrl: "/artworks/site/about-artist.jpg", isPublished: true, bodyContent: aboutBody },
  });
  await prisma.page.create({
    data: { title: "Home", slug: "home", heroTitle: "Valenzuelarts", heroSubtitle: "Gustavo Bar Valenzuela — Chilean-Israeli Artist", heroImageUrl: "/artworks/site/hero.jpg", isPublished: true },
  });
  console.log("✓ Pages");

  console.log("\n✅ Done! Login: admin@gallery.com / changeme123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
