import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Users as UsersIcon,
  Building,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To check current URL

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex font-sans pt-24">
      {/* --- SIDEBAR (Written Once) --- */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-emerald-400 tracking-wide flex items-center gap-2">
            <Building className="w-8 h-8" />
            Admin<span className="text-white">Panel</span>
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-3">
          <SidebarItem 
            icon={<LayoutDashboard size={24} />} 
            label="Dashboard" 
            isActive={location.pathname === "/admin/dashboard"}
            onClick={() => handleNavigation("/admin/dashboard")} 
          />
          <SidebarItem 
            icon={<Building2 size={24} />} 
            label="Manage Hotels" 
            isActive={location.pathname === "/admin/manage-hotels"}
            onClick={() => handleNavigation("/admin/manage-hotels")} 
          />
          <SidebarItem 
            icon={<CalendarCheck size={24} />} 
            label="Bookings" 
            isActive={location.pathname === "/admin/bookings"}
            onClick={() => handleNavigation("/admin/bookings")} 
          />
          <SidebarItem 
            icon={<UsersIcon size={24} />} 
            label="Users" 
            isActive={location.pathname === "/admin/users"}
            onClick={() => handleNavigation("/admin/users")} 
          />
        </nav>

        
      </aside>

      {/* --- DYNAMIC PAGE CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> {/* This renders Users, Bookings, or Dashboard automatically */}
      </main>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, isActive, onClick }: any) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-4 rounded-xl cursor-pointer transition-all duration-300 ${
      isActive
        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`}
  >
    {icon}
    <span className="text-lg font-medium">{label}</span>
  </div>
);

export default AdminLayout;