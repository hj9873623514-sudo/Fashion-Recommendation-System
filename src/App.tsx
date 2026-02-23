/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Shirt, 
  Sparkles, 
  CloudSun, 
  Palette, 
  Calendar, 
  User, 
  Loader2,
  ArrowRight,
  CheckCircle2,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OutfitRecommendation {
  outfit_name: string;
  occasion: string;
  top_wear: string;
  bottom_wear: string;
  footwear: string;
  accessories: string;
  weather_adjustments: string;
  styling_tips: string;
}

const OCCASIONS = [
  "Casual Hangout", "Formal Wedding", "Business Meeting", "Date Night", 
  "Gym/Workout", "Beach Day", "Cocktail Party", "Hiking/Outdoor"
];

const GENDERS = ["Masculine", "Feminine", "Androgynous"];
const WEATHERS = ["Sunny/Hot", "Cold/Freezing", "Rainy", "Mild/Pleasant", "Windy"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter"];

export default function App() {
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [gender, setGender] = useState(GENDERS[0]);
  const [weather, setWeather] = useState(WEATHERS[0]);
  const [season, setSeason] = useState(SEASONS[0]);
  const [color, setColor] = useState("Navy Blue & Cream");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateOutfit = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a high-quality outfit recommendation for:
          Occasion: ${occasion}
          Gender preference: ${gender}
          Weather: ${weather}
          Season: ${season}
          Color preference: ${color}`,
        config: {
          systemInstruction: "You are an expert AI fashion stylist. Provide highly personalized, stylish, and practical outfit recommendations. Return the response STRICTLY in valid JSON format.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              outfit_name: { type: Type.STRING },
              occasion: { type: Type.STRING },
              top_wear: { type: Type.STRING },
              bottom_wear: { type: Type.STRING },
              footwear: { type: Type.STRING },
              accessories: { type: Type.STRING },
              weather_adjustments: { type: Type.STRING },
              styling_tips: { type: Type.STRING },
            },
            required: ["outfit_name", "occasion", "top_wear", "bottom_wear", "footwear", "accessories", "weather_adjustments", "styling_tips"]
          },
        },
      });

      const data = JSON.parse(response.text || "{}") as OutfitRecommendation;
      setRecommendation(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate outfit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-[#1a1a1a] font-sans selection:bg-[#5A5A40] selection:text-white">
      {/* Header */}
      <header className="border-b border-black/10 px-6 py-8 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center text-white">
            <Shirt size={20} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight uppercase">Stylist AI</h1>
        </div>
        <nav className="hidden md:flex gap-8 text-xs font-medium uppercase tracking-widest opacity-60">
          <a href="#" className="hover:opacity-100 transition-opacity">Collections</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Trends</a>
          <a href="#" className="hover:opacity-100 transition-opacity">About</a>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Column: Form */}
        <section>
          <div className="mb-12">
            <h2 className="text-5xl md:text-7xl font-serif font-light leading-tight mb-6">
              Your Personal <br />
              <span className="italic">Digital Wardrobe</span>
            </h2>
            <p className="text-lg opacity-70 max-w-md">
              Tell us about your day, and our AI stylist will craft the perfect ensemble tailored to your preferences and environment.
            </p>
          </div>

          <div className="space-y-8 bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Occasion */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                  <Sparkles size={12} /> Occasion
                </label>
                <select 
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full bg-[#f9f9f9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all cursor-pointer"
                >
                  {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                  <User size={12} /> Style Preference
                </label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-[#f9f9f9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all cursor-pointer"
                >
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              {/* Weather */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                  <CloudSun size={12} /> Weather
                </label>
                <select 
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="w-full bg-[#f9f9f9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all cursor-pointer"
                >
                  {WEATHERS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              {/* Season */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                  <Calendar size={12} /> Season
                </label>
                <select 
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full bg-[#f9f9f9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all cursor-pointer"
                >
                  {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Color Preference */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                <Palette size={12} /> Color Palette
              </label>
              <input 
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Earthy tones, Monochrome, Pastel Pink"
                className="w-full bg-[#f9f9f9] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
              />
            </div>

            <button
              onClick={generateOutfit}
              disabled={loading}
              className="w-full bg-[#1a1a1a] text-white rounded-full py-4 px-8 font-medium flex items-center justify-center gap-2 hover:bg-[#2a2a2a] disabled:opacity-50 transition-all group"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Curating your look...
                </>
              ) : (
                <>
                  Generate Recommendation
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center mt-4 bg-red-50 py-2 rounded-lg border border-red-100">
                {error}
              </p>
            )}
          </div>
        </section>

        {/* Right Column: Result */}
        <section className="relative">
          <AnimatePresence mode="wait">
            {!recommendation && !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-black/10 rounded-[40px] bg-black/[0.02]"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  <Shirt className="opacity-20" size={40} />
                </div>
                <h3 className="text-2xl font-serif italic mb-2">Ready to be styled?</h3>
                <p className="opacity-50 max-w-xs">Fill out the form to receive a bespoke outfit recommendation.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-[#5A5A40]/10 border-t-[#5A5A40] rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-[#5A5A40] animate-pulse" size={32} />
                  </div>
                </div>
                <p className="mt-8 text-lg font-serif italic opacity-70">Analyzing trends and weather patterns...</p>
              </motion.div>
            )}

            {recommendation && !loading && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[40px] shadow-xl shadow-black/5 border border-black/5 overflow-hidden"
              >
                {/* Result Header */}
                <div className="bg-[#1a1a1a] p-8 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">Bespoke Recommendation</span>
                    <CheckCircle2 size={20} className="text-emerald-400" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif font-light leading-tight">
                    {recommendation.outfit_name}
                  </h3>
                </div>

                {/* Result Body */}
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <ItemDisplay label="Top Wear" value={recommendation.top_wear} />
                      <ItemDisplay label="Bottom Wear" value={recommendation.bottom_wear} />
                      <ItemDisplay label="Footwear" value={recommendation.footwear} />
                    </div>
                    <div className="space-y-6">
                      <ItemDisplay label="Accessories" value={recommendation.accessories} />
                      <ItemDisplay label="Weather Ready" value={recommendation.weather_adjustments} />
                      <div className="p-4 bg-[#f5f2ed] rounded-2xl border border-black/5">
                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 block mb-2">Stylist Note</label>
                        <p className="text-sm italic leading-relaxed opacity-80">
                          "{recommendation.styling_tips}"
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-black/5 flex items-center gap-4 text-xs opacity-40 uppercase tracking-widest font-bold">
                    <Info size={14} />
                    Generated for {recommendation.occasion}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-black/10 px-6 py-12 md:px-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30">
          Powered by Google Gemini & Stylist AI &copy; 2026
        </p>
      </footer>
    </div>
  );
}

function ItemDisplay({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">{label}</label>
      <p className="text-lg font-medium leading-snug">{value}</p>
    </div>
  );
}

