import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, XCircle, Hotel } from "lucide-react";
import { getMyBookings, cancelBooking } from "../api/bookingApi";
import { toast } from "react-toastify";

type BookingType = {
  _id: string;
  checkIn: string;
  checkOut: string;
  totalCost: number;
  status: "confirmed" | "cancelled";
  hotelId: {
    name: string;
    city: string;
    country: string;
    imageUrls: string[];
  };
};

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch {
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");

      setBookings(prev =>
        prev.map(b =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  /* --- LOADING STATE --- */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Fetching your trips...</p>
        </div>
      </div>
    );
  }

  /* --- EMPTY STATE --- */
  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-full mb-6 shadow-2xl">
            <Hotel size={64} className="text-slate-600" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">No Bookings Yet</h2>
          <p className="text-slate-400 max-w-sm mb-8 text-lg">
            Your itinerary is looking a bit empty! Discover amazing stays and start planning your next adventure.
          </p>

          <button
            onClick={() => navigate("/hotels")}
            className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
          >
            Explore Hotels
          </button>
        </div>
      </div>
    );
  }

  /* --- MAIN CONTENT --- */
  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-12 px-6 text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold">My Bookings</h1>
          <p className="text-slate-400">View and manage your upcoming and past reservations.</p>
        </header>

        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-6 hover:border-slate-700 transition-colors shadow-sm"
            >
              {/* LEFT: Hotel Info */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative shrink-0">
                  <img
                    src={booking.hotelId.imageUrls?.[0]}
                    alt={booking.hotelId.name}
                    className="w-full md:w-48 h-32 object-cover rounded-xl border border-slate-800"
                  />
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {booking.status}
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-xl text-white mb-1">
                    {booking.hotelId.name}
                  </h3>

                  <div className="space-y-1.5">
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <MapPin size={16} className="text-emerald-500" />
                      {booking.hotelId.city}, {booking.hotelId.country}
                    </p>

                    <p className="text-sm text-slate-300 flex items-center gap-2">
                      <Calendar size={16} className="text-emerald-500" />
                      {new Date(booking.checkIn).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} 
                      <span className="text-slate-500 mx-1">→</span> 
                      {new Date(booking.checkOut).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <p className="mt-4 font-bold text-xl text-emerald-400">
                    ₹{booking.totalCost.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* RIGHT: Actions */}
              <div className="flex flex-row md:flex-col justify-between md:justify-center items-end gap-3 border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                <div className="text-right hidden md:block">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Status</p>
                  <span className={`text-sm font-bold ${
                    booking.status === "cancelled" ? "text-red-400" : "text-emerald-400"
                  }`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                {booking.status === "confirmed" && new Date(booking.checkIn) > new Date() && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-all group"
                  >
                    <XCircle size={18} className="group-hover:rotate-90 transition-transform" />
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;