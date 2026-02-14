import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

import {
  Loader2,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  Minus,
  Plus,
  CreditCard,
  AlertCircle,
  Users,
} from "lucide-react";
import { createPaymentOrder } from "../api/paymentApi";

/* ================= TYPES ================= */
type HotelType = {
  _id: string;
  name: string;
  city: string;
  country: string;
  pricePerNight: number;
  imageUrls: string[];
  starRating: number;
  description: string;
  facilities: string[];
};

type BookedRange = {
  checkIn: string;
  checkOut: string;
};

const Booking = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [hotel, setHotel] = useState<HotelType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [bookedDates, setBookedDates] = useState<BookedRange[]>([]);

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please login to book a hotel");
      navigate("/login", {
        replace: true,
        state: { from: `/hotel/${hotelId}/booking` },
      });
    }
  }, [isLoggedIn, hotelId, navigate]);

  /* ================= FETCH HOTEL ================= */
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await api.get(`/hotels/${hotelId}`);
        // console.log("Hotel Data:", res.data);
        setHotel(res.data);
      } catch {
        toast.error("Failed to load hotel details");
      } finally {
        setLoading(false);
      }
    };
    if (hotelId) fetchHotel();
  }, [hotelId]);

  /* ================= FETCH BOOKED DATES ================= */
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await api.get(`/hotels/${hotelId}/booked-dates`);
        setBookedDates(res.data);
      } catch {
        toast.error("Failed to load booked dates");
      }
    };
    if (hotelId) fetchBookedDates();
  }, [hotelId]);

  /* ================= DATE DISABLE LOGIC ================= */
  const isDateBooked = (date: Date) =>
    bookedDates.some(({ checkIn, checkOut }) => {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      return date >= start && date < end;
    });

  /* ================= PRICE CALCULATION ================= */
  const bookingSummary = useMemo(() => {
    if (!checkIn || !checkOut || !hotel) return null;

    const nights =
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

    if (nights <= 0) return null;

    const basePrice = nights * hotel.pricePerNight;
    const tax = Math.round(basePrice * 0.12);
    const serviceFee = 500;

    return {
      nights,
      basePrice,
      tax,
      serviceFee,
      total: basePrice + tax + serviceFee,
    };
  }, [checkIn, checkOut, hotel]);

  // Lazy-load Cashfree.js and open checkout
  const startPayment = async (paymentSessionId: string) => {
    const ensureCashfree = () =>
      new Promise<any>((resolve, reject) => {
        // Reuse instance if already created
        if ((window as any).cashfreeInstance) {
          resolve((window as any).cashfreeInstance);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.async = true;
        script.onload = () => {
          const CashfreeGlobal = (window as any).Cashfree;
          if (!CashfreeGlobal) {
            reject(new Error("Cashfree SDK failed to load"));
            return;
          }
          const instance = CashfreeGlobal({ mode: "sandbox" }); // or "production"
          (window as any).cashfreeInstance = instance;
          resolve(instance);
        };
        script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
        document.body.appendChild(script);
      });

    const cashfree = await ensureCashfree();

    await cashfree.checkout({
      paymentSessionId,
      returnUrl: `${window.location.origin}/payment-status?order_id={order_id}`,
    });
  };
  /* ================= SUBMIT (CREATE ORDER + OPEN CHECKOUT) ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingSummary || !checkIn || !checkOut || !hotelId) return;
    if (checkOut.getTime() - checkIn.getTime() > 30 * 24 * 60 * 60 * 1000) {
      alert("Stay duration cannot be more than 30 days");
      return null;
    }

    setSubmitting(true);
    try {
      const res = await createPaymentOrder({
        hotelId,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        adultCount,
        childCount,
      });

      await startPayment(res.paymentSessionId);
      // After redirect, Cashfree will take user to /payment-status,
      // which will confirm the payment and create the booking.
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to start payment. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-emerald-400" size={40} />
      </div>
    );

  if (!hotel)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <AlertCircle size={48} className="text-red-500" />
        <p className="mt-4">Hotel not found</p>
      </div>
    );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-6 text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ================= LEFT CARD ================= */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* Image Section */}
            <div className="relative">
              <img
                src={hotel.imageUrls?.[0]}
                alt={hotel.name}
                className="h-64 w-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold">{hotel.starRating}</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-extrabold tracking-tight mb-1">
                  {hotel.name}
                </h2>
                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <MapPin size={14} className="text-emerald-400" />
                  {hotel.city}, {hotel.country}
                </div>
              </div>

              {/* Improved Description with Clamp */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  About this hotel
                </h3>
                <p
                  className="text-slate-400 text-sm leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-pointer"
                  title="Click to expand"
                >
                  {hotel.description}
                </p>
              </div>

              {/* Facilities Grid */}
              <div className="mb-6 pt-6 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                  Key Facilities
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {hotel.facilities.slice(0, 6).map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-emerald-400 shrink-0"
                      />
                      <span className="truncate">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3 text-xs font-medium text-emerald-400/90 bg-emerald-400/5 p-3 rounded-xl">
                  <CheckCircle2 size={16} />
                  Free Cancellation until 24h before
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-blue-400/90 bg-blue-400/5 p-3 rounded-xl">
                  <CheckCircle2 size={16} />
                  Instant Confirmation & E-Receipt
                </div>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-linear-to-br from-emerald-500/10 to-blue-500/5 border border-emerald-500/20 p-5 rounded-2xl flex gap-4 items-center">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <ShieldCheck className="text-emerald-400" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">
                Payment Protected
              </h4>
              <p className="text-[11px] text-slate-400 leading-tight">
                Your transaction is secured with 256-bit encryption.
              </p>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex gap-3">
            <ShieldCheck className="text-emerald-400" />
            <div>
              <h4 className="font-bold text-emerald-400">Secure Booking</h4>
              <p className="text-xs text-slate-400">
                Your payment information is encrypted.
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT FORM ================= */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 p-8 rounded-2xl border border-slate-800"
          >
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <CreditCard className="text-emerald-400" /> Confirm Booking
            </h1>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <DatePicker
                selected={checkIn}
                onChange={(date: any) => setCheckIn(date)}
                filterDate={(date) => !isDateBooked(date)}
                minDate={new Date()}
                placeholderText="Check-in"
                className="w-full p-3 rounded bg-slate-950 border border-slate-700"
              />
              <DatePicker
                selected={checkOut}
                onChange={(date: any) => setCheckOut(date)}
                filterDate={(date) => !isDateBooked(date)}
                minDate={checkIn || new Date()}
                placeholderText="Check-out"
                className="w-full p-3 rounded bg-slate-950 border border-slate-700"
              />
            </div>

            {/* Guests */}
            <div className="bg-slate-950 p-6 rounded-xl mb-6">
              <h3 className="flex items-center gap-2 font-semibold mb-4">
                <Users /> Guests
              </h3>

              <div className="space-y-4">
                {/* Adults */}
                <div className="flex justify-between items-center">
                  <span>Adults</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                      className="p-2 bg-slate-800 rounded"
                    >
                      <Minus size={16} />
                    </button>
                    <span>{adultCount}</span>
                    <button
                      type="button"
                      onClick={() => setAdultCount(adultCount + 1)}
                      className="p-2 bg-slate-800 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex justify-between items-center">
                  <span>Children</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setChildCount(Math.max(0, childCount - 1))}
                      className="p-2 bg-slate-800 rounded"
                    >
                      <Minus size={16} />
                    </button>
                    <span>{childCount}</span>
                    <button
                      type="button"
                      onClick={() => setChildCount(childCount + 1)}
                      className="p-2 bg-slate-800 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            {bookingSummary && (
              <div className="bg-slate-950 p-6 rounded-xl mb-6">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span className="text-emerald-400 font-bold text-xl">
                    ₹{bookingSummary.basePrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span className="text-emerald-400 font-bold text-xl">
                    ₹{bookingSummary.serviceFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="text-emerald-400 font-bold text-xl">
                    ₹{bookingSummary.tax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-emerald-400 font-bold text-xl">
                    ₹{bookingSummary.total.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <button
              disabled={!bookingSummary || submitting}
              className="w-full py-4 bg-emerald-500 rounded-xl font-bold disabled:bg-slate-800"
            >
              {submitting ? "Processing..." : "Confirm & Pay"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
