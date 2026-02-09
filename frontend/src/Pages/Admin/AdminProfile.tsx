import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Mail,
  Shield,
  Key,
  Activity,
  Lock,
  Save,
  Edit3,
  Server,
  Database,
  FileText,
} from "lucide-react";

const AdminProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);

  // Mock Admin Stats
  const adminStats = [
    {
      label: "Admin Level",
      value: "Super Admin",
      icon: <Shield size={18} className="text-emerald-400" />,
    },
    {
      label: "System Uptime",
      value: "99.9%",
      icon: <Server size={18} className="text-blue-400" />,
    },
    {
      label: "Actions Logged",
      value: "1,240",
      icon: <Activity size={18} className="text-purple-400" />,
    },
  ];

  // Mock Activity Log
  const activityLog = [
    {
      action: "Updated Hotel Details",
      target: "Grand Luxury Palace",
      time: "2 mins ago",
    },
    { action: "Deleted User", target: "user_12345", time: "1 hour ago" },
    { action: "System Backup", target: "Database", time: "5 hours ago" },
    { action: "Approved Booking", target: "BK-998877", time: "1 day ago" },
  ];

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-6 font-sans">
      {/* 1. Header / Banner */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="relative h-48 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800">
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500 via-slate-900 to-slate-950"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

          <div className="absolute bottom-0 left-0 w-full p-8 flex items-end gap-6 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent">
            <div className="h-24 w-24 rounded-2xl bg-slate-800 border-4 border-slate-950 flex items-center justify-center text-emerald-400 shadow-2xl">
              <Shield size={40} />
            </div>
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                {user.firstName} {user.lastName}
                <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                  Admin
                </span>
              </h1>
              <p className="text-slate-400 flex items-center gap-2 text-sm mt-1">
                <Mail size={14} /> {user.email}
              </p>
            </div>

            <div className="ml-auto mb-2 hidden md:block">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all ${
                  isEditing
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-800 border border-slate-700 hover:bg-slate-700"
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

      {/* 2. Content Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <div className="space-y-6">
          {/* Stats Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              System Overview
            </h3>
            <div className="space-y-3">
              {adminStats.map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    {stat.icon}
                    <span className="text-sm text-slate-300">{stat.label}</span>
                  </div>
                  <span className="font-bold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <NavButton
              active={activeTab === "details"}
              onClick={() => setActiveTab("details")}
              icon={<User size={18} />}
              label="Admin Details"
            />
            <NavButton
              active={activeTab === "security"}
              onClick={() => setActiveTab("security")}
              icon={<Lock size={18} />}
              label="Security & Access"
            />
            <NavButton
              active={activeTab === "activity"}
              onClick={() => setActiveTab("activity")}
              icon={<Activity size={18} />}
              label="Activity Logs"
            />
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-8 min-h-125">
          {/* Tab: Details */}
          {activeTab === "details" && (
            <div className="animate-fade-in space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Profile Information
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Update your administrative contact details.
                  </p>
                </div>
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
                  note="Contact Super Admin to change"
                />
                <InputField
                  label="Role"
                  value="Administrator"
                  isEditing={false}
                  icon={<Shield size={18} />}
                />
                <InputField
                  label="Employee ID"
                  value="ADM-8821"
                  isEditing={false}
                  icon={<Key size={18} />}
                />
                <InputField
                  label="Department"
                  value="IT / Engineering"
                  isEditing={isEditing}
                  icon={<Database size={18} />}
                />
              </div>
            </div>
          )}

          {/* Tab: Security */}
          {activeTab === "security" && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-white">
                Security & Permissions
              </h2>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                  <Shield size={18} /> Current Privileges
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {[
                    "Read Users",
                    "Write Hotels",
                    "Delete Bookings",
                    "View Analytics",
                    "Manage APIs",
                  ].map((perm) => (
                    <span
                      key={perm}
                      className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Password Management
                </h3>
                <div className="grid gap-4 max-w-md">
                  <InputField
                    label="Current Password"
                    value="••••••••"
                    isEditing={true}
                    type="password"
                    icon={<Lock size={18} />}
                  />
                  <InputField
                    label="New Password"
                    value=""
                    isEditing={true}
                    type="password"
                    icon={<Lock size={18} />}
                  />
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium w-fit transition-colors">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Activity Logs */}
          {activeTab === "activity" && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {activityLog.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
                  >
                    <div className="p-3 bg-slate-900 rounded-lg text-slate-400">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{log.action}</h4>
                      <p className="text-sm text-slate-500">{log.target}</p>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left
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
  note,
  type = "text",
}: any) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-300 flex justify-between">
      {label}
      {note && <span className="text-xs text-slate-500">{note}</span>}
    </label>
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
       ${
         isEditing
           ? "bg-slate-950 border-slate-700 focus-within:border-emerald-500"
           : "bg-slate-900/50 border-transparent opacity-80"
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

export default AdminProfile;
