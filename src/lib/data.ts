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

export type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  type: "photo" | "video";
  mediaUrl?: string;
  thumbnailUrl?: string;
  videoLink?: string;
  category?: string;
  featured?: boolean;
  status?: "Active" | "Draft";
  order?: number;
  date?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department?: string;
  bio?: string;
  image: string;
  email?: string;
  phone?: string;
  order?: number;
  status?: "Active" | "Hidden";
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
  city?: string;
  state?: string;
  pincode?: string;
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
  // Team Section Settings
  showTeamSection?: boolean;
  teamSectionBadge?: string;
  teamSectionTitle?: string;
  teamSectionSubtitle?: string;
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

export const categories: Category[] = [];

export const products: Product[] = [];

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

export const customers: Customer[] = [];

export const orders: Order[] = [];

export const reviews: Review[] = [];

export const enquiries: Enquiry[] = [];


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

export const coupons: Coupon[] = [
  {
    code: "FARMER10",
    discount: 10,
    minOrder: 1000,
    description: "10% off on all organic fertilizers for orders above ₹1,000",
  },
  {
    code: "PHS500",
    discount: 500,
    minOrder: 5000,
    description: "Flat ₹500 discount on bulk farm inputs above ₹5,000",
  },
  {
    code: "BIOPROMO",
    discount: 15,
    minOrder: 2000,
    description: "15% off on bio-fertilizer and micro-nutrient kits",
  },
];

export const galleryItems: GalleryItem[] = [];

export const teamMembers: TeamMember[] = [
  {
    id: "team_1",
    name: "Dr. R. M. Kulkarni",
    role: "Chief Agronomist",
    department: "Founder",
    bio: "Ph.D. in Soil Microbiology with over 25 years of field research in crop nutrition.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    order: 1,
    status: "Active",
  },
  {
    id: "team_2",
    name: "Mrs. S. Patil",
    role: "Managing Director",
    department: "Executive",
    bio: "Spearheading nationwide supply chain, dealer relationships, and company growth.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    order: 2,
    status: "Active",
  },
  {
    id: "team_3",
    name: "Dr. M. Hegde",
    role: "Head of Plant Research",
    department: "R&D",
    bio: "Specialist in microbial formulation, strain development, and biological crop protection.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    order: 3,
    status: "Active",
  },
  {
    id: "team_4",
    name: "Mr. A. Deshmukh",
    role: "VP Operations & QC",
    department: "Operations",
    bio: "Overseeing automated packaging, quality inspection, and ISO compliance across facilities.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    order: 4,
    status: "Active",
  },
];


