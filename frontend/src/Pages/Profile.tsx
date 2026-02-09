import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Settings,
  Camera,
  Edit3,
  Save,
  CreditCard,
  Star,
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for display purposes (You can replace this with real data later)
  const stats = [
    {
      label: "Bookings",
      value: "12",
      icon: <Calendar size={18} className="text-blue-400" />,
    },
    {
      label: "Reviews",
      value: "5",
      icon: <Star size={18} className="text-yellow-400" />,
    },
    {
      label: "Status",
      value: "Gold",
      icon: <Shield size={18} className="text-emerald-400" />,
    },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 pb-12">
      {/* 1. Profile Header / Banner */}
      <div className="relative">
        {/* Banner Gradient */}
        <div className="h-48 bg-linear-to-r from-emerald-900 to-slate-900 w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 to-transparent"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end -mt-16 gap-6 mb-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="h-32 w-32 rounded-full border-4 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden shadow-2xl">
                {/* Initials Placeholder if no image */}
                <span className="text-4xl font-bold text-slate-500">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </span>
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-emerald-500 rounded-full text-white hover:bg-emerald-600 transition shadow-lg opacity-0 group-hover:opacity-100">
                <Camera size={16} />
              </button>
            </div>

            {/* Name & Role */}
            <div className="flex-1 mb-2 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-3">
                {user.firstName} {user.lastName}
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-medium">
                  USER
                </span>
              </h1>
              <p className="text-slate-400 mt-1 flex items-center justify-center md:justify-start gap-2">
                <Mail size={14} /> {user.email}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                  isEditing
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
                }`}
              >
                {isEditing ? (
                  <>
                    <Save size={18} /> Save Changes
                  </>
                ) : (
                  <>
                    <Edit3 size={18} /> Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar (Stats & Navigation) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stats Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              Account Stats
            </h3>
            <div className="space-y-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg">
                      {stat.icon}
                    </div>
                    <span className="text-slate-300 font-medium">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-white">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-col gap-2">
            <TabButton
              active={activeTab === "personal"}
              onClick={() => setActiveTab("personal")}
              icon={<User size={18} />}
              label="Personal Info"
            />
            <TabButton
              active={activeTab === "security"}
              onClick={() => setActiveTab("security")}
              icon={<Shield size={18} />}
              label="Security"
            />
            <TabButton
              active={activeTab === "billing"}
              onClick={() => setActiveTab("billing")}
              icon={<CreditCard size={18} />}
              label="Billing & Payments"
            />
            <TabButton
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
              icon={<Settings size={18} />}
              label="Preferences"
            />
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 min-h-[500px]">
            {activeTab === "personal" && (
              <div className="animate-fade-in space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Personal Information
                  </h2>
                  <p className="text-slate-400">
                    Manage your personal details and address.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="First Name"
                    value={user.firstName}
                    isEditing={isEditing}
                    icon={<User size={18} />}
                  />
                  <InputField
                    label="Last Name"
                    value={user.lastName}
                    isEditing={isEditing}
                    icon={<User size={18} />}
                  />
                  <InputField
                    label="Email Address"
                    value={user.email}
                    isEditing={false}
                    icon={<Mail size={18} />}
                    disabledNote="(Cannot be changed)"
                  />
                  <InputField
                    label="Phone Number"
                    value="+91 98765 43210"
                    isEditing={isEditing}
                    icon={<Phone size={18} />}
                  />
                  <InputField
                    label="Location"
                    value="New Delhi, India"
                    isEditing={isEditing}
                    icon={<MapPin size={18} />}
                  />
                  <InputField
                    label="Date of Birth"
                    value="01 Jan 1999"
                    isEditing={isEditing}
                    icon={<Calendar size={18} />}
                  />
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-2xl font-bold text-white">
                  Security Settings
                </h2>
                <div className="p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-xl text-yellow-200">
                  <p>Password changes require email verification.</p>
                </div>
                {/* Mock Fields */}
                <div className="grid gap-6 max-w-lg">
                  <InputField
                    label="Current Password"
                    value="••••••••"
                    isEditing={true}
                    type="password"
                    icon={<Shield size={18} />}
                  />
                  <InputField
                    label="New Password"
                    value=""
                    isEditing={true}
                    type="password"
                    icon={<Shield size={18} />}
                  />
                  <button className="w-fit px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* Placeholders for other tabs */}
            {(activeTab === "billing" || activeTab === "settings") && (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <Settings size={48} className="mb-4 opacity-50" />
                <p>This section is under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Helper Components --- */

const TabButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
      ${
        active
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "text-slate-400 hover:text-white hover:bg-slate-800"
      }
    `}
  >
    {icon}
    {label}
  </button>
);

const InputField = ({
  label,
  value,
  isEditing,
  icon,
  disabledNote,
  type = "text",
}: any) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-300 flex justify-between">
      {label}
      {disabledNote && (
        <span className="text-slate-500 text-xs font-normal">
          {disabledNote}
        </span>
      )}
    </label>
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
       ${
         isEditing
           ? "bg-slate-950 border-slate-700 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500"
           : "bg-slate-900/50 border-transparent"
       }
    `}
    >
      <div className="text-slate-500">{icon}</div>
      <input
        type={type}
        defaultValue={value}
        readOnly={!isEditing}
        className="bg-transparent w-full outline-none text-white placeholder-slate-600"
      />
    </div>
  </div>
);

export default Profile;
