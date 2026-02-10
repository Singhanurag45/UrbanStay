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

/* ================= TYPES ================= */
type HotelType = {
  _id: string;
  name: string;
  city: string;
  country: string;
  pricePerNight: number;
  imageUrls: string[];
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

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingSummary || !checkIn || !checkOut) return;

    setSubmitting(true);
    try {
      await api.post("/bookings", {
        hotelId,
        checkIn,
        checkOut,
        adultCount,
        childCount,
        totalCost: bookingSummary.total,
      });

      toast.success("Booking confirmed!");
      navigate("/my-bookings");
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error("Hotel already booked for selected dates");
        return;
      }
      toast.error("Booking failed. Please try again.");
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
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
            <img
              src={hotel.imageUrls?.[0]}
              alt={hotel.name}
              className="h-52 w-full object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between mb-2">
                <h2 className="text-2xl font-bold">{hotel.name}</h2>
                <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span>4.8</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                <MapPin size={16} />
                {hotel.city}, {hotel.country}
              </div>

              <div className="space-y-3 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  Free Cancellation until 24h before
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  Instant Confirmation
                </div>
              </div>
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
                onChange={(date:any) => setCheckIn(date)}
                filterDate={(date) => !isDateBooked(date)}
                minDate={new Date()}
                placeholderText="Check-in"
                className="w-full p-3 rounded bg-slate-950 border border-slate-700"
              />
              <DatePicker
                selected={checkOut}
                onChange={(date:any) => setCheckOut(date)}
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
