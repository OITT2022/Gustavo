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
    data: { name: "Period 2004–2016", slug: "period-2004-2016", description: "At this time my painting is influenced by the beauty of everyday moments in Israel and its culture.", type: "PERIOD", coverImageUrl: "https://static.wixstatic.com/media/c7a17d_cf954cdc4f2743e38ad9e10289a9f3b8.jpg/v1/fill/w_622,h_933,al_c,q_85/c7a17d_cf954cdc4f2743e38ad9e10289a9f3b8.jpg", sortOrder: 1 },
  });
  const cat2017 = await prisma.category.create({
    data: { name: "Period 2017–2024", slug: "period-2017-2024", description: "Recent works exploring transformation, gravity, color transgression, and the human figure.", type: "PERIOD", coverImageUrl: "https://static.wixstatic.com/media/c7a17d_34e07af039c7436d9ef820e313f58924~mv2.jpg/v1/fill/w_622,h_466,al_c,q_80/c7a17d_34e07af039c7436d9ef820e313f58924~mv2.jpg", sortOrder: 2 },
  });
  const catDrawings = await prisma.category.create({
    data: { name: "Drawings & Sketches", slug: "drawings-and-sketches", description: "Charcoal, conte, and graphite works on paper — the foundation of classical technique.", type: "DRAWINGS", coverImageUrl: "https://static.wixstatic.com/media/c7a17d_886d30b19b3c45f7a64d317fda5e6dce~mv2.jpg/v1/fill/w_292,h_424,al_c,q_80/c7a17d_886d30b19b3c45f7a64d317fda5e6dce~mv2.jpg", sortOrder: 3 },
  });
  const catCommissions = await prisma.category.create({
    data: { name: "Special Commissions", slug: "special-commissions", description: "Custom pieces created for private collectors, institutions, and military commemorations.", type: "COMMISSIONS", coverImageUrl: "https://static.wixstatic.com/media/c7a17d_01c8e90bdb374eccb4bc018e5ac72571~mv2.jpg/v1/fill/w_400,h_302,al_c,q_80/c7a17d_01c8e90bdb374eccb4bc018e5ac72571~mv2.jpg", sortOrder: 4 },
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
  await art({ title: "Let Go at 3:00", slug: "let-go-at-3", year: 2004, medium: "Oil color and alkyd resin on canvas", dimensions: "100x150 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_cf954cdc4f2743e38ad9e10289a9f3b8.jpg/v1/fill/w_622,h_933,al_c,q_85/c7a17d_cf954cdc4f2743e38ad9e10289a9f3b8.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["realism", "Israel"], featured: true });
  await art({ title: "Nostalgia in Israel", slug: "nostalgia-in-israel", year: 2006, medium: "Oil color and alkyd resin on canvas", dimensions: "100x150 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_d5f2c50a197349eda0251ec342b5d6f8.jpg/v1/fill/w_622,h_879,al_c,q_85/c7a17d_d5f2c50a197349eda0251ec342b5d6f8.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["Israel", "nostalgia"] });
  await art({ title: "The Acordionist", slug: "the-acordionist", year: 2006, medium: "Oil on canvas laid on board", dimensions: "100x140 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_a8d798dc499b44adaa79405e2032538f.jpg/v1/fill/w_622,h_873,al_c,q_85/c7a17d_a8d798dc499b44adaa79405e2032538f.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["music", "portrait"], featured: true });
  await art({ title: "The Acordenist II", slug: "the-acordenist-ii", year: 2015, medium: "Oil on canvas", dimensions: "100x140 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_ff9f8af139d14b068e35d396337b70df.jpg/v1/fill/w_622,h_845,al_c,q_85/c7a17d_ff9f8af139d14b068e35d396337b70df.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["music", "portrait"] });
  await art({ title: "Cellist in Ramat-Gan", slug: "cellist-in-ramat-gan", year: 2013, medium: "Oil on canvas", dimensions: "90x120 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_89a40bd06b774ee1949c6f7e94edc92d.jpg/v1/fill/w_622,h_825,al_c,q_85/c7a17d_89a40bd06b774ee1949c6f7e94edc92d.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["music", "cello"] });
  await art({ title: "Tel-Avivi Artist", slug: "tel-avivi-artist", year: 2010, medium: "Oil on canvas", dimensions: "80x140 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_234c8e99f6104aae9240046b931081ad.jpg/v1/fill/w_622,h_1079,al_c,q_85/c7a17d_234c8e99f6104aae9240046b931081ad.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["Tel Aviv", "portrait"] });
  await art({ title: "Shimon Peres", slug: "shimon-peres", year: 2014, medium: "Oil on linen glued to board", dimensions: "70x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_f68964cf04594d51b66725f1acd58136~mv2.jpg/v1/fill/w_622,h_885,al_c,q_85/c7a17d_f68964cf04594d51b66725f1acd58136~mv2.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["portrait", "political"], featured: true });
  await art({ title: "Sunset in Tel Aviv", slug: "sunset-in-tel-aviv", year: 2008, medium: "Oil on canvas", dimensions: "70x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_f97f6da05a5f4f6b82e5157fcdc931e3.jpg/v1/fill/w_622,h_878,al_c,q_85/c7a17d_f97f6da05a5f4f6b82e5157fcdc931e3.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["landscape", "Tel Aviv", "sunset"] });
  await art({ title: "Sunset on Frishman Street", slug: "sunset-on-frishman", year: 2015, medium: "Oil on canvas", dimensions: "80x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_c00dd1ed88404af9bc802aa64a865b08~mv2.jpg/v1/fill/w_622,h_759,al_c,q_85/c7a17d_c00dd1ed88404af9bc802aa64a865b08~mv2.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["landscape", "Tel Aviv"] });
  await art({ title: "Winter in Tel Aviv", slug: "winter-in-tel-aviv", year: 2012, medium: "Oil on canvas", dimensions: "90x120 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_374d72db745f4a53805a8271a71e7557.jpg/v1/fill/w_622,h_460,al_c,q_80/c7a17d_374d72db745f4a53805a8271a71e7557.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["landscape", "Tel Aviv", "winter"] });
  await art({ title: "Jerusalem with Snow", slug: "jerusalem-with-snow", year: 2014, medium: "Oil on canvas", dimensions: "80x130 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_7d262a797cd3429781eb7b385ce7a133~mv2.jpg/v1/fill/w_622,h_378,al_c,q_80/c7a17d_7d262a797cd3429781eb7b385ce7a133~mv2.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["landscape", "Jerusalem", "snow"] });
  await art({ title: "Love in Tel Aviv", slug: "love-in-tel-aviv", year: 2016, medium: "Oil on canvas", dimensions: "90x120 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_11da51b0f37f48009c606169e6d71566~mv2.jpg/v1/fill/w_622,h_471,al_c,q_80/c7a17d_11da51b0f37f48009c606169e6d71566~mv2.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["Tel Aviv", "love"] });
  await art({ title: "View from Yafo to Tel Aviv", slug: "view-from-yafo", year: 2014, medium: "Oil on canvas", dimensions: "120x90 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_69f7c97742f1486fa6c0843e65b25087~mv2.jpg/v1/fill/w_622,h_445,al_c,q_80/c7a17d_69f7c97742f1486fa6c0843e65b25087~mv2.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["landscape", "Jaffa", "Tel Aviv"] });
  await art({ title: "Light in Jaffa", slug: "light-in-jaffa", year: 2012, medium: "Oil on canvas", dimensions: "100x120 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_ff56502742b0434e9e3079a4e94f6662.jpg/v1/fill/w_622,h_750,al_c,q_85/c7a17d_ff56502742b0434e9e3079a4e94f6662.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["landscape", "Jaffa"] });
  await art({ title: "Kineret", slug: "kineret", year: 2011, medium: "Oil on canvas", dimensions: "130x180 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_c294ebe32c274aab82e2cd5cdfc1ec84.jpg/v1/fill/w_622,h_451,al_c,q_80/c7a17d_c294ebe32c274aab82e2cd5cdfc1ec84.jpg", categoryId: cat2004.id, collectionPeriod: "2004-2016", tags: ["landscape", "Kineret", "Galilee"] });

  // ===== PERIOD 2017-2024 =====
  await art({ title: "Nude", slug: "nude-2017", year: 2017, medium: "Oil on canvas", dimensions: "90x120 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_34e07af039c7436d9ef820e313f58924~mv2.jpg/v1/fill/w_622,h_466,al_c,q_80/c7a17d_34e07af039c7436d9ef820e313f58924~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["figure", "nude"] });
  await art({ title: "Asking God", slug: "asking-god", year: 2018, medium: "Oil on canvas", dimensions: "100x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_4a883ee1554c4ebaadee6e4a65be31e8~mv2.jpg/v1/fill/w_622,h_606,al_c,q_85/c7a17d_4a883ee1554c4ebaadee6e4a65be31e8~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["spiritual", "figure"], forSale: true, featured: true });
  await art({ title: "Portrait of Penelope", slug: "portrait-of-penelope", year: 2018, medium: "Oil on canvas", dimensions: "130x180 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_2e86a69732c44827be3ddc277ac10d9f~mv2.jpg/v1/fill/w_622,h_898,al_c,q_85/c7a17d_2e86a69732c44827be3ddc277ac10d9f~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "transformation"], forSale: true });
  await art({ title: "Geisha", slug: "geisha", year: 2019, medium: "Oil on canvas", dimensions: "120x120 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_3d65cc7322614de0afb6bfe720a8b4c9~mv2.jpg/v1/fill/w_622,h_625,al_c,q_85/c7a17d_3d65cc7322614de0afb6bfe720a8b4c9~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "geisha"], forSale: true, featured: true });
  await art({ title: "The Pain of Them", slug: "the-pain-of-them", year: 2020, medium: "Oil on canvas", dimensions: "180x130 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_c75d8251a16747beb21a614e844e6c68~mv2.jpg/v1/fill/w_622,h_842,al_c,q_85/c7a17d_c75d8251a16747beb21a614e844e6c68~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["figure", "emotion"], forSale: true });
  await art({ title: "Contrast Portrait", slug: "contrast-portrait", year: 2020, medium: "Oil on canvas", dimensions: "140x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_2520fcc2c4594ace8261894581e6a22d~mv2.jpg/v1/fill/w_622,h_863,al_c,q_85/c7a17d_2520fcc2c4594ace8261894581e6a22d~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "contrast"] });
  await art({ title: "Pelope's Uncertainty", slug: "pelopes-uncertainty", year: 2020, medium: "Oil on canvas", dimensions: "100x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_35f27a4480854a8babaad385c7f51d8d~mv2.jpg/v1/fill/w_622,h_633,al_c,q_85/c7a17d_35f27a4480854a8babaad385c7f51d8d~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "uncertainty"], forSale: true });
  await art({ title: "Transgression Color", slug: "transgression-color", year: 2018, medium: "Oil on canvas", dimensions: "140x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_c9c7b2468fb9492db377b66f9513d06a~mv2.jpg/v1/fill/w_622,h_451,al_c,q_80/c7a17d_c9c7b2468fb9492db377b66f9513d06a~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["color", "transgression"] });
  await art({ title: "Green Gum", slug: "green-gum", year: 2020, medium: "Oil on canvas", dimensions: "90x120 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_b1eb5998f9ab42d9ab658493b689466b~mv2.jpg/v1/fill/w_622,h_878,al_c,q_85/c7a17d_b1eb5998f9ab42d9ab658493b689466b~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "bubblegum"] });
  await art({ title: "Hipster from Tokio", slug: "hipster-from-tokio", year: 2021, medium: "Oil on canvas", dimensions: "130x180 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_183e17681dab44d9a262e465b95aa011~mv2.jpg/v1/fill/w_622,h_845,al_c,q_85/c7a17d_183e17681dab44d9a262e465b95aa011~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "hipster", "Tokyo"] });
  await art({ title: "Sweet Invitation", slug: "sweet-invitation", year: 2021, medium: "Oil on canvas", dimensions: "140x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_e1c3c67abfe5493680fe515ac72c3a24~mv2.jpg/v1/fill/w_622,h_927,al_c,q_85/c7a17d_e1c3c67abfe5493680fe515ac72c3a24~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "invitation"] });
  await art({ title: "Anastasia and the Watermelon", slug: "anastasia-and-the-watermelon", year: 2022, medium: "Oil on canvas", dimensions: "90x120 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_b7101b1029af438f8cd038a3665d3ee3~mv2.jpg/v1/fill/w_622,h_460,al_c,q_80/c7a17d_b7101b1029af438f8cd038a3665d3ee3~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "watermelon"], forSale: true });
  await art({ title: "Arlecchino", slug: "arlecchino", year: 2020, medium: "Oil on canvas", dimensions: "140x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_a4c424ae3f9a4bf5a5973998b6d64a32~mv2.jpg/v1/fill/w_622,h_884,al_c,q_85/c7a17d_a4c424ae3f9a4bf5a5973998b6d64a32~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["gravity", "harlequin"], forSale: true, featured: true });
  await art({ title: "Hipster Meditation", slug: "hipster-meditation", year: 2020, medium: "Oil on canvas", dimensions: "100x140 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_3641e529742c4188871ea149fde0f069~mv2.jpg/v1/fill/w_622,h_853,al_c,q_85/c7a17d_3641e529742c4188871ea149fde0f069~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["portrait", "meditation"] });
  await art({ title: "Transgression of Color - Pink", slug: "transgression-pink", year: 2022, medium: "Oil on canvas", dimensions: "100x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_99a251688c36451ca24286976eeaa867~mv2.jpg/v1/fill/w_622,h_608,al_c,q_85/c7a17d_99a251688c36451ca24286976eeaa867~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["color", "transgression", "pink"], forSale: true });
  await art({ title: "Entropia (Caos)", slug: "entropia-caos", year: 2023, medium: "Oil on canvas", dimensions: "130x130 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_0c7cab976a9a416e86db75fbe8de8f4b~mv2.jpg/v1/fill/w_315,h_309,al_c,q_80/c7a17d_0c7cab976a9a416e86db75fbe8de8f4b~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["entropy", "chaos"], forSale: true });
  await art({ title: "Alice's Fall into Wonderland", slug: "alices-fall-into-wonderland", year: 2024, medium: "Oil on canvas", dimensions: "140x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_871f80f99f774a959df89f6c8663321e~mv2.jpg/v1/fill/w_315,h_470,al_c,q_80/c7a17d_871f80f99f774a959df89f6c8663321e~mv2.jpg", categoryId: cat2017.id, collectionPeriod: "2017-2024", tags: ["gravity", "alice", "wonderland"], forSale: true, featured: true });

  // ===== DRAWINGS & SKETCHES =====
  await art({ title: "Sketch for Shishy I", slug: "sketch-shishy-i", year: 2015, medium: "Charcoal on paper", dimensions: "38x57 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_886d30b19b3c45f7a64d317fda5e6dce~mv2.jpg/v1/fill/w_292,h_424,al_c,q_80/c7a17d_886d30b19b3c45f7a64d317fda5e6dce~mv2.jpg", categoryId: catDrawings.id, tags: ["sketch", "charcoal", "portrait"] });
  await art({ title: "Sketch for Mother", slug: "sketch-for-mother", year: 2015, medium: "Charcoal on paper", dimensions: "37x57 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_b257e17aba9c45eeb4c222ac0ae290d1~mv2.jpg/v1/fill/w_292,h_418,al_c,q_80/c7a17d_b257e17aba9c45eeb4c222ac0ae290d1~mv2.jpg", categoryId: catDrawings.id, tags: ["sketch", "charcoal", "portrait"] });
  await art({ title: "Sketch for Father", slug: "sketch-for-father", year: 2015, medium: "Charcoal on paper", dimensions: "37x57 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_194522fab0bb4fcda95d14dec87b5830~mv2.jpg/v1/fill/w_292,h_413,al_c,q_80/c7a17d_194522fab0bb4fcda95d14dec87b5830~mv2.jpg", categoryId: catDrawings.id, tags: ["sketch", "charcoal", "portrait"] });
  await art({ title: "Sketch for Sol", slug: "sketch-for-sol", year: 2012, medium: "Conte on paper", dimensions: "70x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_5a11643b96a44e1f84354312297bcf01.jpg/v1/fill/w_292,h_219,al_c,q_80/c7a17d_5a11643b96a44e1f84354312297bcf01.jpg", categoryId: catDrawings.id, tags: ["sketch", "conte"] });
  await art({ title: "Sketch for Alma", slug: "sketch-for-alma", year: 2015, medium: "Conte on paper", dimensions: "41x60 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_a5329280cfd44e869c29a7f0c2898e17~mv2.jpg/v1/fill/w_292,h_431,al_c,q_80/c7a17d_a5329280cfd44e869c29a7f0c2898e17~mv2.jpg", categoryId: catDrawings.id, tags: ["sketch", "conte", "portrait"] });
  await art({ title: "Yafo Street Jerusalem", slug: "yafo-street-jerusalem", year: 2016, medium: "Charcoal and graphite", dimensions: "20x35 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_117491f7287d4bf0824ded449324c829~mv2.jpg/v1/fill/w_292,h_178,al_c,q_80/c7a17d_117491f7287d4bf0824ded449324c829~mv2.jpg", categoryId: catDrawings.id, tags: ["sketch", "Jerusalem", "street"] });
  await art({ title: "Sweet Wet in Pandemic", slug: "sweet-wet-pandemic", year: 2022, medium: "Drawing on paper", dimensions: "50x70 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_5797c611587844c685e5b39b037ca2bb~mv2.jpg/v1/fill/w_292,h_390,al_c,q_80/c7a17d_5797c611587844c685e5b39b037ca2bb~mv2.jpg", categoryId: catDrawings.id, tags: ["drawing", "pandemic"], forSale: true });
  await art({ title: "Wet Green Bubblegum", slug: "wet-green-bubblegum", year: 2022, medium: "Drawing on paper", dimensions: "50x70 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_84c40960da054c06ad7189a1dac7bdca~mv2.jpg/v1/fill/w_292,h_407,al_c,q_80/c7a17d_84c40960da054c06ad7189a1dac7bdca~mv2.jpg", categoryId: catDrawings.id, tags: ["drawing", "bubblegum"], forSale: true });

  // ===== SPECIAL COMMISSIONS =====
  await art({ title: "Israeli Navy Exercise", slug: "israeli-navy-exercise", year: 2020, medium: "Oil on canvas", dimensions: "80x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_01c8e90bdb374eccb4bc018e5ac72571~mv2.jpg/v1/fill/w_400,h_302,al_c,q_80/c7a17d_01c8e90bdb374eccb4bc018e5ac72571~mv2.jpg", categoryId: catCommissions.id, tags: ["military", "navy", "commission"] });
  await art({ title: "Soldiers Praying Shacharit", slug: "soldiers-praying-shacharit", year: 2020, medium: "Oil on canvas", dimensions: "100x80 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_f1da5650ab55481c90d7f271255bd1d2~mv2.jpg/v1/fill/w_400,h_314,al_c,q_80/c7a17d_f1da5650ab55481c90d7f271255bd1d2~mv2.jpg", categoryId: catCommissions.id, tags: ["military", "prayer", "commission"] });
  await art({ title: "Israel Marine Graduation", slug: "israel-marine-graduation", year: 2020, medium: "Oil on canvas", dimensions: "100x80 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_5ac7513de3ef429e9901e6cc63066893~mv2.jpg/v1/fill/w_400,h_318,al_c,q_80/c7a17d_5ac7513de3ef429e9901e6cc63066893~mv2.jpg", categoryId: catCommissions.id, tags: ["military", "marines", "commission"] });
  await art({ title: "Warriors at the Kotel", slug: "warriors-at-the-kotel", year: 2020, medium: "Oil on canvas", dimensions: "80x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_ce841cec57c4483997c4acf2d83e7212~mv2.jpg/v1/fill/w_400,h_316,al_c,q_80/c7a17d_ce841cec57c4483997c4acf2d83e7212~mv2.jpg", categoryId: catCommissions.id, tags: ["military", "kotel", "commission"] });
  await art({ title: "Nahal Brigade", slug: "nahal-brigade", year: 2022, medium: "Oil on canvas", dimensions: "80x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_f239213a7f86424ca639e7a0d3f92e3f~mv2.jpg/v1/fill/w_400,h_323,al_c,q_80/c7a17d_f239213a7f86424ca639e7a0d3f92e3f~mv2.jpg", categoryId: catCommissions.id, tags: ["military", "nahal", "commission"] });
  await art({ title: "The Sibyl Gabriela Mistral", slug: "sibyl-gabriela-mistral", year: 2019, medium: "Oil on canvas", dimensions: "80x100 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_1cb23be2f7ac4b6a9597af2011948e86~mv2.jpg/v1/fill/w_400,h_531,al_c,q_80/c7a17d_1cb23be2f7ac4b6a9597af2011948e86~mv2.jpg", categoryId: catCommissions.id, tags: ["portrait", "Chile", "embassy", "commission"], featured: true });
  await art({ title: "Baruch Family", slug: "baruch-family", year: 2018, medium: "Oil on canvas", dimensions: "84x90 cm", imageUrl: "https://static.wixstatic.com/media/c7a17d_09198da250624270a078998d62624d86~mv2.jpg/v1/fill/w_400,h_415,al_c,q_80/c7a17d_09198da250624270a078998d62624d86~mv2.jpg", categoryId: catCommissions.id, tags: ["portrait", "family", "commission"] });

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
    data: { title: "About", slug: "about", heroTitle: "Gustavo Bar Valenzuela", heroSubtitle: "Chilean-Israeli Artist", heroImageUrl: "https://static.wixstatic.com/media/c7a17d_1049373918544f84afc675d29d53b0f7~mv2.jpg/v1/fill/w_608,h_393,al_c,q_80/IMG_7612b.jpg", isPublished: true, bodyContent: aboutBody },
  });
  await prisma.page.create({
    data: { title: "Home", slug: "home", heroTitle: "Valenzuelarts", heroSubtitle: "Gustavo Bar Valenzuela — Chilean-Israeli Artist", heroImageUrl: "https://static.wixstatic.com/media/c7a17d_1a78f5203a794f8cbbfd94a6248d157f~mv2.jpg/v1/fill/w_1920,h_1164,al_c,q_90/c7a17d_1a78f5203a794f8cbbfd94a6248d157f~mv2.jpg", isPublished: true },
  });
  console.log("✓ Pages");

  console.log("\n✅ Done! Login: admin@gallery.com / changeme123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
