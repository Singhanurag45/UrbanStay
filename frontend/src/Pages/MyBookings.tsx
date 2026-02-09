import { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { getMyBookings } from "../api/bookingApi";

type BookingType = {
  _id: string;
  checkIn: string;
  checkOut: string;
  totalCost: number;
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
      } catch (error) {
        console.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

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
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex gap-6"
          >
            <img
              src={booking.hotelId.imageUrls?.[0]}
              alt={booking.hotelId.name}
              className="w-40 h-28 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h2 className="text-xl font-bold">{booking.hotelId.name}</h2>

              <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                <MapPin size={14} />
                {booking.hotelId.city}, {booking.hotelId.country}
              </div>

              <div className="flex items-center gap-4 text-sm mt-4 text-slate-300">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(booking.checkIn).toDateString()} →{" "}
                  {new Date(booking.checkOut).toDateString()}
                </div>
              </div>

              <div className="mt-4 font-bold text-emerald-400">
                Total: ₹{booking.totalCost.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
