import { useEffect, useState } from "react";
import { Calendar, MapPin, XCircle } from "lucide-react";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading bookings...
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        No bookings found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 px-6 text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex justify-between gap-6"
          >
            {/* LEFT */}
            <div className="flex gap-4">
              <img
                src={booking.hotelId.imageUrls?.[0]}
                alt={booking.hotelId.name}
                className="w-32 h-24 object-cover rounded-xl"
              />

              <div>
                <h3 className="font-bold text-lg">
                  {booking.hotelId.name}
                </h3>

                <p className="text-sm text-slate-400 flex items-center gap-1">
                  <MapPin size={14} />
                  {booking.hotelId.city}, {booking.hotelId.country}
                </p>

                <p className="text-sm mt-2 flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(booking.checkIn).toDateString()} →{" "}
                  {new Date(booking.checkOut).toDateString()}
                </p>

                <p className="mt-2 font-bold text-emerald-400">
                  ₹{booking.totalCost.toLocaleString()}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right space-y-3">
              <span
                className={`text-sm font-semibold ${
                  booking.status === "cancelled"
                    ? "text-red-400"
                    : "text-emerald-400"
                }`}
              >
                {booking.status.toUpperCase()}
              </span>

              {booking.status === "confirmed" &&
                new Date(booking.checkIn) > new Date() && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
                  >
                    <XCircle size={16} />
                    Cancel Booking
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
