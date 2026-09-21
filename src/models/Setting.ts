import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISetting extends Document {
  key: string;
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
  // Contact Page Customization Fields
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
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, default: "company_settings" },
    name: { type: String, default: "Plant Health Solutions Pvt. Ltd." },
    owner: { type: String, default: "Dr. R. M. Kulkarni" },
    phone: { type: String, default: "+91 91759 55009" },
    whatsapp: { type: String, default: "+91 91759 55009" },
    email1: { type: String, default: "planthealthsol@gmail.com" },
    email2: { type: String, default: "dr_prashant84@yahoo.com" },
    address: {
      type: String,
      default:
        "Plant Health Solutions Horticulture Research and Extension Center, NH-52, Vijayapur - Solapur Road, Tidagundi, Vijayapura, Karnataka 586119",
    },
    description: {
      type: String,
      default:
        "Working in Agriculture and Agricultural Research manufacturing Bio Fertilizers, Biostimulants, Bio Chemical Fertilizers, Bio Control Agents, Organic Manures, Plant/Animal/Fish Extracts, Water Soluble Fertilizers, Micronutrients and Crop Protection Products.",
    },
    gst: { type: String, default: "29AAGCP1234F1Z5" },
    announcement: { type: String, default: "Free soil testing on orders above ₹5,000" },
    freeShippingThreshold: { type: Number, default: 2000 },
    shippingFee: { type: Number, default: 90 },
    facebook: { type: String, default: "https://facebook.com" },
    instagram: { type: String, default: "https://instagram.com" },
    youtube: { type: String, default: "https://youtube.com" },
    twitter: { type: String, default: "https://twitter.com" },
    // Contact Page Customization Defaults
    workingHours: { type: String, default: "Mon – Sat: 9:00 AM – 6:30 PM" },
    contactHeroBadge: { type: String, default: "Direct Farmer & Dealer Support" },
    contactHeroTitle: { type: String, default: "Get in Touch with Our Agronomists" },
    contactHeroSubtitle: {
      type: String,
      default:
        "Whether you need crop advice, soil test recommendations, dealership inquiries, or bulk orders, our research and extension team is here to help.",
    },
    contactHeroImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1920&q=80",
    },
    facilityName: { type: String, default: "Horticulture Research & Extension Center" },
    facilityDescription: {
      type: String,
      default:
        "Our 40-acre center on National Highway 52 houses state-of-the-art microbiology testing, blending plants, and demonstration plots.",
    },
    facilityLocationTitle: { type: String, default: "Tidagundi, Vijayapura (NH-52)" },
    facilityImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    },
    googleMapsUrl: {
      type: String,
      default: "https://maps.google.com/?q=Plant+Health+Solutions+Tidagundi+Vijayapura",
    },
    enquiryFormTitle: { type: String, default: "Send an Enquiry" },
    enquiryFormSubtitle: {
      type: String,
      default:
        "Fill out the form below and our agronomy extension team will review your query and get back to you promptly.",
    },
    dealerBadge: { type: String, default: "Distribution Network" },
    dealerTitle: { type: String, default: "Become an Authorized Dealer" },
    dealerDesc: {
      type: String,
      default:
        "Join our 300+ strong dealer network across Karnataka, Maharashtra, AP, Telangana, and MP. Benefit from high-demand research-backed formulations and marketing support.",
    },
    dealerButtonText: { type: String, default: "Inquire for Dealership →" },
    dealerWhatsappText: {
      type: String,
      default: "Hello, I am interested in dealership registration with Plant Health Solutions.",
    },
    soilTestingBadge: { type: String, default: "Soil Health" },
    soilTestingTitle: { type: String, default: "Free Soil & Water Testing" },
    soilTestingDesc: {
      type: String,
      default:
        "Bring or courier your soil and water sample to our Tidagundi lab. Our chief agronomists will analyze pH, organic carbon, and micronutrient status free of cost.",
    },
    soilTestingButtonText: { type: String, default: "Explore Crop Solutions →" },
    soilTestingLinkUrl: { type: String, default: "/farmer-solutions" },
  },
  { timestamps: true }
);

export const SettingModel: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);
