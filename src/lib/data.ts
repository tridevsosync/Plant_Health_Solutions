// Seed / mock data for Plant Health Solutions Pvt. Ltd.

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

export type OrderItem = { id: string; name: string; price: number; qty: number };

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
};

export type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
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
    id: "c1",
    name: "Bio Fertilizers",
    slug: "bio-fertilizers",
    description: "Living microbial cultures that fix nitrogen, solubilise phosphate and potash naturally.",
    icon: "Sprout",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=70",
  },
  {
    id: "c2",
    name: "Organic Fertilizers",
    slug: "organic-fertilizers",
    description: "Vermicompost, organic manures and enriched composts for long term soil health.",
    icon: "Leaf",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=70",
  },
  {
    id: "c3",
    name: "Micronutrients",
    slug: "micronutrients",
    description: "Chelated zinc, boron, ferrous and multi-micronutrient mixtures for deficiency correction.",
    icon: "FlaskConical",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=70",
  },
  {
    id: "c4",
    name: "Water Soluble Fertilizers",
    slug: "water-soluble-fertilizers",
    description: "100% soluble NPK grades designed for drip irrigation and foliar sprays.",
    icon: "Droplets",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=70",
  },
  {
    id: "c5",
    name: "Bio Chemicals",
    slug: "bio-chemicals",
    description: "Biostimulants, seaweed, humic and amino acid formulations for stress management.",
    icon: "Beaker",
    image: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=800&q=70",
  },
  {
    id: "c6",
    name: "Crop Protection",
    slug: "crop-protection",
    description: "Bio control agents and botanical extracts for pest and disease management.",
    icon: "ShieldCheck",
    image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800&q=70",
  },
  {
    id: "c7",
    name: "Plant Nutrition",
    slug: "plant-nutrition",
    description: "Growth promoters, flowering and fruit setting specialities for higher yields.",
    icon: "Flower2",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=70",
  },
  {
    id: "c8",
    name: "Seeds",
    slug: "seeds",
    description: "Research grade vegetable and field crop seeds with high germination.",
    icon: "Wheat",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=70",
  },
];

const pick = <T,>(arr: T[], i: number): T => arr[((i % arr.length) + arr.length) % arr.length] as T;

const IMG = [
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=70",
  "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=70",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=70",
  "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=70",
  "https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=800&q=70",
  "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800&q=70",
  "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=70",
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=70",
];

type Seed = [string, string, number, number, number, number, number, string, string[]];

const productSeeds: Seed[] = [
  ["PHS Azoto-Rich Nitrogen Fixer", "Bio Fertilizers", 480, 620, 4.7, 214, 120, "1 L", ["featured", "best seller"]],
  ["PHS Phospho-Sol PSB Culture", "Bio Fertilizers", 430, 540, 4.6, 168, 90, "1 L", ["best seller"]],
  ["PHS Potash Mobiliser KMB", "Bio Fertilizers", 455, 560, 4.5, 121, 75, "1 L", []],
  ["PHS Rhizo Gold Rhizobium", "Bio Fertilizers", 390, 470, 4.4, 98, 140, "1 kg", ["trending"]],
  ["PHS Myco Root VAM Granules", "Bio Fertilizers", 720, 890, 4.8, 187, 60, "4 kg", ["featured"]],
  ["PHS Vermi Prime Vermicompost", "Organic Fertilizers", 340, 420, 4.5, 260, 200, "10 kg", ["best seller"]],
  ["PHS Neem Enriched Organic Manure", "Organic Fertilizers", 520, 640, 4.6, 143, 110, "20 kg", []],
  ["PHS Fish Amino Organic Extract", "Organic Fertilizers", 610, 780, 4.7, 176, 85, "1 L", ["trending"]],
  ["PHS Bone Meal Plus Phosphate", "Organic Fertilizers", 480, 590, 4.3, 88, 95, "10 kg", []],
  ["PHS Press Mud Enriched Compost", "Organic Fertilizers", 300, 380, 4.2, 74, 160, "25 kg", []],
  ["PHS Chelated Zinc EDTA 12%", "Micronutrients", 560, 690, 4.8, 231, 130, "500 g", ["featured", "best seller"]],
  ["PHS Boron 20% Solubor", "Micronutrients", 410, 500, 4.5, 154, 145, "500 g", []],
  ["PHS Ferrous EDTA 12%", "Micronutrients", 590, 720, 4.4, 96, 70, "500 g", []],
  ["PHS Multi-Micro Grade II Mixture", "Micronutrients", 640, 810, 4.7, 205, 100, "1 kg", ["trending"]],
  ["PHS Calcium Magnesium Booster", "Micronutrients", 530, 650, 4.3, 82, 115, "1 kg", []],
  ["PHS Drip Grade 19:19:19 NPK", "Water Soluble Fertilizers", 1180, 1450, 4.8, 312, 180, "10 kg", ["best seller"]],
  ["PHS Drip Grade 12:61:00 MAP", "Water Soluble Fertilizers", 1350, 1620, 4.7, 198, 140, "10 kg", ["featured"]],
  ["PHS Drip Grade 00:52:34 MKP", "Water Soluble Fertilizers", 1650, 1980, 4.6, 133, 90, "10 kg", []],
  ["PHS Drip Grade 13:00:45 Potash", "Water Soluble Fertilizers", 1420, 1700, 4.6, 147, 110, "10 kg", ["trending"]],
  ["PHS Calcium Nitrate Soluble", "Water Soluble Fertilizers", 980, 1180, 4.5, 121, 130, "25 kg", []],
  ["PHS Humi Max Humic Acid 98%", "Bio Chemicals", 620, 790, 4.8, 288, 160, "1 kg", ["featured", "best seller"]],
  ["PHS Seaweed Xtra Biostimulant", "Bio Chemicals", 680, 850, 4.7, 241, 120, "1 L", ["trending"]],
  ["PHS Amino Power 40% Amino Acid", "Bio Chemicals", 740, 920, 4.6, 165, 95, "1 L", []],
  ["PHS Fulvic Shine 65%", "Bio Chemicals", 560, 700, 4.5, 118, 105, "500 g", []],
  ["PHS Trichoderma Viride Bio Fungicide", "Crop Protection", 420, 530, 4.7, 219, 150, "1 kg", ["best seller"]],
  ["PHS Pseudomonas Fluorescens", "Crop Protection", 440, 550, 4.6, 152, 125, "1 kg", []],
  ["PHS Neem Oil 10000 PPM", "Crop Protection", 510, 640, 4.6, 197, 175, "1 L", ["trending"]],
  ["PHS Beauveria Bassiana Bio Insecticide", "Crop Protection", 470, 580, 4.5, 109, 100, "1 kg", []],
  ["PHS Flora Set Flowering Booster", "Plant Nutrition", 690, 860, 4.7, 174, 85, "500 ml", ["featured"]],
  ["PHS Research Hybrid Vegetable Seed Kit", "Seeds", 350, 450, 4.4, 128, 220, "Kit", ["trending"]],
];

export const products: Product[] = productSeeds.map((s, i) => {
  const [name, category, price, oldPrice, rating, reviews, stock, unit, badges] = s;
  return {
    id: `P${String(i + 1).padStart(3, "0")}`,
    name,
    category,
    price,
    oldPrice,
    rating,
    reviews,
    stock,
    unit,
    image: pick(IMG, i),
    description: `${name} is developed at the Plant Health Solutions Horticulture Research and Extension Center, Tidagundi. Formulated after multi-location field trials across Karnataka and Maharashtra, it delivers consistent field performance in ${category.toLowerCase()} programmes for both irrigated and rainfed cropping systems.`,
    benefits: [
      "Improves nutrient availability and uptake efficiency",
      "Strengthens root development and soil microbial activity",
      "Enhances crop vigour, flowering and fruit setting",
      "Reduces dependency on high-dose chemical inputs",
      "Residue-friendly and suitable for export-oriented produce",
    ],
    usage: `Soil application: 2-4 ${unit.includes("kg") ? "kg" : "L"} per acre mixed with well decomposed FYM. Foliar spray: 2-3 ml or g per litre of water at 15 day intervals. Drip: apply through the irrigation line during the vegetative and reproductive stages. Always agitate well before use and spray during cooler hours of the day.`,
    ingredients: `Active ingredient specific to ${category}, carrier material (lignite / liquid base), stabilisers and PHS proprietary micro-consortia. Free from harmful heavy metals.`,
    badges,
  };
});

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

const statuses: Order["status"][] = ["Pending", "Processing", "Delivered", "Cancelled", "Delivered", "Processing"];

export const orders: Order[] = Array.from({ length: 25 }, (_, i) => {
  const cust = pick(customers, i);
  const p1 = pick(products, i * 3);
  const p2 = pick(products, i * 5 + 2);
  const items: OrderItem[] = [
    { id: p1.id, name: p1.name, price: p1.price, qty: (i % 3) + 1 },
    { id: p2.id, name: p2.name, price: p2.price, qty: (i % 2) + 1 },
  ];
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const discount = i % 4 === 0 ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal - discount > 2000 ? 0 : 90;
  const tax = Math.round((subtotal - discount) * 0.05);
  return {
    id: `PHS-2026-${String(1001 + i)}`,
    customer: cust.name,
    email: cust.email,
    phone: cust.phone,
    date: `2026-0${(i % 9) + 1}-${String((i % 27) + 1).padStart(2, "0")}`,
    status: pick(statuses, i),
    items,
    subtotal,
    discount,
    shipping,
    tax,
    total: subtotal - discount + shipping + tax,
    address: `${cust.name}, Main Road, ${cust.city}, Karnataka - 5861${19 + (i % 60)}`,
    payment: pick(["UPI", "Net Banking", "Cash on Delivery"], i),
  };
});

export const reviews: Review[] = Array.from({ length: 10 }, (_, i) => ({
  id: `R${String(i + 1).padStart(3, "0")}`,
  productId: pick(products, i * 2).id,
  name: pick(tNames, i)[0],
  rating: i % 5 === 0 ? 4 : 5,
  date: `2026-0${(i % 9) + 1}-1${i % 9}`,
  comment:
    "Genuine product and quick delivery. Used it on my field as per the schedule given by the PHS field officer and the crop response was clearly visible within two weeks.",
}));

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
  products: [
    pick(products, i * 3).id,
    pick(products, i * 3 + 5).id,
    pick(products, i * 3 + 11).id,
    pick(products, i * 3 + 20).id,
  ],
}));

export const stats = [
  { label: "Years of Research", value: "18+" },
  { label: "Farmers Served", value: "42,000+" },
  { label: "Field Trials Completed", value: "650+" },
  { label: "Products Manufactured", value: "30+" },
];
