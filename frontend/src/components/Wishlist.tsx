import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Navigation ke liye
import HotelCard from "./HotelCard";
import { Heart, Search, ArrowRight } from "lucide-react";



type Hotel = {
  _id: string;
  name: string;
  city: string;
  country: string;
  pricePerNight: number;
  imageUrls: string[];
  description?: string; // Optional: for display if available
  rating?: number; // Optional: fallback used if missing
};

const Wishlist = () => {
  const [items, setItems] = useState<Hotel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("urbanstay_wishlist");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-10">
          My <span className="text-emerald-400">Wishlist</span>
        </h1>

        {items.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {items.map((hotel) => (
              <HotelCard key={hotel._id} data={hotel} />
            ))}
          </div>
        ) : (
          /* --- ENHANCED EMPTY STATE --- */
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-900/20 rounded-3xl border border-slate-800 border-dashed transition-all">
            {/* Animated Icon Decoration */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
              <div className="relative bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <Heart size={48} className="text-slate-700 animate-pulse" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
              No saved getaways yet
            </h3>

            <p className="text-slate-400 text-center max-w-sm mb-8 leading-relaxed">
              Your wishlist is looking a bit lonely. Explore our handpicked
              collection of luxury stays and save your favorites here.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigate("/hotels")}
              className="group flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Search size={18} />
              Start Exploring
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;