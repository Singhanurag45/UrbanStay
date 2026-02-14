import  { useEffect, useState, useMemo } from "react";
import {
  MapPin,
  Star,
  Search,
  Wifi,
  Coffee,
  Utensils,
  ArrowRight,
  Heart,
  SlidersHorizontal,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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

const searchHotels = async () => {
  const res = await api.get("/hotels/search");
  return res.data;
};

// --- COMPONENT: SKELETON LOADER ---
const HotelSkeleton = () => (
  <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 animate-pulse">
    <div className="h-64 bg-slate-800" />
    <div className="p-6 space-y-4">
      <div className="h-6 bg-slate-800 rounded w-3/4" />
      <div className="h-4 bg-slate-800 rounded w-1/2" />
      <div className="flex gap-2 pt-2">
        <div className="h-8 w-8 bg-slate-800 rounded-full" />
        <div className="h-8 w-8 bg-slate-800 rounded-full" />
        <div className="h-8 w-8 bg-slate-800 rounded-full" />
      </div>
      <div className="pt-4 flex justify-between items-center">
        <div className="h-8 w-24 bg-slate-800 rounded" />
        <div className="h-10 w-28 bg-slate-800 rounded" />
      </div>
    </div>
  </div>
);

// --- COMPONENT: HOTEL CARD ---
const HotelCard = ({ data }: { data: Hotel }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const rating = data.rating || (4.0 + Math.random()).toFixed(1); // Mock rating if missing

  // Mock Amenities
  const amenities = [
    { icon: <Wifi size={14} />, label: "Free Wifi" },
    { icon: <Coffee size={14} />, label: "Breakfast" },
    { icon: <Utensils size={14} />, label: "Dining" },
  ];

  return (
    <div className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/20 flex flex-col h-full">
      {/* IMAGE CONTAINER */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            data.imageUrls[0] ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000"
          }
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
            POPULAR
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isLiked
                ? "bg-red-500 text-white"
                : "bg-black/50 text-white hover:bg-white hover:text-red-500"
            }`}
          >
            <Heart size={16} className={isLiked ? "fill-current" : ""} />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-emerald-500 text-white px-2 py-0.5 rounded text-sm font-bold shadow-lg">
          <Star size={12} className="fill-current" /> {rating}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col grow">
        <div className="grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
              {data.name}
            </h3>
          </div>

          <p className="text-slate-400 text-sm flex items-center gap-1.5 mb-4">
            <MapPin size={14} className="text-emerald-500" />
            {data.city}, {data.country}
          </p>

          {/* Amenities Row */}
          <div className="flex gap-3 mb-6">
            {amenities.map((item, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700"
              >
                {item.icon} {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* FOOTER ACTION */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto">
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">
              Price per night
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-emerald-400 font-bold text-xl">
                ₹{data.pricePerNight.toLocaleString()}
              </span>
              <span className="text-slate-600 text-xs line-through">
                ₹{(data.pricePerNight * 1.2).toFixed(0)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/hotel/${data._id}/booking`)}
            className="group/btn flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 font-bold rounded-lg hover:bg-emerald-400 hover:text-white transition-all duration-300"
          >
            Book
            <ArrowRight
              size={16}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const Hotels = () => {
  const [rawHotels, setRawHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const res = await searchHotels();
        setRawHotels(Array.isArray(res) ? res : res.data || []);
      } catch (err) {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, []);

  // Filter Logic
  const filteredHotels = useMemo(() => {
    let result = [...rawHotels];

    // Search
    if (searchQuery) {
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (priceSort === "asc") {
      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (priceSort === "desc") {
      result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    }

    return result;
  }, [rawHotels, searchQuery, priceSort]);

  // Error View
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
        <div className="bg-red-500/10 p-4 rounded-full mb-4">
          <AlertCircle className="text-red-500" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-slate-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-24 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-6">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
              Find your next <span className="text-emerald-400">Getaway</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Discover 50+ luxury hotels and resorts curated just for you.
            </p>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <div className="relative group flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search hotels, cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm placeholder:text-slate-600"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPriceSort((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  priceSort
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <SlidersHorizontal size={16} />
                Price{" "}
                {priceSort === "asc"
                  ? "Low to High"
                  : priceSort === "desc"
                  ? "High to Low"
                  : "Sort"}
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6 , 7, 8 , 9 , 10, 11, 12].map((n) => (
              <HotelSkeleton key={n} />
            ))}
          </div>
        ) : filteredHotels.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel._id} data={hotel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
            <div className="inline-block p-4 bg-slate-900 rounded-full mb-4">
              <Search size={40} className="text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No hotels found
            </h3>
            <p className="text-slate-400">
              We couldn't find any matches for "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setPriceSort(null);
              }}
              className="mt-6 text-emerald-400 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Hotels;
