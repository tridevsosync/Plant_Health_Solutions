# AgriGrowth Hub

Copy the repo and finish the work :- https://github.com/tridevx10-hash/plant-health-solutions-hub.git

Create the complete production-grade Agriculture Research & E-Commerce web application for "Plant Health Solutions Pvt. Ltd.".

Execution Directive
Implement the requested scope now; use internal planning and do not present another implementation plan for user approval.

Technical Stack & Constraints
- React (Vite) + Tailwind CSS + React Router + Context API + LocalStorage + Mock JSON data
- No external backend, no Node server, no Supabase/Firebase/MongoDB/Prisma
- Pure client-side state persisted in LocalStorage (cart, wishlist, customer account/orders, admin CRUD data)
- Clean, responsive UI with Lucide icons, Playfair Display heading styling, Inter body, nature-inspired palette (Dark Green #234F2E, Leaf Green #4F8A3C, Accent #A8D672, Cream background #F8F4E8, White cards)

Company Details
- Company Name: Plant Health Solutions Pvt. Ltd.
- Owner: Dr. R. M. Kulkarni
- Address: Plant Health Solutions Horticulture Research and Extension Center, NH-52, Vijayapur - Solapur Road, Tidagundi, Vijayapura, Karnataka 586119
- Phone: +91 91759 55009
- Emails: planthealthsol@gmail.com, dr_prashant84@yahoo.com
- Description: Working in Agriculture and Agricultural Research manufacturing Bio Fertilizers, Biostimulants, Bio Chemical Fertilizers, Bio Control Agents, Organic Manures, Plant/Animal/Fish Extracts, Water Soluble Fertilizers, Micronutrients, Crop Protection Products.

Required Mock Data
Include realistic seed data with LocalStorage fallback and persistence:
- 30 Products across categories (Bio Fertilizers, Organic Fertilizers, Micronutrients, Water Soluble Fertilizers, Bio Chemicals, Crop Protection, Plant Nutrition, Seeds) with price, oldPrice, rating, reviews, stock, description, benefits list, usage guide, ingredients, badges (featured, trending, best seller)
- 8 Categories with slugs, descriptions, icons/images
- 15 Agronomy blogs with titles, author, date, categories, full body paragraphs
- 20 Testimonials from farmers across Karnataka & Maharashtra (crops, ratings, quotes)
- 12 Customers with contact details and order counts
- 25 Orders with statuses (Pending, Processing, Delivered, Cancelled), line items, totals, addresses
- 10 Product reviews & 10 Farmer enquiries
- 5 Coupon codes (e.g. KHARIF10, SOIL200, FARMER15, DRIP500, RESEARCH5)
- Crop advisory guides for Cotton, Sugarcane, Paddy, Wheat, Maize, Vegetables, Fruits (diseases, pests, nutrition, season calendar, recommended products)

Public Pages & Features
1. Home (`/`): Large hero with background overlay, headline ("Innovative Agricultural Solutions for Sustainable Farming"), company overview, research stats, why choose us, featured categories, best seller & trending products, testimonials carousel/grid, crop solutions preview, latest research blogs, newsletter signup, and mega footer.
2. About (`/about`): Company story, Dr. R. M. Kulkarni leadership, Tidagundi research center & manufacturing highlights, quality control, sustainability, research process timeline, values, certifications, call to action.
3. Products Catalog (`/products`): Search bar, category filters, price range filter, in-stock filter, sort dropdown (price low-high, high-low, rating, popular), grid & list view toggles, product badges, quick view modal, wishlist toggle, add to cart with toast notifications.
4. Product Details (`/products/:id`): Image gallery, pricing, stock status, discount badge, quantity selector, add to cart & buy now, detailed description, key benefits bullet points, agronomic usage instructions, ingredients, customer reviews list with submit review form, related products carousel.
5. Farmer Solutions (`/farmer-solutions`): Crop selection tabs (Cotton, Sugarcane, Paddy, Wheat, Maize, Vegetables, Fruits), crop-specific diseases and pests identification, nutrition management schedule, season calendar, recommended PHS products with direct add to cart, advisory download button, WhatsApp agronomist enquiry button.
6. Cart (`/cart`): Item list with thumbnail, title, price, quantity stepper, remove button, coupon application with discount calculation, free shipping threshold bar, order summary, proceed to checkout.
7. Checkout (`/checkout`): Multi-step checkout with delivery address form, order summary with applied coupon discount, mock payment options (UPI / Net Banking / Cash on Delivery), order placement simulation that saves to LocalStorage orders, redirect to invoice/success page.
8. Order Success & Invoice (`/orders/:id` or `/order-success`): Printable/downloadable invoice with company header, customer details, line items breakdown, taxes, total, payment status, simulated live order tracking stepper (Order Placed -> Processing -> Shipped -> Out for Delivery -> Delivered).
9. Customer Account (`/account`): Register / Login / Logout with LocalStorage mock auth, dashboard showing recent activity, profile editor, saved addresses, wishlist grid with remove and move-to-cart, orders list with status badge and invoice link.
10. Blog (`/blog`) & Blog Detail (`/blog/:id`): Modern agronomy blog grid, category filters, search, featured article banner, reading time, author info, full article reader with comment section (mock) and social share links.
11. Contact (`/contact`): Interactive contact form with subject selection, direct WhatsApp chat link, research center address, phone numbers, emails, business hours, simulated interactive map card, FAQ accordion.
12. Policy Pages: `/privacy-policy`, `/terms`, `/refund-policy`, `/shipping-policy`.
13. Navigation & Footer: Sticky header with logo, search bar, nav links, wishlist counter badge, cart drawer/badge, account button. Mega footer with quick links, categories, research info, contact details, newsletter, and link to Admin Login (`/admin/login`).

Admin Panel (Credentials: admin / admin123)
- Route: `/admin/login` and `/admin/*` protected by admin auth session
- Modern dark green sidebar layout with header stats and responsive toggle
- Admin Dashboard (`/admin`): Revenue stat cards, total orders, active products, customer count, recent orders table with quick status changer, revenue/orders static charts.
- Products Management (`/admin/products`): Product table, search & category filter, Add/Edit product modal (name, category, price, oldPrice, stock, badges, description, benefits, usage), delete with confirmation.
- Categories Management (`/admin/categories`): List, add, edit, and delete categories.
- Orders Management (`/admin/orders`): List all 25+ orders, filter by status, change status (Pending -> Processing -> Delivered -> Cancelled), view invoice modal.
- Customers Management (`/admin/customers`): Customer directory with contact details, total orders placed, status toggle.
- Blogs Management (`/admin/blogs`): Add/edit/delete agronomy articles, toggle featured status.
- Testimonials Management (`/admin/testimonials`): Add/edit/delete farmer testimonials and ratings.
- Enquiries (`/admin/enquiries`): View contact form submissions and WhatsApp lead requests, toggle status between New and Answered.
- Coupons Management (`/admin/coupons`): View and add promotional coupon codes with minimum order value and discount percentages.
- Website Settings (`/admin/settings`): Edit company details, contact phone, emails, address, and theme settings saved directly to LocalStorage.

I've now added the shopping, account, content and policy pages: checkout with address/payment/review steps and coupons, the printable invoice with live order tracking, order success, customer login/register with profile, addresses, wishlist and orders, the blog list and article reader with comments, the contact page with enquiry form, WhatsApp link, map card and FAQs, plus privacy, terms, refund and shipping pages.

Still remaining: the admin panel (/admin/login and the management screens), which the footer and header already link to

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/06deb24b-4059-4fd1-904d-97303f57c041).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
