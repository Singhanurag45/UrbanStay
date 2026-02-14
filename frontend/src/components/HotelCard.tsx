import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MapPin, Star, Wifi, Coffee, Utensils, ArrowRight, Heart } from "lucide-react";

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


// --- COMPONENT: HOTEL CARD ---
const HotelCard = ({ data }: { data: Hotel }) => {
  const navigate = useNavigate();
  // const [isLiked, setIsLiked] = useState(false);
  const rating = data.rating || (4.0 + Math.random()).toFixed(1); // Mock rating if missing

  // 1. Initial State: Check karein ki kya ye hotel pehle se wishlist mein hai
  const [isLiked, setIsLiked] = useState(() => {
    const saved = localStorage.getItem("urbanstay_wishlist");
    const wishlist = saved ? JSON.parse(saved) : [];
    return wishlist.some((item: Hotel) => item._id === data._id);
  });

  // 2. Toggle Function
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Card click se bachne ke liye

    const saved = localStorage.getItem("urbanstay_wishlist");
    let wishlist = saved ? JSON.parse(saved) : [];

    if (isLiked) {
      // Wishlist se remove karein
      wishlist = wishlist.filter((item: Hotel) => item._id !== data._id);
    } else {
      // Wishlist mein pura hotel object add karein (taaki display asaan ho)
      wishlist.push(data);
    }

    // LocalStorage update karein
    localStorage.setItem("urbanstay_wishlist", JSON.stringify(wishlist));
    setIsLiked(!isLiked);

    // Navbar ko update karne ke liye custom event (Optional but recommended)
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

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
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isLiked
                ? "bg-red-500 text-white"
                : "bg-black/50 text-white hover:text-red-500"
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

export default HotelCard;