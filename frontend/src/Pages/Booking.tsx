import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Loader2,
  Calendar,
  Users,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  Minus,
  Plus,
  CreditCard,
  Info,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

// Define Hotel Type for better TS support
type HotelType = {
  _id: string;
  name: string;
  city: string;
  country: string;
  pricePerNight: number;
  imageUrls: string[];
};

const Booking = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [hotel, setHotel] = useState<HotelType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // New state for button loading

  // Form State
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
 
  // Auth Protection
  useEffect(() => {
    if (!isLoggedIn) {
      toast.dismiss(); // prevent stacking
      toast.error("Please login to book a hotel");
      navigate("/login", {
        replace: true,
        state: { from: `/hotel/${hotelId}/booking` },
      });
    }
  }, [isLoggedIn, hotelId]);
  

  // Fetch Hotel
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await api.get(`/hotels/${hotelId}`);
        console.log("RAW RESPONSE:", response.data);
        setHotel(response.data);
      } catch (error) {
        console.error("Error fetching hotel:", error);
        toast.error("Failed to load hotel details");
      } finally {
        setLoading(false);
      }
    };
    if (hotelId) fetchHotel();
  }, [hotelId]);

  // Calculations
  const bookingSummary = useMemo(() => {
    if (!checkIn || !checkOut || !hotel) return null;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights =
      Math.floor(
        (end.setHours(0,0,0,0) - start.setHours(0,0,0,0)) /
        (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) return null;
    // Safety check: ensure check-out is after check-in
    if (start >= end) return null;

    const basePrice = nights * hotel.pricePerNight;
    const tax = Math.round(basePrice * 0.12); // 12% Tax
    const serviceFee = 500; // Flat fee

    return {
      nights,
      basePrice,
      tax,
      serviceFee,
      total: basePrice + tax + serviceFee,
    };
  }, [checkIn, checkOut, hotel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingSummary || !hotel) return;

    // Frontend validation
    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    setSubmitting(true);

    try {
      // Sends data exactly as your backend expects
      await api.post("/bookings", {
        hotelId,
        checkIn,
        checkOut,
        adultCount,
        childCount,
        totalCost: bookingSummary.total,
      });

      toast.success("Booking confirmed successfully!");
      navigate("/my-bookings");
    } catch (error: any) {
   
       // Handle the specific "Hotel already booked" 400 error from your controller
       if (error.response?.status === 400) { 
        toast.error("Hotel already booked for selected dates");
        window.scrollTo({ top: 0, behavior: "smooth" });
        console.log("Hotel already booked for selected dates");
        return;
      }
      const errorMessage = error.response?.data?.message || "Booking failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-400" size={40} />
      </div>
    );

  if (!hotel)
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
            <AlertCircle size={48} className="text-red-500" />
            <h2 className="text-xl font-bold">Hotel Not Found</h2>
            <button onClick={() => navigate("/")} className="text-emerald-400 hover:underline">Go Home</button>
        </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-6 text-white font-sans animate-fade-in">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Hotel Snapshot */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <div className="relative h-48">
              <img
                src={hotel.imageUrls?.[0] || "https://via.placeholder.com/500"}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-slate-900 to-transparent h-20" />
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold line-clamp-1">{hotel.name}</h2>
                <div className="flex items-center gap-1 text-sm bg-slate-800 px-2 py-1 rounded shrink-0">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span>4.8</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                <MapPin size={16} className="shrink-0" />
                <span className="line-clamp-1">{hotel.city}, {hotel.country}</span>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-800">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Free Cancellation until 24h before</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Instant Confirmation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3">
            <ShieldCheck className="text-emerald-400 shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-emerald-400 text-sm">
                Secure Booking
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Your payment information is encrypted and processed securely.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Booking Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl"
          >
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <CreditCard className="text-emerald-400" />
              Confirm Booking
            </h1>

            {/* Step 1: Dates */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-slate-400" /> Select Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Check In
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors scheme:dark"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Check Out
                  </label>
                  <input
                    type="date"
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors scheme:dark"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Guests */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users size={18} className="text-slate-400" /> Guests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GuestCounter
                  label="Adults"
                  subLabel="Age 13+"
                  value={adultCount}
                  onChange={setAdultCount}
                  min={1}
                />
                <GuestCounter
                  label="Children"
                  subLabel="Age 2-12"
                  value={childCount}
                  onChange={setChildCount}
                  min={0}
                />
              </div>
            </div>

            {/* Step 3: Order Summary (Bill) */}
            {bookingSummary ? (
              <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 mb-8 animate-fade-in">
                <h4 className="text-lg font-bold mb-4 border-b border-slate-800 pb-2">
                  Price Breakdown
                </h4>

                <div className="space-y-3 text-slate-300 text-sm">
                  <div className="flex justify-between">
                    <span>
                      ₹{hotel.pricePerNight.toLocaleString()} x{" "}
                      {bookingSummary.nights} nights
                    </span>
                    <span>₹{bookingSummary.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees (12%)</span>
                    <span>₹{bookingSummary.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>₹{bookingSummary.serviceFee}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800">
                  <span className="font-bold text-lg text-white">Total</span>
                  <span className="font-bold text-2xl text-emerald-400">
                    ₹{bookingSummary.total.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-800/50 mb-8 text-center text-slate-500 flex flex-col items-center gap-2">
                <Info size={24} />
                <p>
                  Select valid check-in and check-out dates to see the total price.
                </p>
              </div>
            )}

            <button
              disabled={!bookingSummary || submitting}
              className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2
                ${
                  bookingSummary && !submitting
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-[1.02] shadow-emerald-900/20"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Processing...
                </>
              ) : (
                "Confirm & Pay"
              )}
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">
              You won't be charged yet
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};


// Reusable Guest Stepper Component
const GuestCounter = ({ label, subLabel, value, onChange, min }: any) => (
  <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-xs text-slate-500">{subLabel}</p>
    </div>
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={value <= min}
      >
        <Minus size={16} />
      </button>
      <span className="w-8 text-center font-bold text-lg">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
      >
        <Plus size={16} />
      </button>
    </div>
  </div>
);

export default Booking;