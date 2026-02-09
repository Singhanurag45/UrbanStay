import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Mail,
  Shield,
  Loader2,
  Search,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "react-toastify"; // Optional: for nice notifications

type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
};

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/users?page=${page}&limit=10&search=${debouncedSearch}`
      );
      setUsers(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]);

  // --- DELETE FUNCTION ---
  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) {
      try {
        await api.delete(`/users/${userId}`);
        toast.success("User deleted successfully");
        // Refresh list
        fetchUsers(); 
      } catch (error) {
        toast.error("Failed to delete user");
        console.error(error);
      }
    }
  };

  // --- HELPER: Format Date Safely ---
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            User <span className="text-emerald-400">Management</span>
          </h1>
          <p className="text-slate-400">
            Page {page} of {totalPages} • Total Results: {users.length}
          </p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center gap-2 w-full md:w-auto focus-within:border-emerald-500/50 transition-colors">
          <Search className="text-slate-500 ml-2" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="bg-transparent text-white p-2 focus:outline-none placeholder:text-slate-600 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="animate-spin text-emerald-400" size={32} />
        </div>
      ) : (
        <>
          {/* Users Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-sm uppercase tracking-wider">
                    <th className="p-6 font-medium">User Profile</th>
                    <th className="p-6 font-medium">Role</th>
                    <th className="p-6 font-medium">Status</th>
                    <th className="p-6 font-medium">Join Date</th>
                    <th className="p-6 font-medium text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border 
                            ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                            {user.firstName?.charAt(0) || "?"}{user.lastName?.charAt(0) || "?"}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                              {user.firstName} {user.lastName}
                            </h4>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Mail size={12} /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          user.role === "admin"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-slate-800 text-slate-300 border-slate-700"
                        }`}>
                          {user.role === "admin" && <Shield size={10} />}
                          {user.role}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-sm text-white">
                           <CheckCircle2 size={16} className="text-emerald-500" /> Active
                        </div>
                      </td>
                      <td className="p-6 text-slate-400 text-sm">
                        {/* Fixed Date Display */}
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="p-6 text-right">
                        {/* Delete Button */}
                        {user.role !== "admin" ? (
                           <button 
                             onClick={() => handleDelete(user._id)}
                             className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors group/delete"
                             title="Delete User"
                           >
                             <Trash2 size={18} className="group-hover/delete:scale-110 transition-transform" />
                           </button>
                        ) : (
                          <span className="text-xs text-slate-600 italic px-2">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="p-8 text-center text-slate-500">No users found.</div>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium text-white"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <span className="text-slate-400 text-sm">
                Page <span className="text-white font-bold">{page}</span> of {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium text-white"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;