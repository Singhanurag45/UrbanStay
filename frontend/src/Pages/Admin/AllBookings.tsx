import { useEffect, useState } from "react";
import { getALLBookings } from "../../api/bookingApi";

import {
  MapPin,
  CreditCard,
  Loader2,
  User,
} from "lucide-react";

type BookingType = {
  _id: string;
  hotelId: {
    _id: string;
    name: string;
    city: string;
    country: string;
  };
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  };
  checkIn: string;
  checkOut: string;
  totalCost: number;
  status: string;
};

const MyBookings = () => {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await  getALLBookings();
        setBookings(res);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          All <span className="text-emerald-400">Bookings</span>
        </h1>
        <p className="text-slate-400 mt-1">
          View all your confirmed reservations
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 size={32} className="animate-spin text-emerald-400" />
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left">
              <thead className="bg-slate-950/50 border-b border-slate-800">
                <tr className="text-slate-400 text-sm uppercase">
                  <th className="p-6">Hotel</th>
                  <th className="p-6">Guest</th>
                  <th className="p-6">Dates</th>
                  <th className="p-6">Amount</th>
                  <th className="p-6 text-right">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-slate-800/40 transition"
                  >
                    {/* Hotel */}
                    <td className="p-6">
                      <div className="text-white font-semibold text-lg">
                        {booking.hotelId?.name}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                        <MapPin size={14} />
                        {booking.hotelId?.city},{" "}
                        {booking.hotelId?.country}
                      </div>
                    </td>

                    {/* Guest */}
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-white">
                        <User size={16} className="text-emerald-400" />
                        {booking.userId?.firstName}{" "}
                        {booking.userId?.lastName}
                      </div>
                      <div className="text-xs text-slate-500 ml-6 mt-1">
                        {booking.userId?.email}
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="p-6 text-sm text-slate-300">
                      <div>
                        <span className="text-slate-500 text-xs">
                          Check-in:
                        </span>{" "}
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs">
                          Check-out:
                        </span>{" "}
                        <span className="text-emerald-400">
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-white font-bold">
                        <CreditCard
                          size={18}
                          className="text-emerald-500"
                        />
                        ₹{booking.totalCost.toLocaleString()}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-6 text-right">
                      <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {bookings.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                No bookings found.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyBookings;
