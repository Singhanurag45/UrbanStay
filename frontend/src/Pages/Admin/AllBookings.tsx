import { useEffect, useState } from "react";
import { getALLBookings } from "../../api/bookingApi";

import { MapPin, CreditCard, Loader2, User } from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await getALLBookings(currentPage, pageSize);
        setBookings(res.data ?? []);
        setTotalPages(res.pagination?.pages ?? 1);
        setTotalBookings(res.pagination?.total ?? 0);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);
  };

  const startItem = totalBookings === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalBookings);

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 text-sm text-slate-400">
            <p>
              Showing {startItem}-{endItem} of {totalBookings} bookings
            </p>
            <p>
              Page {currentPage} of {totalPages}
            </p>
          </div>

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
                        {booking.hotelId?.city}, {booking.hotelId?.country}
                      </div>
                    </td>

                    {/* Guest */}
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-white">
                        <User size={16} className="text-emerald-400" />
                        {booking.userId?.firstName} {booking.userId?.lastName}
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
                        <CreditCard size={18} className="text-emerald-500" />₹
                        {booking.totalCost.toLocaleString()}
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

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition"
              >
                Previous
              </button>

              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-10 px-3 py-2 rounded-xl border transition ${
                      page === currentPage
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-700 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyBookings;
