import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  MapPin,
  Image as ImageIcon,
  Save,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";

// --- TYPES ---
type HotelType = {
  _id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageUrls: string[];
  adultCount: number;
  childCount: number;
};

// --- CONSTANTS ---
const HOTEL_TYPES = ["Budget", "Boutique", "Luxury", "Resort", "Business", "Family", "Romantic", "Cabin"];
const HOTEL_FACILITIES = ["Free WiFi", "Parking", "Airport Shuttle", "Family Rooms", "Non-Smoking Rooms", "Outdoor Pool", "Spa", "Fitness Center"];

const ManageHotels = () => {
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<HotelType | null>(null);

  // --- FETCH HOTELS ---
  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await api.get("/my-hotels");
      setHotels(response.data);
    } catch (error) {
      toast.error("Error fetching hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // --- DELETE HOTEL ---
  const handleDelete = async (hotelId: string) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;

    try {
      await api.delete(`/my-hotels/${hotelId}`);
      toast.success("Hotel deleted!");
      fetchHotels(); // Refresh list
    } catch (error) {
      toast.error("Failed to delete hotel");
    }
  };

  // --- OPEN MODAL HANDLERS ---
  const handleAddClick = () => {
    setEditingHotel(null); // Clear editing state
    setIsModalOpen(true);
  };

  const handleEditClick = (hotel: HotelType) => {
    setEditingHotel(hotel); // Set hotel to edit
    setIsModalOpen(true);
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Manage <span className="text-emerald-400">Hotels</span>
          </h1>
          <p className="text-slate-400">Add new properties or edit existing ones.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
        >
          <Plus size={20} /> Add Hotel
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="animate-spin text-emerald-400" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-6 hover:border-slate-700 transition-all"
            >
              {/* Image */}
              <div className="w-full md:w-48 h-32 bg-slate-950 rounded-xl overflow-hidden shrink-0">
                <img
                  src={hotel.imageUrls[0]}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">{hotel.name}</h3>
                    <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {hotel.city}, {hotel.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-xs text-yellow-400">
                    <Star size={12} fill="currentColor" /> {hotel.starRating}
                  </div>
                </div>

                <p className="text-slate-500 text-sm mt-3 line-clamp-2">
                  {hotel.description}
                </p>

                <div className="flex items-center gap-4 mt-4">
                   <span className="text-emerald-400 font-bold">₹{hotel.pricePerNight}<span className="text-slate-500 text-xs font-normal">/night</span></span>
                   <span className="text-slate-500 text-xs px-2 py-1 bg-slate-800 rounded border border-slate-700">{hotel.type}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-4">
                <button
                  onClick={() => handleEditClick(hotel)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg text-slate-300 text-sm transition-colors"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(hotel._id)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-slate-300 text-sm transition-colors"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}

          {hotels.length === 0 && (
            <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
               <p className="text-slate-500">No hotels found. Create your first one!</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <HotelFormModal
          hotel={editingHotel}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchHotels}
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENT: FORM MODAL ---
const HotelFormModal = ({
  hotel,
  onClose,
  onSave,
}: {
  hotel: HotelType | null;
  onClose: () => void;
  onSave: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: hotel?.name || "",
    city: hotel?.city || "",
    country: hotel?.country || "",
    description: hotel?.description || "",
    type: hotel?.type || "",
    pricePerNight: hotel?.pricePerNight || 0,
    starRating: hotel?.starRating || 3,
    facilities: hotel?.facilities || [],
    adultCount: hotel?.adultCount || 1,
    childCount: hotel?.childCount || 0,
    imageFiles: [] as File[], // New files to upload
    imageUrls: hotel?.imageUrls || [], // Existing URLs
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFacilityChange = (facility: string) => {
    setFormData((prev) => {
      const facilities = prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility];
      return { ...prev, facilities };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        imageFiles: Array.from(e.target.files as FileList),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("city", formData.city);
    data.append("country", formData.country);
    data.append("description", formData.description);
    data.append("type", formData.type);
    data.append("pricePerNight", formData.pricePerNight.toString());
    data.append("starRating", formData.starRating.toString());
    data.append("adultCount", formData.adultCount.toString());
    data.append("childCount", formData.childCount.toString());

    formData.facilities.forEach((facility, index) => {
      data.append(`facilities[${index}]`, facility);
    });

    // Append existing Image URLs (backend needs to know which old images to keep)
    // Note: Your backend update logic assumes standard file upload, 
    // usually you send imageUrls separately or handle merge in backend.
    // For this specific backend snippet provided earlier, it appends new files.
    // Ideally, pass existing URLs back if backend supports deleting specific images.
    
    // Append New Image Files
    Array.from(formData.imageFiles).forEach((imageFile) => {
      data.append("imageFiles", imageFile);
    });

    try {
      if (hotel) {
        await api.put(`/my-hotels/${hotel._id}`, data, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Hotel updated successfully");
      } else {
        await api.post("/my-hotels", data, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Hotel created successfully");
      }
      onSave(); // Refresh parent list
      onClose(); // Close modal
    } catch (error) {
      toast.error("Error saving hotel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">
            {hotel ? "Edit Hotel" : "Add New Hotel"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="hotel-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="text-sm font-bold text-slate-400">Name</span>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none" />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-bold text-slate-400">Type</span>
                <select name="type" value={formData.type} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none">
                    <option value="" disabled>Select Type</option>
                    {HOTEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="text-sm font-bold text-slate-400">City</span>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none" />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-bold text-slate-400">Country</span>
                <input type="text" name="country" value={formData.country} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none" />
              </label>
            </div>

            <label className="block space-y-1">
                <span className="text-sm font-bold text-slate-400">Description</span>
                <textarea name="description" rows={4} value={formData.description} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none" />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="text-sm font-bold text-slate-400">Price Per Night (₹)</span>
                <input type="number" name="pricePerNight" min={1} value={formData.pricePerNight} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none" />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-bold text-slate-400">Star Rating</span>
                <select name="starRating" value={formData.starRating} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none">
                    {[1,2,3,4,5].map(num => <option key={num} value={num}>{num} Stars</option>)}
                </select>
              </label>
            </div>

            {/* Facilities */}
            <div>
                <span className="text-sm font-bold text-slate-400 block mb-2">Facilities</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {HOTEL_FACILITIES.map((facility) => (
                        <label key={facility} className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2 rounded cursor-pointer hover:border-emerald-500/50">
                            <input 
                                type="checkbox" 
                                value={facility} 
                                checked={formData.facilities.includes(facility)}
                                onChange={() => handleFacilityChange(facility)}
                                className="accent-emerald-500 w-4 h-4"
                            />
                            <span className="text-sm text-slate-300">{facility}</span>
                        </label>
                    ))}
                </div>
            </div>

             {/* Guests */}
             <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                 <label className="space-y-1">
                    <span className="text-sm font-bold text-slate-400">Adults</span>
                    <input type="number" name="adultCount" min={1} value={formData.adultCount} onChange={handleInputChange} required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" />
                 </label>
                 <label className="space-y-1">
                    <span className="text-sm font-bold text-slate-400">Children</span>
                    <input type="number" name="childCount" min={0} value={formData.childCount} onChange={handleInputChange} required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" />
                 </label>
             </div>

            {/* Images */}
            <div>
                <span className="text-sm font-bold text-slate-400 block mb-2">Images</span>
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center bg-slate-950 hover:bg-slate-900 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="mx-auto text-slate-500 mb-2" size={32} />
                    <p className="text-slate-400 text-sm">Click to upload images</p>
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                </div>
                {formData.imageFiles.length > 0 && (
                     <div className="mt-2 text-sm text-emerald-400">
                        {formData.imageFiles.length} new images selected
                     </div>
                )}
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/50 rounded-b-2xl flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-300 font-bold hover:text-white transition-colors">
                Cancel
            </button>
            <button 
                form="hotel-form" 
                disabled={isLoading} 
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Save Hotel
            </button>
        </div>
      </div>
    </div>
  );
};

export default ManageHotels;