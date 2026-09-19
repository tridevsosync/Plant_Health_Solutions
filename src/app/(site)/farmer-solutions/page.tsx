"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Leaf, ShieldAlert } from "lucide-react";

interface CropSolution {
  name: string;
  season: string;
  image: string;
  diseases: string[];
  products: string[];
}

const cropSolutions: CropSolution[] = [
  {
    name: "Cotton",
    season: "Kharif (June-October)",
    image: "https://images.unsplash.com/photo-1594897030561-681c953531db?auto=format&fit=crop&w=1200&q=80",
    diseases: ["Bollworm", "Whitefly", "Leaf curl virus"],
    products: ["GreenGold Hybrid Cotton Seeds", "ProtectMax Imidacloprid", "MicroMix Plus"],
  },
  {
    name: "Sugarcane",
    season: "Year-round, peak Feb-March",
    image: "https://images.unsplash.com/photo-1611735341450-74d61e660ad2?auto=format&fit=crop&w=1200&q=80",
    diseases: ["Red rot", "Smut", "Borer complex"],
    products: ["AgriPro Sugarcane Setts", "Potash Power MOP", "BioShield Trichoderma"],
  },
  {
    name: "Wheat",
    season: "Rabi (Nov-April)",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80",
    diseases: ["Rust", "Karnal bunt", "Loose smut"],
    products: ["GoldenGrain Wheat Seeds", "GreenBoost Urea", "FungiKill Mancozeb"],
  },
  {
    name: "Maize",
    season: "Kharif & Rabi",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80",
    diseases: ["Fall armyworm", "Turcicum leaf blight"],
    products: ["HarvestPlus Maize Hybrid", "CropGuard Chlorpyrifos"],
  },
  {
    name: "Grapes",
    season: "Pruning Apr & Oct",
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1200&q=80",
    diseases: ["Downy mildew", "Powdery mildew", "Anthracnose"],
    products: ["BlightShield Copper Oxychloride", "GrowMore GA3", "SeaWeed Extract"],
  },
  {
    name: "Pomegranate",
    season: "Hasta bahar / Mrig bahar",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80",
    diseases: ["Bacterial blight", "Wilt", "Fruit borer"],
    products: ["AgriCal Calcium Nitrate", "BioShield Trichoderma", "Amino Power"],
  },
  {
    name: "Vegetables",
    season: "Year-round",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    diseases: ["TYLCV", "Damping off", "Aphids"],
    products: ["FreshFarm Tomato Seeds F1", "Verticillium Bio-Insecticide", "Organic Vermicompost"],
  },
];

export default function FarmerSolutionsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80"
          alt="Farmer Solutions Knowledge Center"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#122b17]/95 via-[#183a1f]/90 to-[#285724]/80 backdrop-blur-[0.5px]" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
          <h1 className="max-w-3xl font-display text-4xl font-bold md:text-5xl leading-tight text-white">
            Farmer Solutions Knowledge Center
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">
            Crop-wise disease management, fertilizer guides and seasonal calendars.
          </p>
        </div>
      </section>

      {/* Crop Solutions Cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="space-y-8">
          {cropSolutions.map((crop) => (
            <div
              key={crop.name}
              className="grid gap-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md md:grid-cols-[260px_1fr]"
            >
              {/* Crop Image */}
              <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-muted">
                <img
                  alt={crop.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  src={crop.image}
                />
              </div>

              {/* Crop Content */}
              <div className="p-6">
                <h2 className="font-display text-2xl font-bold text-primary">{crop.name}</h2>
                <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-secondary" />
                  {crop.season}
                </p>

                <div className="mt-5 grid gap-6 md:grid-cols-2">
                  {/* Common Diseases & Pests */}
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      <ShieldAlert className="h-4 w-4 text-destructive" />
                      Common diseases &amp; pests
                    </div>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {crop.diseases.map((disease) => (
                        <li key={disease} className="flex items-center gap-1.5">
                          <span className="text-destructive/70">•</span> {disease}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Products */}
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Leaf className="h-4 w-4 text-secondary" />
                      Recommended products
                    </div>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {crop.products.map((product) => (
                        <li key={product}>
                          <Link
                            href={`/products?q=${encodeURIComponent(product.split(" ")[0])}`}
                            className="hover:text-secondary transition-colors"
                          >
                            • {product}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
