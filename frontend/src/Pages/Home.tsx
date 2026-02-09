import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Star,
  ShieldCheck,
  Clock,
  Percent,
  ArrowRight,
  TrendingUp,
  Mail,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  // Search State
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("1");

  const handleSearch = () => {
    // Navigate to hotels page with search params
    navigate(`/hotels?search=${destination}&guests=${guests}`);
  };

  return (
    <main className="bg-slate-950 text-white font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 pt-20 pb-32">
        {/* Background Image with Parallax-like fixed attachment */}
        <div
          className="absolute inset-0 z-0 bg-fixed"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/70 via-slate-950/50 to-slate-950"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto mt-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md mb-8">
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider">
              NEW
            </span>
            <span className="text-emerald-300 text-sm font-medium">
              Summer Sale: Flat 20% Off
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-none">
  <span className="flex items-center justify-center gap-2 text-emerald-400 text-sm uppercase tracking-widest mb-4">
    <span className="w-8 h-px bg-emerald-400/60" />
    Urban Stay
    <span className="w-8 h-px bg-emerald-400/60" />
  </span>

  Find Your Next <br />
  <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-200">
    Dream Getaway
  </span>
</h1>


          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light">
            Discover curated luxury hotels, hidden gems, and unforgettable
            experiences across the globe.
          </p>

          {/* Search Widget */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl max-w-5xl w-full mx-auto transform hover:scale-[1.01] transition-transform duration-300">
            <div className="grid grid-cols-1 md:grid-cols-10 gap-3">
              {/* Location */}
              <div className="md:col-span-4 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                  <MapPin size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-950/50 text-white pl-12 pr-4 py-4 rounded-xl border border-white/5 focus:border-emerald-500/50 focus:bg-slate-900 focus:outline-none transition-all"
                />
              </div>

              {/* Date */}
              <div className="md:col-span-3 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                  <Calendar size={20} />
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950/50 text-white pl-12 pr-4 py-4 rounded-xl border border-white/5 focus:border-emerald-500/50 focus:bg-slate-900 focus:outline-none transition-all scheme-dark"
                />
              </div>

              {/* Guests */}
              <div className="md:col-span-2 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                  <Users size={20} />
                </div>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-slate-950/50 text-white pl-12 pr-4 py-4 rounded-xl border border-white/5 focus:border-emerald-500/50 focus:bg-slate-900 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4+">4+ Guests</option>
                </select>
              </div>

              {/* Button */}
              <button
                onClick={handleSearch}
                className="md:col-span-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/20 flex items-center justify-center"
              >
                <Search size={24} />
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4 text-sm text-slate-400">
            <span>Popular:</span>
            <button
              onClick={() => setDestination("Goa")}
              className="hover:text-emerald-400 underline decoration-dotted"
            >
              Goa
            </button>
            <button
              onClick={() => setDestination("Mumbai")}
              className="hover:text-emerald-400 underline decoration-dotted"
            >
              Mumbai
            </button>
            <button
              onClick={() => setDestination("Manali")}
              className="hover:text-emerald-400 underline decoration-dotted"
            >
              Manali
            </button>
          </div>
        </div>
      </section>

      {/* 2. TRENDING DESTINATIONS */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="text-emerald-400" />
          <h2 className="text-3xl font-bold">Trending Destinations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-125">
          <DestinationCard
            title="Goa"
            count="120+ Hotels"
            image="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800"
            className="md:col-span-2 md:row-span-2"
          />
          <DestinationCard
            title="Mumbai"
            count="85+ Hotels"
            image="https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=800"
            className="md:col-span-1 md:row-span-1"
          />
          <DestinationCard
            title="Jaipur"
            count="64+ Hotels"
            image="https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800"
            className="md:col-span-1 md:row-span-1"
          />
          <DestinationCard
            title="Manali"
            count="42+ Hotels"
            image="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800"
            className="md:col-span-2 md:row-span-1"
          />
        </div>
      </section>

      {/* 3. POPULAR HOTELS */}
      <section className="bg-slate-900/30 py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Popular Stays
              </h2>
              <p className="text-slate-400">
                Top-rated accommodations by travelers like you.
              </p>
            </div>
            <button
              onClick={() => navigate("/hotels")}
              className="hidden md:flex items-center gap-2 text-emerald-400 hover:text-white transition-colors font-medium"
            >
              View all <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {hotelData.map((hotel, index) => (
              <HotelCard key={index} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Book With Us?
          </h2>
          <p className="text-slate-400">
            We prioritize your comfort and security above all else.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            icon={<Percent size={32} />}
            title="Best Price Guarantee"
            desc="Find a lower price? We'll match it plus give you 5% off."
          />
          <Feature
            icon={<ShieldCheck size={32} />}
            title="Secure Booking"
            desc="Banking-level encryption keeps your data safe."
          />
          <Feature
            icon={<Clock size={32} />}
            title="24/7 Support"
            desc="Our team is here to help you anytime, anywhere."
          />
        </div>
      </section>

      {/* 5. NEWSLETTER CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-linear-to-r from-emerald-900 to-slate-900 rounded-3xl p-10 md:p-16 text-center border border-emerald-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <div className="inline-block p-3 bg-emerald-500/20 rounded-full mb-6 text-emerald-400">
              <Mail size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Unlock Exclusive Deals</h2>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
              Join 10,000+ travelers and get 10% off your first booking plus
              secret deals sent to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-slate-950/50 border border-emerald-500/30 text-white px-6 py-3 rounded-xl focus:outline-none focus:border-emerald-500 w-full"
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

/* --- Sub Components --- */

const Feature = ({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) => (
  <div className="group bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="w-14 h-14 bg-slate-950 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-800">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const DestinationCard = ({ title, count, image, className }: any) => (
  <div
    className={`relative group rounded-2xl overflow-hidden cursor-pointer ${className}`}
  >
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
    />
    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
    <div className="absolute bottom-4 left-4">
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="text-emerald-400 text-sm font-medium">{count}</p>
    </div>
  </div>
);

const HotelCard = ({ hotel }: { hotel: any }) => (
  <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 group hover:border-emerald-500/40 transition-all duration-300 hover:shadow-2xl">
    <div className="relative overflow-hidden h-64">
      <img
        src={hotel.image}
        alt={hotel.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium border border-white/10">
        <Star size={14} className="text-yellow-400 fill-yellow-400" />
        <span className="text-white">{hotel.rating}</span>
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
        {hotel.name}
      </h3>
      <p className="text-slate-400 text-sm flex items-center gap-1 mt-1 mb-4">
        <MapPin size={14} /> {hotel.location}
      </p>
      <div className="flex justify-between items-center border-t border-slate-800 pt-4">
        <div>
          <p className="text-xs text-slate-500">Starting from</p>
          <p className="text-emerald-400 font-bold text-lg">
            ₹{hotel.price.toLocaleString()}
          </p>
        </div>
        <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-emerald-400 hover:text-white transition-colors">
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  </div>
);

// Mock Data
const hotelData = [
  {
    name: "The Royal Plaza",
    location: "Mumbai, India",
    price: 104999,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Ocean View Resort",
    location: "Goa, India",
    price: 128500,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Himalayan Retreat",
    location: "Manali, India",
    price: 123200,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1585543805890-6051f7829f98?auto=format&fit=crop&w=800&q=80",
  },
];

export default Home;
