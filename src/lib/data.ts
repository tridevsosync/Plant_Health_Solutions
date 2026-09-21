// Seed / master data for Plant Health Solutions Pvt. Ltd.

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  stock: number;
  unit: string;
  image: string;
  image2?: string;
  images?: string[];
  description: string;
  benefits: string[];
  usage: string;
  ingredients: string;
  badges: string[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
};

export type Blog = {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  readTime: number;
  featured: boolean;
  body: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  place: string;
  crop: string;
  rating: number;
  quote: string;
  productId?: string;
  productName?: string;
  status?: "Pending" | "Approved" | "Rejected";
  date?: string;
  image?: string;
};

export type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  status?: "Pending" | "Approved" | "Rejected";
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  active: boolean;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  unit?: string;
  image?: string;
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  address: string;
  payment: string;
  paymentId?: string;
  paymentStatus?: "Pending" | "Paid" | "Failed";
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
};


export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "New" | "Answered";
};

export type Coupon = {
  code: string;
  discount: number;
  minOrder: number;
  description: string;
};

export type Settings = {
  name: string;
  owner: string;
  phone: string;
  whatsapp?: string;
  email1: string;
  email2: string;
  address: string;
  description: string;
  gst?: string;
  announcement?: string;
  freeShippingThreshold?: number;
  shippingFee?: number;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  // Contact page custom fields
  workingHours?: string;
  contactHeroBadge?: string;
  contactHeroTitle?: string;
  contactHeroSubtitle?: string;
  contactHeroImage?: string;
  facilityName?: string;
  facilityDescription?: string;
  facilityLocationTitle?: string;
  facilityImage?: string;
  googleMapsUrl?: string;
  enquiryFormTitle?: string;
  enquiryFormSubtitle?: string;
  dealerBadge?: string;
  dealerTitle?: string;
  dealerDesc?: string;
  dealerButtonText?: string;
  dealerWhatsappText?: string;
  soilTestingBadge?: string;
  soilTestingTitle?: string;
  soilTestingDesc?: string;
  soilTestingButtonText?: string;
  soilTestingLinkUrl?: string;
};

export type Crop = {
  slug: string;
  name: string;
  image: string;
  summary: string;
  diseases: { name: string; symptom: string; control: string }[];
  pests: { name: string; symptom: string; control: string }[];
  nutrition: { stage: string; schedule: string }[];
  calendar: { month: string; activity: string }[];
  products: string[];
};

export const COMPANY = {
  name: "Plant Health Solutions Pvt. Ltd.",
  owner: "Dr. R. M. Kulkarni",
  address:
    "Plant Health Solutions Horticulture Research and Extension Center, NH-52, Vijayapur - Solapur Road, Tidagundi, Vijayapura, Karnataka 586119",
  phone: "+91 91759 55009",
  whatsapp: "919175955009",
  email1: "planthealthsol@gmail.com",
  email2: "dr_prashant84@yahoo.com",
  description:
    "Working in Agriculture and Agricultural Research manufacturing Bio Fertilizers, Biostimulants, Bio Chemical Fertilizers, Bio Control Agents, Organic Manures, Plant/Animal/Fish Extracts, Water Soluble Fertilizers, Micronutrients and Crop Protection Products.",
};

export const categories: Category[] = [
  {
    id: "cat_bio_fertilizers",
    name: "Bio Fertilizers",
    slug: "bio-fertilizers",
    description: "High-potency microbial inoculants, NPK consortia, and phosphate solubilizers developed with University of Horticultural Sciences, Bagalkot.",
    icon: "Sprout",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934983/plant_health_solutions/categories/neo-bio-npk.png",
  },
  {
    id: "cat_biological_crop_protection",
    name: "Biological Crop Protection",
    slug: "biological-crop-protection",
    description: "Bio-fungicides, bio-nematicides, and bio-insecticides including Trichoderma, Beauveria, Metarhizium, and Paecilomyces.",
    icon: "ShieldCheck",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934984/plant_health_solutions/categories/nova-tricho.png",
  },
  {
    id: "cat_biostimulants",
    name: "Biostimulants & Growth Promoters",
    slug: "biostimulants",
    description: "Cold-extracted liquid seaweed, 98% potassium humates, and super potassium fulvates for maximum crop vigor.",
    icon: "Leaf",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934987/plant_health_solutions/categories/seavita.png",
  },
  {
    id: "cat_organic_decomposers",
    name: "Organic Decomposers & Manures",
    slug: "organic-decomposers",
    description: "Microbial waste decomposers for in-situ residue breakdown and rapid 30-day composting.",
    icon: "Wheat",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934990/plant_health_solutions/categories/neo-decomposer.png",
  },
  {
    id: "cat_water_soluble",
    name: "Water Soluble Fertilizers",
    slug: "water-soluble-fertilizers",
    description: "High-purity fertigation grades and micronutrient chelates for drip irrigation and foliar feeding.",
    icon: "Droplets",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb2252a?w=800&q=70",
  },
];

export const products: Product[] = [
  {
    id: "neo-bio-npk",
    name: "Neo BIO NPK",
    category: "Bio Fertilizers",
    price: 450,
    oldPrice: 550,
    rating: 4.9,
    reviews: 38,
    stock: 250,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934938/plant_health_solutions/products/neo-bio-npk.png",
    description:
      "Neo BIO NPK is an advanced Microbial Consortium developed by Plant Health Solutions, an onsite incubatee of University of Horticultural Sciences, Bagalkot. Formulated with high-potency Nitrogen-fixing (Azotobacter), Phosphate-solubilizing (PSB), and Potash-mobilizing (KMB) microbial strains. It optimizes primary nutrient availability in the rhizosphere, promotes vigorous root and vegetative development, and reduces reliance on chemical fertilizers across all horticultural and agricultural crops.",
    benefits: [
      "Technology developed by & onsite incubatee of University of Horticultural Sciences, Bagalkot",
      "Supplies high-count active Nitrogen, Phosphorus, and Potassium mobilizing microbes",
      "Reduces synthetic chemical fertilizer requirement by 25% to 30%",
      "Enhances root mass, soil health, and beneficial microbial population",
      "Proven on Tomato, Brinjal, Chilli, Cucurbits, Onion, Beans, Leafy vegetables and Fruit orchards",
    ],
    usage:
      "Drip Irrigation / Fertigation: 1–2 Litres per acre dissolved in 200L water.\nFoliar Spray: 4–5 ml per Litre of clean water during early vegetative and flowering stages.\nSoil Drenching: 2 Litres per acre near root zone.",
    ingredients:
      "Azotobacter chroococcum, Bacillus megaterium (PSB), Frateuria aurantia (KMB) - Minimum count 1x10^9 CFU/ml.",
    badges: ["featured", "best seller"],
  },
  {
    id: "nova-beauveria",
    name: "Nova Beauveria",
    category: "Biological Crop Protection",
    price: 480,
    oldPrice: 600,
    rating: 4.8,
    reviews: 29,
    stock: 180,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934939/plant_health_solutions/products/nova-beauveria.png",
    description:
      "Nova Beauveria is an entomopathogenic bio-insecticide developed in collaboration with University of Horticultural Sciences, Bagalkot. It contains virulent spores of Beauveria bassiana that adhere to and penetrate the cuticle of target insect pests, rapidly multiplying inside the insect hemolymph to eliminate caterpillars, borers, mealybugs, thrips, and aphids without leaving toxic chemical residues.",
    benefits: [
      "Researched and validated by University of Horticultural Sciences, Bagalkot",
      "Broad-spectrum biological control against caterpillars, fruit/shoot borers, whiteflies, mealybugs, thrips, and aphids",
      "Safe for pollinators, honeybees, parasitoids, and earthworms",
      "Zero-residue, ideal for organic farming and export-oriented crops",
      "Compatible with integrated pest management (IPM) practices",
    ],
    usage:
      "Foliar Spray: 2–3 ml per Litre of clean water. Spray thoroughly on both upper and lower leaf surfaces during evening hours.\nSoil Drenching: 2 Litres per acre for soil grubs and cutworms.",
    ingredients:
      "Beauveria bassiana - Minimum count 1x10^8 CFU/ml.",
    badges: ["featured", "organic"],
  },
  {
    id: "nova-meta",
    name: "Nova Meta",
    category: "Biological Crop Protection",
    price: 490,
    oldPrice: 620,
    rating: 4.8,
    reviews: 24,
    stock: 160,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934941/plant_health_solutions/products/nova-meta.png",
    description:
      "Nova Meta is a biological insecticide developed at University of Horticultural Sciences, Bagalkot onsite incubation facility. It is formulated with high-spore-density Metarhizium anisopliae. The fungal spores specifically parasitize subterranean and foliage insect pests, including root grubs, white grubs, termites, beetles, grasshoppers, and cutworms.",
    benefits: [
      "Technology developed by & onsite incubatee of University of Horticultural Sciences, Bagalkot",
      "Specialized biological control for devastating soil pests: Root Grubs, White Grubs, Termites & Wireworms",
      "Long-lasting soil persistence providing continuous biological defense",
      "Zero chemical toxicity to beneficial soil organisms and groundwater",
      "Highly effective in Sugarcane, Groundnut, Arecanut, Banana, Ginger, and Turmeric",
    ],
    usage:
      "Soil Drenching / Drip: 2 Litres per acre mixed with 200L water or 100 kg well-rotted FYM/compost.\nFoliar Spray: 3 ml per Litre of water for foliage pest outbreaks.",
    ingredients:
      "Metarhizium anisopliae - Minimum count 1x10^8 CFU/ml.",
    badges: ["trending", "organic"],
  },
  {
    id: "neo-psb",
    name: "Neo PSB",
    category: "Bio Fertilizers",
    price: 420,
    oldPrice: 520,
    rating: 4.8,
    reviews: 31,
    stock: 220,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934942/plant_health_solutions/products/neo-psb.png",
    description:
      "Neo PSB is a biological Phosphate Solubilizing Bacterial formulation researched and produced at University of Horticultural Sciences, Bagalkot incubation center. It secretes organic acids (gluconic, lactic, citric acids) and phosphatase enzymes that dissolve insoluble tricalcium, iron, and aluminum phosphates locked in the soil.",
    benefits: [
      "Technology developed by & onsite incubatee of University of Horticultural Sciences, Bagalkot",
      "Solubilizes up to 30–50 kg of fixed soil phosphorus per hectare",
      "Stimulates early root proliferation, root hair formation, and sturdy stems",
      "Enhances flower bud formation, fruit setting percentage, and crop maturity",
      "Reduces Single Super Phosphate (SSP) and DAP chemical fertilizer requirements",
    ],
    usage:
      "Drip Fertigation: 1–2 Litres per acre dissolved in irrigation water.\nSeed Treatment: 10 ml per kg of seed.\nSoil Application: 2 Litres per acre mixed in 100 kg compost or FYM.",
    ingredients:
      "Bacillus megaterium / Pseudomonas striata (PSB) - Minimum count 1x10^9 CFU/ml.",
    badges: ["best seller"],
  },
  {
    id: "nova-tricho",
    name: "Nova Tricho",
    category: "Biological Crop Protection",
    price: 460,
    oldPrice: 580,
    rating: 4.9,
    reviews: 42,
    stock: 280,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934943/plant_health_solutions/products/nova-tricho.png",
    description:
      "Nova Tricho is a broad-spectrum bio-fungicide developed with University of Horticultural Sciences, Bagalkot. Containing high CFU Trichoderma viride and harzianum, it operates via mycoparasitism, antibiosis, and competition for space and nutrients to suppress pathogenic soil fungi causing Root Rot, Collar Rot, Damping Off, Wilt, and Powdery Mildew.",
    benefits: [
      "Formulated & validated by University of Horticultural Sciences, Bagalkot",
      "Powerful biological protection against Fusarium Wilt, Rhizoctonia Root Rot, Pythium Damping Off, and Phytophthora",
      "Secretes chitinase and beta-glucanase enzymes that digest fungal cell walls",
      "Promotes induced systemic resistance (ISR) across all vegetable and fruit crops",
      "Enriches root rhizosphere biology and prevents crop lodging",
    ],
    usage:
      "Soil Application / Drenching: 2 Litres per acre mixed in 200L water near root base or with FYM.\nSeedling Dip: 10 ml per Litre of water before transplanting.\nFoliar Spray: 3–4 ml per Litre of water.",
    ingredients:
      "Trichoderma viride / Trichoderma harzianum - Minimum count 2x10^8 CFU/ml.",
    badges: ["featured", "best seller"],
  },
  {
    id: "black-gold",
    name: "Black Gold",
    category: "Biostimulants & Growth Promoters",
    price: 580,
    oldPrice: 720,
    rating: 4.9,
    reviews: 53,
    stock: 310,
    unit: "1 kg",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934946/plant_health_solutions/products/black-gold.png",
    description:
      "Black Gold is a premium 98% Super Potassium Humate crystal biostimulant. It conditions soil physical structure, drastically improves Cation Exchange Capacity (CEC), prevents nutrient leaching, and triggers profuse lateral white root formation. Ideal for alkaline, saline, and light sandy soils.",
    benefits: [
      "Super Potassium Humate 98% 100% water soluble flakes/crystals",
      "Increases soil Cation Exchange Capacity (CEC) and unlocks trapped micro-nutrients",
      "Promotes deep taproot and dense white feeder root proliferation",
      "Improves soil water-holding capacity and buffers against soil salinity",
      "Synergizes with all Bio Fertilizers and NPK water soluble fertilizers",
    ],
    usage:
      "Drip Fertigation: 500g – 1 kg per acre dissolved in irrigation water.\nFoliar Spray: 1–2g per Litre of clean water.\nSoil Application: 1–2 kg per acre mixed with organic manure or basal fertilizers.",
    ingredients:
      "Super Potassium Humate 98% (Humic Acid > 65%, Potassium K2O > 10%, Fulvic Fraction > 15%).",
    badges: ["featured", "best seller"],
  },
  {
    id: "nova-bacillus",
    name: "Nova Bacillus",
    category: "Biological Crop Protection",
    price: 470,
    oldPrice: 590,
    rating: 4.8,
    reviews: 27,
    stock: 190,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934950/plant_health_solutions/products/nova-bacillus.png",
    description:
      "Nova Bacillus is an antagonistic biological bactericide and fungicide developed at University of Horticultural Sciences, Bagalkot. It colonizes plant foliage and root surfaces, producing lipopeptides (surfactin, iturin) that lyse bacterial cell walls and fungal spore membranes, preventing Bacterial Blight (Telya in Pomegranate), Bacterial Leaf Spot, and Anthracnose.",
    benefits: [
      "Developed at University of Horticultural Sciences, Bagalkot onsite incubation center",
      "Dual action: controls both destructive bacterial pathogens and fungal leaf diseases",
      "Specialized for Pomegranate Bacterial Blight (Xanthomonas axonopodis pv. punicae)",
      "Protects against Citrus Canker, Tomato Bacterial Wilt, and Ginger Soft Rot",
      "100% residue free, compatible with organic farming standards",
    ],
    usage:
      "Foliar Spray: 2–3 ml per Litre of water. Repeat every 10–14 days during high humidity or active disease pressure.\nDrenching / Drip: 1.5–2 Litres per acre.",
    ingredients:
      "Bacillus subtilis / Bacillus amyloliquefaciens - Minimum count 1x10^9 CFU/ml.",
    badges: ["featured", "trending"],
  },
  {
    id: "fulvate",
    name: "Fulvate",
    category: "Biostimulants & Growth Promoters",
    price: 620,
    oldPrice: 780,
    rating: 4.9,
    reviews: 36,
    stock: 200,
    unit: "1 kg",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934951/plant_health_solutions/products/fulvate.png",
    description:
      "Fulvate is an ultra-pure 80% Super Potassium Fulvate biostimulant powder with low molecular weight. It easily penetrates plant cell membranes, accelerating the translocation of minerals, sugars, and growth hormones directly into fruits, berries, and growing shoots for accelerated fruit sizing and color development.",
    benefits: [
      "Super Potassium Fulvate 80% with ultra-low molecular weight for rapid cellular entry",
      "Natural organic chelating agent for Zinc, Iron, Magnesium, and Boron",
      "Stimulates plant enzymatic respiration and photosynthetic activity",
      "Enhances sugar transport (Brix), fruit firmness, uniform color, and export sizing",
      "Compatible with all crop protection sprays, enhancing tank-mix absorption",
    ],
    usage:
      "Foliar Spray: 1g per Litre of water during vegetative, flowering, and fruit bulking stages.\nDrip Fertigation: 500g per acre mixed in irrigation system.",
    ingredients:
      "Potassium Fulvate 80% (Fulvic Acid > 50%, Potassium K2O > 12%, Trace Minerals).",
    badges: ["featured", "best seller"],
  },
  {
    id: "nova-verticillium",
    name: "Nova Verticillium",
    category: "Biological Crop Protection",
    price: 475,
    oldPrice: 600,
    rating: 4.8,
    reviews: 21,
    stock: 150,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934953/plant_health_solutions/products/nova-verticillium.png",
    description:
      "Nova Verticillium is a specialized entomopathogenic bio-insecticide developed with University of Horticultural Sciences, Bagalkot. The fungal conidia adhere to and infect soft-bodied sucking insects (Whiteflies, Jassids, Thrips, Mealybugs, Aphids, and Scale insects), generating the characteristic white halo effect that naturally wipes out pest colonies.",
    benefits: [
      "Researched & formulated with University of Horticultural Sciences, Bagalkot",
      "Biological control for destructive sucking pest complexes (Whitefly, Thrips, Aphids, Mealybugs)",
      "Causes white-halo epizootic disease in pest populations within 48–72 hours",
      "Controls viral disease vectors (Begomovirus, Leaf Curl Virus)",
      "Harmless to predatory mites, ladybird beetles, and pollinators",
    ],
    usage:
      "Foliar Spray: 3 ml per Litre of water. Ensure thorough coverage on undersides of leaves where sucking pests shelter.\nDrip / Drench: 2 Litres per acre for root mealybugs.",
    ingredients:
      "Verticillium lecanii (Lecanicillium lecanii) - Minimum count 1x10^8 CFU/ml.",
    badges: ["trending", "organic"],
  },
  {
    id: "neo-kmb",
    name: "Neo KMB",
    category: "Bio Fertilizers",
    price: 430,
    oldPrice: 540,
    rating: 4.8,
    reviews: 29,
    stock: 240,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934954/plant_health_solutions/products/neo-kmb.png",
    description:
      "Neo KMB is a high-potency liquid Potassium Mobilizing Bacterial culture formulated at University of Horticultural Sciences, Bagalkot incubation center. It converts insoluble silicate and locked minerals into bioavailable potassium (K2O), improving fruit weight, sugar content (Brix), disease resistance, and skin luster.",
    benefits: [
      "Technology developed by & onsite incubatee of University of Horticultural Sciences, Bagalkot",
      "Mobilizes 20–30 kg of locked soil potash per acre",
      "Improves fruit weight, uniform coloration, shine, and post-harvest shelf life",
      "Strengthens plant vascular bundles against lodging and moisture deficit stress",
      "Reduces MOP (Muriate of Potash) and SOP chemical fertilizer input costs by 20–25%",
    ],
    usage:
      "Drip Fertigation: 1–2 Litres per acre applied at vegetative and fruit development stages.\nSoil Drenching: 2 Litres per acre in 200L water around root zone.",
    ingredients:
      "Frateuria aurantia (Potash Mobilizing Bacteria) - Minimum count 1x10^9 CFU/ml.",
    badges: ["featured"],
  },
  {
    id: "seavita",
    name: "Seavita",
    category: "Biostimulants & Growth Promoters",
    price: 520,
    oldPrice: 650,
    rating: 4.9,
    reviews: 48,
    stock: 290,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934955/plant_health_solutions/products/seavita.png",
    description:
      "Seavita is a concentrated, pure cold-extracted liquid seaweed bio-stimulant. Rich in natural auxins, cytokinins, betaines, amino acids, and chelated trace elements, it stimulates cellular growth, increases flowering and fruit retention, and enhances crop resilience against drought, temperature fluctuations, and stress.",
    benefits: [
      "100% natural cold-extracted marine seaweed extract rich in natural phytohormones",
      "Promotes uniform cell division, shoot elongation, and profuse flowering",
      "Prevents flower and fruit drop, improving fruit retention and final yield",
      "Enhances chlorophyll synthesis and photosynthetic efficiency across all crop stages",
      "Builds systemic plant resilience against heat waves, drought, and chemical scorch",
    ],
    usage:
      "Foliar Spray: 2–3 ml per Litre of clean water. Apply during pre-flowering, fruit setting, and fruit sizing stages.\nDrip Fertigation: 1–2 Litres per acre.",
    ingredients:
      "Ascophyllum nodosum Seaweed Extract (Solid content > 20%), Natural Auxins, Cytokinins, Alginic Acid, Organic Matter.",
    badges: ["featured", "best seller"],
  },
  {
    id: "nova-paecilomyces",
    name: "Nova Paecilomyces",
    category: "Biological Crop Protection",
    price: 490,
    oldPrice: 630,
    rating: 4.9,
    reviews: 33,
    stock: 170,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934957/plant_health_solutions/products/nova-paecilomyces.png",
    description:
      "Nova Paecilomyces is a specialized biological nematicide researched and formulated with University of Horticultural Sciences, Bagalkot. It contains highly virulent spores of the egg-parasitic fungus Paecilomyces lilacinus (Purpureocillium lilacinum). The fungal hyphae directly infect, penetrate, and digest nematode egg shells, juveniles (J2–J4), and adult females, preventing root-knot gall formation and secondary wilt infection.",
    benefits: [
      "Formulated & validated by University of Horticultural Sciences, Bagalkot",
      "Highly effective biological control for Root-Knot Nematodes (Meloidogyne spp.), Cyst, Reniform, and Lesion Nematodes",
      "Destroys nematode egg clusters in the soil and root rhizosphere",
      "Prevents root galling, yellowing, stunting, and nematode-fungal disease complexes",
      "Safe for earthworms, beneficial soil bacteria, and human handlers; zero chemical toxicity",
    ],
    usage:
      "Soil Drenching / Drip: 2 Litres per acre dissolved in 200L water or mixed with 100 kg compost/FYM around the root zone.\nNursery Bed Treatment: 25 ml per 10 Litres of water applied to seedbeds before sowing.",
    ingredients:
      "Paecilomyces lilacinus (Purpureocillium lilacinum) - Minimum count 1x10^8 CFU/ml.",
    badges: ["featured", "trending"],
  },
  {
    id: "neo-decomposer",
    name: "Neo Decomposer",
    category: "Organic Decomposers & Manures",
    price: 390,
    oldPrice: 490,
    rating: 4.9,
    reviews: 51,
    stock: 300,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934960/plant_health_solutions/products/neo-decomposer.png",
    description:
      "Neo Decomposer is a multi-strain microbial consortium developed at University of Horticultural Sciences, Bagalkot onsite incubation center. Formulated with high-potency cellulolytic, lignolytic, and proteolytic microorganisms. It rapidly biodegrades crop residues (sugarcane trash, paddy straw, cotton stalks, agri-biomass, and animal manure) into nutrient-dense, odorless humus and enriched compost within 30 to 45 days, eliminating field burning and restoring soil organic matter.",
    benefits: [
      "Technology developed by & onsite incubatee of University of Horticultural Sciences, Bagalkot",
      "Accelerates decomposition of crop residues, paddy straw, sugarcane trash, and organic biomass",
      "Converts raw organic waste into rich humus and organic carbon in just 30–45 days",
      "Suppresses foul odor and destroys weed seeds and pathogen propagules during thermophilic composting",
      "Eco-friendly alternative to crop burning that dramatically enriches native soil microflora",
    ],
    usage:
      "In-situ Field Residue Decomposition: 2 Litres per acre sprayed over shredded crop residue followed by light rotavation and irrigation.\nCompost Pit: 1 Litre dissolved in 100L water per 1 Metric Tonne of organic waste/FYM.",
    ingredients:
      "Cellulolytic & Lignolytic Consortium (Trichoderma, Cellulomonas, Bacillus, Aspergillus) - Minimum count 1x10^9 CFU/ml.",
    badges: ["featured", "best seller"],
  },
  {
    id: "sonar",
    name: "Sonar",
    category: "Biostimulants & Growth Promoters",
    price: 550,
    oldPrice: 690,
    rating: 4.9,
    reviews: 29,
    stock: 220,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934964/plant_health_solutions/products/sonar.png",
    description:
      "Sonar is a scientifically formulated biostimulant containing Protein Hydrolysate 12.50% enriched with free L-amino acids and bioactive short-chain peptides. It accelerates protein synthesis, enhances enzyme activity, triggers endogenous plant growth hormones, and improves crop resilience against climatic stress.",
    benefits: [
      "High-grade Protein Hydrolysate 12.50% formulated for rapid foliar uptake and assimilation",
      "Supplies essential free L-amino acids to boost enzymatic functions and chlorophyll synthesis",
      "Promotes vigorous vegetative growth, branching, and flower bud differentiation",
      "Significantly alleviates abiotic stress caused by drought, temperature swings, and chemical sprays",
      "Improves fruit size, weight, color development, and overall post-harvest shelf life",
    ],
    usage:
      "Foliar Spray: 2–3 ml per Litre of clean water during active vegetative, flowering, and fruit development stages.\nDrip Fertigation: 1–2 Litres per acre.",
    ingredients:
      "Protein Hydrolysate 12.50% w/w, Free Amino Acids (L-Form), Bioactive Peptides, Organic Nitrogen.",
    badges: ["featured", "best seller"],
  },
  {
    id: "carbonic",
    name: "Carbonic",
    category: "Biostimulants & Growth Promoters",
    price: 480,
    oldPrice: 600,
    rating: 4.8,
    reviews: 34,
    stock: 260,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934965/plant_health_solutions/products/carbonic.png",
    description:
      "Carbonic is a premium liquid bio-stimulant containing 29% active Humic & Fulvic acids. It activates native soil microflora, enhances cation-exchange capacity (CEC), chelates micronutrients for root uptake, and improves moisture retention in light and sandy soils.",
    benefits: [
      "Contains 29% biologically active Humic and Fulvic acids in stable liquid suspension",
      "Promotes white feeder root growth and accelerates seedling establishment",
      "Enhances soil structure, water-holding capacity, and microbial biodiversity",
      "Natural organic chelator facilitating uptake of Phosphorus, Iron, Zinc, and Calcium",
      "Buffers soil pH fluctuations and detoxifies chemical fertilizer salt accumulation",
    ],
    usage:
      "Drip Fertigation: 1–2 Litres per acre at sowing, transplanting, and early vegetative growth.\nFoliar Spray: 2–3 ml per Litre of water.\nSoil Drenching: 2 Litres per acre in 200L water.",
    ingredients:
      "Humic Acid + Fulvic Acid (Total 29% w/v), Organic Carbon, Plant-available Trace Elements.",
    badges: ["featured", "organic"],
  },
  {
    id: "continnum",
    name: "Continnum",
    category: "Biostimulants & Growth Promoters",
    price: 530,
    oldPrice: 660,
    rating: 4.9,
    reviews: 22,
    stock: 190,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934966/plant_health_solutions/products/continnum.png",
    description:
      "Continnum is a specialized red seaweed biostimulant formulated with Kappaphycus alvarezii 9.5% liquid extract. Rich in natural carrageenan, betaines, cytokinins, and organic nutrients that stimulate root architecture, increase chlorophyll index, and boost stress tolerance.",
    benefits: [
      "Pure Kappaphycus alvarezii red seaweed extract (9.5% liquid concentration)",
      "Rich in sulfated galactans, betaines, and natural growth regulators",
      "Triggers profuse root branching and boosts early plant vigor",
      "Improves pollination efficiency, pollen viability, and fruit setting percentage",
      "Increases antioxidant defense mechanisms against high heat and moisture stress",
    ],
    usage:
      "Foliar Spray: 2.5–3 ml per Litre of clean water at vegetative, pre-flowering, and fruit formation stages.\nDrip Fertigation: 1 Litre per acre.",
    ingredients:
      "Kappaphycus alvarezii Red Seaweed Extract (9.5% w/v), Natural Phytohormones, Betaines, Trace Minerals.",
    badges: ["trending", "certified"],
  },
  {
    id: "humion",
    name: "Humion",
    category: "Biostimulants & Growth Promoters",
    price: 560,
    oldPrice: 700,
    rating: 4.9,
    reviews: 45,
    stock: 210,
    unit: "1 kg",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934967/plant_health_solutions/products/humion.png",
    description:
      "Humion is a 100% water-soluble high-grade biostimulant powder containing 85% Humic and Fulvic acids. Engineered for instant dissolution in drip lines and sprayer tanks, Humion revitalizes tired soils, stimulates mycorrhizal colonization, and ensures efficient nutrient absorption.",
    benefits: [
      "High-concentration 85% Humic & Fulvic acid 100% water-soluble crystal powder",
      "Zero drip nozzle clogging with complete aqueous dispersion",
      "Enhances soil CEC and unbinds locked soil phosphates and micronutrients",
      "Dramatically improves root elongation, surface area, and root hair density",
      "Stimulates earthworm and beneficial soil microbial communities",
    ],
    usage:
      "Drip Fertigation: 500g – 1 kg per acre mixed in irrigation water.\nFoliar Application: 1–2g per Litre of water.\nSeed Treatment: 5–10g per kg seed.",
    ingredients:
      "Potassium Humate + Fulvic Acid (85% w/w), Potassium (K2O) 10%, Organic Carbon 50%.",
    badges: ["best seller", "organic"],
  },
  {
    id: "osmolite",
    name: "Osmolite",
    category: "Biostimulants & Growth Promoters",
    price: 490,
    oldPrice: 620,
    rating: 4.8,
    reviews: 19,
    stock: 180,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934968/plant_health_solutions/products/osmolite.png",
    description:
      "Osmolite is an advanced osmoprotectant biostimulant containing 1.0% active L-Proline. Formulated specifically to shield crops from cellular dehydration, extreme heat, cold stress, and salinity by stabilizing subcellular membranes and maintaining osmotic balance.",
    benefits: [
      "Formulated with 1.0% bioactive L-Proline for superior osmoregulation",
      "Prevents stomatal closure and photosynthetic collapse during high temperature stress",
      "Protects cell proteins and membranes against reactive oxygen species (ROS)",
      "Reduces flower and fruit drop during sudden climate fluctuations",
      "Aids in fast crop recovery following drought, flood, or pesticide shock",
    ],
    usage:
      "Foliar Spray: 2–2.5 ml per Litre of clean water applied 24–48 hours prior to anticipated heat waves, frost, or water stress.\nDrip Fertigation: 1 Litre per acre.",
    ingredients:
      "L-Proline (1.0% w/v), Osmoprotective Bio-molecules, Plant Growth Co-factors.",
    badges: ["featured", "trending"],
  },
  {
    id: "osmonic",
    name: "Osmonic",
    category: "Biostimulants & Growth Promoters",
    price: 520,
    oldPrice: 650,
    rating: 4.8,
    reviews: 26,
    stock: 190,
    unit: "500 g",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934969/plant_health_solutions/products/osmonic.png",
    description:
      "Osmonic is a high-purity Glycine 5% powder biostimulant. Glycine is the fundamental precursor for chlorophyll synthesis and a powerful natural chelating agent that promotes rapid micronutrient absorption, cell wall elasticity, and vegetative resilience.",
    benefits: [
      "Contains 5% biologically active L-Glycine in 100% water-soluble powder formulation",
      "Serves as the vital building block for porphyrin and chlorophyll biosynthesis",
      "Acts as a natural organic chelating agent for micro-cations (Fe, Zn, Mn, Cu)",
      "Improves cellular osmotic pressure and prevents drought-induced leaf curling",
      "Enhances plant protein formation and carbohydrate accumulation in fruits",
    ],
    usage:
      "Foliar Spray: 1.5–2g per Litre of clean water at active vegetative/tillering and flowering stages.\nFertigation: 500g per acre.",
    ingredients:
      "Glycine (5.0% w/w), Bioactive Amino Acid Carrier, Soluble Organic Nitrogen.",
    badges: ["featured", "organic"],
  },
  {
    id: "peptide",
    name: "Peptide",
    category: "Biostimulants & Growth Promoters",
    price: 580,
    oldPrice: 720,
    rating: 4.9,
    reviews: 37,
    stock: 240,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934970/plant_health_solutions/products/peptide.png",
    description:
      "Peptide is a high-potency liquid biostimulant formulated with 14% Amino Acids derived from natural microbial fermentation. It delivers short-chain oligopeptides and complete essential amino acid profile for rapid plant metabolism and stress recovery.",
    benefits: [
      "14% microbial-fermented free amino acids and bioactive oligopeptides",
      "100% bio-available formula absorbed through leaf stomata within hours",
      "Drives protein synthesis and enzyme production without metabolic energy waste",
      "Stimulates uniform flowering, reduces bud drop, and improves fruit set ratio",
      "Boosts plant resilience against biotic and abiotic stressors",
    ],
    usage:
      "Foliar Spray: 2–3 ml per Litre of water during rapid vegetative growth, flowering, and fruit development.\nDrip Fertigation: 1–2 Litres per acre.",
    ingredients:
      "Microbially Derived Amino Acids 14% w/v (Aspartic, Glutamic, Glycine, Alanine, Proline), Bioactive Peptides, Organic Nitrogen.",
    badges: ["featured", "best seller"],
  },
  {
    id: "root-xx",
    name: "Root XX",
    category: "Biostimulants & Growth Promoters",
    price: 470,
    oldPrice: 590,
    rating: 4.8,
    reviews: 31,
    stock: 210,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934971/plant_health_solutions/products/root-xx.png",
    description:
      "Root XX is a high-performance root architecture booster containing 25.05% Humic and Fulvic acids in liquid format. Specifically engineered to stimulate deep taproot expansion, lateral feeder root branching, and root cap longevity.",
    benefits: [
      "Formulated with 25.05% synergistic Humic and Fulvic acids",
      "Triggers explosive white feeder root formation and deep taproot penetration",
      "Improves water and nutrient absorption efficiency from deeper soil layers",
      "Accelerates seedling establishment and reduces transplant shock in nursery crops",
      "Improves soil aeration, microbial activity, and structure around the rhizosphere",
    ],
    usage:
      "Drip Fertigation: 1–2 Litres per acre applied at sowing, transplanting, and early vegetative stage.\nSoil Drenching: 3–4 ml per Litre of water applied around the seedling root base.",
    ingredients:
      "Active Humic Acid & Fulvic Acid (Total 25.05% w/v), Organic Carbon, Natural Chelating Agents.",
    badges: ["trending", "organic"],
  },
  {
    id: "sea-xl-98",
    name: "Sea XL 98",
    category: "Biostimulants & Growth Promoters",
    price: 620,
    oldPrice: 780,
    rating: 5.0,
    reviews: 42,
    stock: 180,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934972/plant_health_solutions/products/sea-xl-98.png",
    description:
      "Sea XL 98 is a premium ultra-concentrated marine seaweed extract containing 98% pure Ascophyllum nodosum liquid. Extracted via cold process to preserve natural auxins, cytokinins, gibberellins, alginates, and essential trace minerals.",
    benefits: [
      "98% pure Ascophyllum nodosum marine seaweed extract in stabilized liquid form",
      "Cold-processed to retain 100% natural bioactive phytohormones and alginates",
      "Maximizes chlorophyll accumulation and photosynthetic efficiency",
      "Increases flower bud differentiation, fruit retention, and fruit weight",
      "Builds systemic plant tolerance to frost, drought, salinity, and high heat",
    ],
    usage:
      "Foliar Spray: 1.5–2 ml per Litre of water during pre-flowering, fruit set, and sizing stages.\nDrip Fertigation: 1 Litre per acre.",
    ingredients:
      "Ascophyllum nodosum Seaweed Extract (98% w/v), Natural Phytohormones, Alginic Acid, Laminarin, Trace Minerals.",
    badges: ["featured", "best seller"],
  },
  {
    id: "seavardha",
    name: "SeaVardha",
    category: "Biostimulants & Growth Promoters",
    price: 460,
    oldPrice: 580,
    rating: 4.8,
    reviews: 28,
    stock: 230,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934974/plant_health_solutions/products/seavardha.png",
    description:
      "SeaVardha is a high-efficacy Ascophyllum Nodosum 15% liquid seaweed biostimulant designed for regular foliar nutrition and root activation across vegetables, fruits, pulses, and field crops.",
    benefits: [
      "Standardized 15% Ascophyllum Nodosum cold-extracted liquid formula",
      "Promotes balanced vegetative growth, shoot branching, and dark green foliage",
      "Stimulates abundant flowering and reduces premature flower drop",
      "Enhances fruit size, skin luster, sugar content (Brix), and market grade",
      "Economical and highly compatible with all standard bio-fertilizers and bio-pesticides",
    ],
    usage:
      "Foliar Spray: 2.5–3 ml per Litre of clean water every 15–20 days.\nDrip Fertigation: 1.5–2 Litres per acre.",
    ingredients:
      "Ascophyllum Nodosum Liquid Seaweed Extract (15% w/v), Organic Plant Nutrients, Natural Cytokinins.",
    badges: ["trending", "organic"],
  },
  {
    id: "soil-energy",
    name: "Soil Energy",
    category: "Biostimulants & Growth Promoters",
    price: 510,
    oldPrice: 640,
    rating: 4.9,
    reviews: 33,
    stock: 200,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934979/plant_health_solutions/products/soil-energy.png",
    description:
      "Soil Energy is a multi-action liquid biostimulant combining cold-extracted Seaweed extract, Humic & Fulvic acids, free Amino acids, and essential B-complex vitamins to recharge depleted soils and energize plant metabolism.",
    benefits: [
      "Synergistic formulation uniting Seaweed, Humic, Fulvic, Amino Acids, and Vitamins",
      "Energizes root rhizosphere and reactivates dormant beneficial soil microbes",
      "Improves nutrient uptake efficiency and root nutrient mobilization",
      "Promotes rapid vegetative recovery after heavy fruiting or harvesting cycles",
      "Enhances overall soil fertility, water retention, and microbial biomass",
    ],
    usage:
      "Drip Fertigation: 1–2 Litres per acre mixed in irrigation system.\nFoliar Spray: 2.5–3 ml per Litre of water.\nSoil Drenching: 2 Litres per acre in 200L water.",
    ingredients:
      "Seaweed Extract, Humic & Fulvic Acid Complex, Microbial Amino Acids, B-Complex Vitamins, Bio-catalysts.",
    badges: ["featured", "organic"],
  },
  {
    id: "ultra-sizer",
    name: "Ultra Sizer",
    category: "Biostimulants & Growth Promoters",
    price: 590,
    oldPrice: 740,
    rating: 4.9,
    reviews: 36,
    stock: 190,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934980/plant_health_solutions/products/ultra-sizer.png",
    description:
      "Ultra Sizer is an advanced crop sizing and weight development biostimulant. Formulated with a synergistic mixture of premium Seaweed extract, Protein Hydrolysate, and active Humic acid to drive rapid fruit enlargement, uniform grading, and enhanced sugar accumulation.",
    benefits: [
      "Engineered specifically for maximum fruit/bulb/tuber sizing and uniform development",
      "Triple synergy of Seaweed extract, Protein Hydrolysate, and Humic acids",
      "Promotes cell division and cell enlargement in developing fruits and berries",
      "Improves fruit weight, skin finish, TSS/Brix levels, and export quality",
      "Reduces fruit cracking and uneven size distribution across bunches",
    ],
    usage:
      "Foliar Spray: 2.5–3 ml per Litre of water applied during fruit set, berry sizing, and fruit development stages.\nDrip Fertigation: 1–2 Litres per acre.",
    ingredients:
      "Seaweed Extract (Ascophyllum nodosum), Protein Hydrolysate (Amino Acids), Humic Acid Complex, Organic Sizing Agents.",
    badges: ["featured", "best seller"],
  },
  {
    id: "vir-guard",
    name: "Vir Guard",
    category: "Biostimulants & Growth Promoters",
    price: 540,
    oldPrice: 680,
    rating: 4.9,
    reviews: 27,
    stock: 210,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934981/plant_health_solutions/products/vir-guard.png",
    description:
      "Vir Guard is a high-strength Kappaphycus Alvarezii 24% liquid red seaweed extract biostimulant. Engineered with concentrated sulfated polysaccharides and elicitor molecules that induce Systemic Acquired Resistance (SAR) and vigorous plant immunity.",
    benefits: [
      "Concentrated 24% Kappaphycus Alvarezii red marine seaweed extract",
      "Induces natural plant immune defense mechanisms and Systemic Acquired Resistance (SAR)",
      "Strengthens plant cell walls and vascular bundles against environmental stresses",
      "Improves shoot vigor, leaf thickness, and photosynthetic rate",
      "Enhances crop resilience and productivity under challenging weather conditions",
    ],
    usage:
      "Foliar Spray: 2–3 ml per Litre of clean water applied at 15-day intervals starting from early vegetative stage.\nDrip Fertigation: 1–1.5 Litres per acre.",
    ingredients:
      "Kappaphycus Alvarezii Red Seaweed Extract (24% w/v), Sulfated Galactans, Bio-elicitors, Natural Potassium.",
    badges: ["featured", "trending"],
  },
  {
    id: "vigoron",
    name: "Vigoron",
    category: "Biostimulants & Growth Promoters",
    price: 500,
    oldPrice: 630,
    rating: 4.8,
    reviews: 25,
    stock: 220,
    unit: "1 L",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1789934982/plant_health_solutions/products/vigoron.png",
    description:
      "Vigoron is a comprehensive plant vitality biostimulant formulated with a balanced blend of Seaweed extract, Protein Hydrolysate, and Humic acid. It boosts vegetative vigor, increases chlorophyll density, and optimizes flowering and fruit formation.",
    benefits: [
      "Complete 3-in-1 biostimulant blend: Seaweed + Protein Hydrolysate + Humic Acid",
      "Enhances total vegetative vigor, canopy development, and leaf greenness",
      "Reduces flower and fruit drop, resulting in higher harvest yield",
      "Improves root development and soil nutrient absorption capacity",
      "Protects crops against environmental stress and spray burn",
    ],
    usage:
      "Foliar Spray: 2.5–3 ml per Litre of water at early growth, pre-flowering, and post-setting stages.\nDrip Fertigation: 1–2 Litres per acre.",
    ingredients:
      "Seaweed Extract, Protein Hydrolysate (Free Amino Acids), Humic Acid Complex, Bio-activators.",
    badges: ["trending", "organic"],
  },
];

const IMG = [
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=70",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=70",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=70",
  "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=70",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=70",
  "https://images.unsplash.com/photo-1592417817098-8f3d6eb2252a?w=800&q=70",
  "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&q=70",
  "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=70",
];

const pick = <T>(arr: T[], i: number): T => arr[i % arr.length];

const blogTitles: [string, string, string][] = [
  ["Soil Health Cards: Reading Your Report Correctly", "Soil Health", "Dr. R. M. Kulkarni"],
  ["Bio Fertilizers vs Chemical Fertilizers: A Field Comparison", "Research", "Dr. R. M. Kulkarni"],
  ["Managing Pink Bollworm in Bt Cotton Sustainably", "Crop Protection", "Agronomy Desk"],
  ["Drip Fertigation Schedule for Sugarcane in North Karnataka", "Irrigation", "Agronomy Desk"],
  ["Zinc Deficiency in Paddy: Symptoms and Correction", "Nutrition", "Dr. P. S. Patil"],
  ["Trichoderma in Nursery Management: Best Practices", "Crop Protection", "Agronomy Desk"],
  ["Improving Wheat Grain Filling with Foliar Potassium", "Nutrition", "Dr. R. M. Kulkarni"],
  ["Vermicompost Production at Farm Scale", "Organic Farming", "Extension Team"],
  ["Seaweed Extracts and Abiotic Stress Tolerance", "Research", "Dr. P. S. Patil"],
  ["Pomegranate Bacterial Blight: Integrated Management", "Horticulture", "Agronomy Desk"],
  ["Maize Fall Armyworm: Scouting and Bio Control", "Crop Protection", "Extension Team"],
  ["Water Soluble Fertilizers: Choosing the Right Grade", "Nutrition", "Dr. R. M. Kulkarni"],
  ["Grape Pre-Pruning Nutrition Programme", "Horticulture", "Agronomy Desk"],
  ["Micro Irrigation Economics for Small Holders", "Irrigation", "Extension Team"],
  ["Residue Free Vegetable Production for Export", "Organic Farming", "Dr. P. S. Patil"],
];

export const blogs: Blog[] = blogTitles.map(([title, category, author], i) => ({
  id: `B${String(i + 1).padStart(3, "0")}`,
  title,
  author,
  date: `2026-0${(i % 9) + 1}-${String((i % 27) + 1).padStart(2, "0")}`,
  category,
  image: pick(IMG, i + 2),
  readTime: 4 + (i % 6),
  featured: i < 3,
  excerpt: `${title} — practical, trial-backed guidance from the Plant Health Solutions research and extension team at Tidagundi, Vijayapura.`,
  body: [
    `${title} is one of the most frequently raised topics by farmers visiting our Horticulture Research and Extension Center at Tidagundi. In this article the Plant Health Solutions agronomy team summarises three seasons of replicated field data and translates it into decisions you can take on your own plot.`,
    `Our trials were laid out across black cotton soils of Vijayapura, Bagalkot and Solapur districts with three replications per treatment. Observations were recorded on plant stand, chlorophyll index, pest and disease incidence, and final yield per acre. Treatments involving integrated biological inputs consistently outperformed the farmer practice control by 11 to 23 percent.`,
    `The key operational learning is timing. Biological inputs must be applied when soil moisture and temperature favour microbial establishment, ideally early morning or evening and always within a moist root zone. Mixing living cultures with strong chemical fungicides in the same tank negates the benefit, so keep a minimum seven day gap.`,
    `Nutrition should follow crop demand curves rather than a fixed calendar. Split applications with a strong base of organic matter, followed by targeted micronutrient correction at critical growth stages, gave the best return on investment in every location we monitored.`,
    `Farmers who would like a customised schedule for their village and soil report can call the extension center on ${COMPANY.phone} or write to ${COMPANY.email1}. Our field officers conduct free soil-report interpretation camps every month during the Kharif and Rabi seasons.`,
  ],
}));

const tNames: [string, string, string][] = [
  ["Basavaraj Patil", "Vijayapura, Karnataka", "Cotton"],
  ["Shivanand Hiremath", "Bagalkot, Karnataka", "Sugarcane"],
  ["Mahadev Jadhav", "Solapur, Maharashtra", "Pomegranate"],
  ["Ravi Kumar N", "Raichur, Karnataka", "Paddy"],
  ["Sangappa Biradar", "Kalaburagi, Karnataka", "Tur Dal"],
  ["Prakash Deshmukh", "Latur, Maharashtra", "Soybean"],
  ["Ningappa Gouda", "Belagavi, Karnataka", "Sugarcane"],
  ["Suresh Kulkarni", "Dharwad, Karnataka", "Wheat"],
  ["Anil Shinde", "Pune, Maharashtra", "Grapes"],
  ["Mallikarjun Sindagi", "Vijayapura, Karnataka", "Lemon"],
  ["Ganesh Pawar", "Sangli, Maharashtra", "Turmeric"],
  ["Rudrappa Talikoti", "Bagalkot, Karnataka", "Onion"],
  ["Yallappa Koli", "Gadag, Karnataka", "Maize"],
  ["Santosh More", "Osmanabad, Maharashtra", "Chickpea"],
  ["Iranna Hosamani", "Koppal, Karnataka", "Chilli"],
  ["Vitthal Bhosale", "Satara, Maharashtra", "Sugarcane"],
  ["Basanna Kamble", "Yadgir, Karnataka", "Cotton"],
  ["Dattatray Jagtap", "Ahmednagar, Maharashtra", "Tomato"],
  ["Shrishail Angadi", "Haveri, Karnataka", "Paddy"],
  ["Kiran Salunke", "Kolhapur, Maharashtra", "Banana"],
];

export const testimonials: Testimonial[] = tNames.map(([name, place, crop], i) => ({
  id: `T${String(i + 1).padStart(3, "0")}`,
  name,
  place,
  crop,
  rating: i % 7 === 0 ? 4 : 5,
  quote: `After switching to Plant Health Solutions products my ${crop.toLowerCase()} crop showed visibly darker leaves within three weeks. The field officers from Tidagundi visited my plot and gave a full schedule. Yield improved and input cost came down this season.`,
}));

export const customers: Customer[] = ([
  ["Basavaraj Patil", "basavaraj.patil@gmail.com", "+91 98860 11223", "Vijayapura", 6],
  ["Shivanand Hiremath", "shivanand.h@gmail.com", "+91 94480 33445", "Bagalkot", 4],
  ["Mahadev Jadhav", "mahadev.jadhav@gmail.com", "+91 98220 55667", "Solapur", 3],
  ["Ravi Kumar N", "ravikumar.n@gmail.com", "+91 90080 77889", "Raichur", 2],
  ["Sangappa Biradar", "sangappa.b@gmail.com", "+91 93410 99001", "Kalaburagi", 5],
  ["Prakash Deshmukh", "prakash.d@gmail.com", "+91 98500 22334", "Latur", 1],
  ["Ningappa Gouda", "ningappa.g@gmail.com", "+91 97400 44556", "Belagavi", 3],
  ["Suresh Kulkarni", "suresh.k@gmail.com", "+91 99860 66778", "Dharwad", 2],
  ["Anil Shinde", "anil.shinde@gmail.com", "+91 98900 88990", "Pune", 4],
  ["Mallikarjun Sindagi", "mallikarjun.s@gmail.com", "+91 90360 11224", "Vijayapura", 2],
  ["Ganesh Pawar", "ganesh.pawar@gmail.com", "+91 94220 33446", "Sangli", 1],
  ["Rudrappa Talikoti", "rudrappa.t@gmail.com", "+91 91750 55668", "Bagalkot", 3],
] as [string, string, string, string, number][]).map((c, i) => ({
  id: `CU${String(i + 1).padStart(3, "0")}`,
  name: c[0],
  email: c[1],
  phone: c[2],
  city: c[3],
  orders: c[4],
  active: i % 9 !== 0,
}));

export const orders: Order[] = [];

export const reviews: Review[] = [];

export const enquiries: Enquiry[] = Array.from({ length: 10 }, (_, i) => ({
  id: `E${String(i + 1).padStart(3, "0")}`,
  name: pick(tNames, i + 5)[0],
  phone: `+91 9${String(400000000 + i * 1234567).slice(0, 9)}`,
  email: `farmer${i + 1}@gmail.com`,
  subject: pick(["Product Enquiry", "Dealership", "Agronomy Advice", "Bulk Order", "Complaint"], i),
  message:
    "Please suggest a complete nutrition and protection schedule for my crop. I have 8 acres under drip irrigation and a recent soil test report available.",
  date: `2026-0${(i % 9) + 1}-2${i % 8}`,
  status: i % 3 === 0 ? "Answered" : "New",
}));

export const coupons: Coupon[] = [
  { code: "KHARIF10", discount: 10, minOrder: 1500, description: "10% off on Kharif season inputs" },
  { code: "SOIL200", discount: 8, minOrder: 2500, description: "Soil health package saver" },
  { code: "FARMER15", discount: 15, minOrder: 5000, description: "15% off for bulk farmer orders" },
  { code: "DRIP500", discount: 12, minOrder: 4000, description: "Drip fertigation combo offer" },
  { code: "RESEARCH5", discount: 5, minOrder: 800, description: "Flat 5% research launch offer" },
];

const cropSeed: [string, string, string[], string[]][] = [
  [
    "Cotton",
    "Bt and desi cotton grown on black cotton soils of Vijayapura, Yadgir and Raichur belts.",
    ["Wilt (Fusarium)", "Bacterial Blight", "Grey Mildew", "Root Rot"],
    ["Pink Bollworm", "Sucking Pests (Jassid, Aphid, Thrips)", "Whitefly", "Spodoptera"],
  ],
  [
    "Sugarcane",
    "Long duration cane in Belagavi, Bagalkot, Sangli and Kolhapur with 12-18 month cycles.",
    ["Red Rot", "Smut", "Wilt", "Pokkah Boeng"],
    ["Early Shoot Borer", "Top Borer", "Woolly Aphid", "White Grub"],
  ],
  [
    "Paddy",
    "Transplanted and direct seeded rice under canal command areas of Raichur and Haveri.",
    ["Blast", "Sheath Blight", "Bacterial Leaf Blight", "False Smut"],
    ["Stem Borer", "Brown Plant Hopper", "Leaf Folder", "Gundhi Bug"],
  ],
  [
    "Wheat",
    "Rabi wheat in Dharwad, Vijayapura and adjoining Maharashtra districts.",
    ["Yellow Rust", "Brown Rust", "Loose Smut", "Karnal Bunt"],
    ["Aphid", "Termite", "Armyworm", "Pink Stem Borer"],
  ],
  [
    "Maize",
    "Kharif and Rabi maize in Gadag, Haveri, Davanagere and Koppal.",
    ["Turcicum Leaf Blight", "Downy Mildew", "Charcoal Rot", "Banded Leaf Sheath Blight"],
    ["Fall Armyworm", "Stem Borer", "Shoot Fly", "Aphid"],
  ],
  [
    "Vegetables",
    "Tomato, chilli, onion, brinjal and okra under drip and mulch systems.",
    ["Damping Off", "Early Blight", "Powdery Mildew", "Leaf Curl Virus"],
    ["Thrips", "Mites", "Fruit Borer", "Whitefly"],
  ],
  [
    "Fruits",
    "Pomegranate, grape, lemon, banana and mango orchards across Karnataka and Maharashtra.",
    ["Bacterial Blight", "Anthracnose", "Downy Mildew", "Panama Wilt"],
    ["Fruit Fly", "Mealy Bug", "Thrips", "Stem Borer"],
  ],
];

export const crops: Crop[] = cropSeed.map(([name, summary, dis, pes], i) => ({
  slug: name.toLowerCase(),
  name,
  image: pick(IMG, i),
  summary,
  diseases: dis.map((d) => ({
    name: d,
    symptom: `Typical ${d.toLowerCase()} symptoms appear as discoloured lesions, drying of foliage and reduced vigour during humid weather.`,
    control: "Preventive spray of PHS Trichoderma Viride and PHS Pseudomonas Fluorescens; maintain field sanitation and balanced potassium nutrition.",
  })),
  pests: pes.map((p) => ({
    name: p,
    symptom: `${p} damage is seen as feeding marks, curling and stunted growth; monitor with pheromone and sticky traps weekly.`,
    control: "Install traps, spray PHS Neem Oil 10000 PPM and PHS Beauveria Bassiana at recommended dose; rotate modes of action.",
  })),
  nutrition: [
    { stage: "Basal / Land Preparation", schedule: "Apply enriched organic manure with bio fertilizer consortia and VAM granules." },
    { stage: "Vegetative Stage", schedule: "Drip 19:19:19 at 3-4 kg per acre weekly along with humic acid soil drench." },
    { stage: "Flowering / Reproductive", schedule: "Foliar boron and PHS Flora Set for better flower retention and setting." },
    { stage: "Fruit / Grain Filling", schedule: "Switch to 00:52:34 or 13:00:45 with seaweed biostimulant for size and weight." },
    { stage: "Maturity", schedule: "Reduce nitrogen, maintain potassium and calcium for quality and shelf life." },
  ],
  calendar: [
    { month: "June - July", activity: "Land preparation, soil testing, basal organic and bio fertilizer application." },
    { month: "August - September", activity: "Vegetative nutrition, weed and sucking pest management." },
    { month: "October - November", activity: "Flowering support, micronutrient correction, disease scouting." },
    { month: "December - January", activity: "Fruit or grain filling nutrition, potassium and calcium sprays." },
    { month: "February - March", activity: "Harvest, residue management and soil rejuvenation." },
  ],
  products:
    name === "Vegetables"
      ? ["neo-bio-npk", "sonar", "ultra-sizer", "carbonic", "humion", "peptide", "seavardha", "nova-beauveria", "nova-paecilomyces", "black-gold", "nova-bacillus", "nova-tricho", "neo-decomposer"]
      : name === "Fruits"
      ? ["sea-xl-98", "ultra-sizer", "sonar", "vigoron", "vir-guard", "humion", "root-xx", "neo-bio-npk", "seavita", "nova-paecilomyces", "black-gold", "nova-bacillus", "neo-kmb"]
      : name === "Cotton"
      ? ["neo-bio-npk", "osmolite", "osmonic", "continnum", "seavita", "nova-beauveria", "nova-verticillium", "black-gold", "nova-meta", "neo-decomposer"]
      : name === "Sugarcane"
      ? ["neo-bio-npk", "soil-energy", "root-xx", "carbonic", "neo-decomposer", "nova-meta", "neo-psb", "neo-kmb", "black-gold", "seavita"]
      : name === "Paddy"
      ? ["neo-bio-npk", "sonar", "soil-energy", "continnum", "neo-decomposer", "nova-bacillus", "neo-psb", "nova-tricho", "black-gold", "seavita"]
      : ["neo-bio-npk", "peptide", "osmolite", "carbonic", "seavita", "neo-psb", "neo-kmb", "black-gold", "nova-tricho", "neo-decomposer"],
}));

export const stats = [
  { label: "Years of Research", value: "18+" },
  { label: "Farmers Served", value: "42,000+" },
  { label: "Field Trials Completed", value: "650+" },
  { label: "Products Manufactured", value: "30+" },
];
