import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import { ProductModel } from "@/models/Product";
import { CategoryModel } from "@/models/Category";
import { OrderModel } from "@/models/Order";
import { BlogModel } from "@/models/Blog";
import { GalleryModel } from "@/models/Gallery";
import { CouponModel } from "@/models/Coupon";
import { CustomerModel } from "@/models/Customer";
import { EnquiryModel } from "@/models/Enquiry";
import { TestimonialModel } from "@/models/Testimonial";
import { TeamMemberModel } from "@/models/TeamMember";
import { ReviewModel } from "@/models/Review";
import { SettingModel } from "@/models/Setting";
import { UserModel } from "@/models/User";
import {
  products as seedProducts,
  categories as seedCategories,
  orders as seedOrders,
  blogs as seedBlogs,
  galleryItems as seedGallery,
  coupons as seedCoupons,
  customers as seedCustomers,
  enquiries as seedEnquiries,
  testimonials as seedTestimonials,
  teamMembers as seedTeamMembers,
  reviews as seedReviews,
  COMPANY,
} from "./data";

export async function seedDatabase(force = false) {
  await connectDB();

  // 1. Check & Seed Categories
  const catCount = await CategoryModel.countDocuments();
  if (catCount === 0 || force) {
    if (force) await CategoryModel.deleteMany({});
    if (seedCategories.length > 0) {
      await CategoryModel.insertMany(seedCategories);
      console.log(`Seeded ${seedCategories.length} categories${force ? ' (forced)' : ''}`);
    }
  }

  // 2. Check & Seed Products
  const prodCount = await ProductModel.countDocuments();
  if (prodCount === 0 || force) {
    if (force) await ProductModel.deleteMany({});
    if (seedProducts.length > 0) {
      await ProductModel.insertMany(seedProducts);
      console.log(`Seeded ${seedProducts.length} products${force ? ' (forced)' : ''}`);
    }
  }

  // 3. Check & Seed Blogs
  const blogCount = await BlogModel.countDocuments();
  if (blogCount === 0 || force) {
    if (force) await BlogModel.deleteMany({});
    await BlogModel.insertMany(seedBlogs);
    console.log(`Seeded ${seedBlogs.length} blogs`);
  }

  // 3.1 Check & Seed Gallery
  const gallCount = await GalleryModel.countDocuments();
  if (gallCount === 0 || force) {
    if (force) await GalleryModel.deleteMany({});
    await GalleryModel.insertMany(seedGallery);
    console.log(`Seeded ${seedGallery.length} gallery items`);
  }

  // 4. Check & Seed Testimonials
  const testCount = await TestimonialModel.countDocuments();
  if (testCount === 0 || force) {
    if (force) await TestimonialModel.deleteMany({});
    await TestimonialModel.insertMany(seedTestimonials);
    console.log(`Seeded ${seedTestimonials.length} testimonials`);
  }

  // 4.1 Check & Seed Team Members
  const teamCount = await TeamMemberModel.countDocuments();
  if (teamCount === 0 || force) {
    if (force) await TeamMemberModel.deleteMany({});
    await TeamMemberModel.insertMany(seedTeamMembers);
    console.log(`Seeded ${seedTeamMembers.length} team members`);
  }

  // 5. Check & Seed Coupons
  const coupCount = await CouponModel.countDocuments();
  if (coupCount === 0 || force) {
    if (force) await CouponModel.deleteMany({});
    await CouponModel.insertMany(seedCoupons);
    console.log(`Seeded ${seedCoupons.length} coupons`);
  }

  // 6. Check & Seed Customers
  const custCount = await CustomerModel.countDocuments();
  if (custCount === 0 || force) {
    if (force) await CustomerModel.deleteMany({});
    await CustomerModel.insertMany(seedCustomers);
    console.log(`Seeded ${seedCustomers.length} customers`);
  }

  // 7. Check & Seed Orders
  const ordCount = await OrderModel.countDocuments();
  if ((ordCount === 0 || force) && seedOrders.length > 0) {
    if (force) await OrderModel.deleteMany({});
    await OrderModel.insertMany(seedOrders);
    console.log(`Seeded ${seedOrders.length} orders`);
  }

  // 8. Check & Seed Enquiries
  const enqCount = await EnquiryModel.countDocuments();
  if (enqCount === 0 || force) {
    if (force) await EnquiryModel.deleteMany({});
    await EnquiryModel.insertMany(seedEnquiries);
    console.log(`Seeded ${seedEnquiries.length} enquiries`);
  }

  // 9. Check & Seed Reviews
  const revCount = await ReviewModel.countDocuments();
  if ((revCount === 0 || force) && seedReviews.length > 0) {
    if (force) await ReviewModel.deleteMany({});
    await ReviewModel.insertMany(seedReviews);
    console.log(`Seeded ${seedReviews.length} reviews`);
  }

  // 10. Check & Seed Settings
  const settingsCount = await SettingModel.countDocuments();
  if (settingsCount === 0 || force) {
    if (force) await SettingModel.deleteMany({});
    await SettingModel.create({
      key: "company_settings",
      name: COMPANY.name,
      owner: COMPANY.owner,
      phone: COMPANY.phone,
      email1: COMPANY.email1,
      email2: COMPANY.email2,
      address: COMPANY.address,
      description: COMPANY.description,
    });
    console.log("Seeded default company settings");
  }

  // 11. Seed Admin User and Demo User
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "planthealth@gmail.com";
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Planthealth@123";
  const existingAdmin = await UserModel.findOne({ email: adminEmail.toLowerCase() });
  if (!existingAdmin) {
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    await UserModel.create({
      name: "Plant Health Admin",
      email: adminEmail.toLowerCase(),
      phone: "+91 91759 55009",
      password: hashedAdminPassword,
      role: "admin",
      addresses: [
        {
          label: "Office",
          line: "PHS Research Center, NH-52, Tidagundi",
          city: "Vijayapura",
          pincode: "586119",
        },
      ],
    });
    console.log("Seeded admin user:", adminEmail);
  }

  const demoUser = await UserModel.findOne({ email: "farmer@example.com" });
  if (!demoUser) {
    const hashedDemoPassword = await bcrypt.hash("Farmer@123", 10);
    await UserModel.create({
      name: "Ramesh Patil",
      email: "farmer@example.com",
      phone: "+91 98450 12345",
      password: hashedDemoPassword,
      role: "user",
      addresses: [
        {
          label: "Farm House",
          line: "Plot 14, Bagalkot Road",
          city: "Vijayapura",
          pincode: "586101",
        },
      ],
    });
  }

  return { success: true, message: "Database initialized successfully" };
}
