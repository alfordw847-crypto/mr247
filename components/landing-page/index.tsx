// app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Megaphone, ShoppingCart, TrendingUp } from "lucide-react";
import StatsCounters from "./counter";
import Header from "./header";
import Testimonial from "./hero";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col ">
      <Header />
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-700 text-white px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Grow Your Business with Smart Ads
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90 mb-8">
          Buy a package, showcase your ads, and reach your audience instantly.
          Advertising made simple, powerful, and affordable.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-200"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-blue-600"
          >
            View Packages
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20  bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center max-w-6xl mx-auto">
          <div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
            <ShoppingCart className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <h4 className="font-semibold text-lg mb-2">1. Buy Package</h4>
            <p className="text-gray-600">
              Choose the plan that fits your advertising goals.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
            <Megaphone className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <h4 className="font-semibold text-lg mb-2">2. Launch Ads</h4>
            <p className="text-gray-600">
              Post your ads instantly across our platform.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
            <TrendingUp className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <h4 className="font-semibold text-lg mb-2">3. Get Results</h4>
            <p className="text-gray-600">
              Watch your reach, clicks, and conversions grow.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonial />

      {/* Subscription Packages */}
      <StatsCounters />

      {/* Footer */}
      <footer className="px-6 py-8 bg-indigo-900 text-gray-300 text-center">
        <p>© 2025 AdBoost. All rights reserved.</p>
      </footer>
    </main>
  );
}
