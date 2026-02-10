import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Users as UsersIcon,
  Building,
} from "lucide-react";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex font-sans pt-24">
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-emerald-400 tracking-wide flex items-center gap-2">
            <Building className="w-8 h-8" />
            Admin<span className="text-white">Panel</span>
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-3">
          <SidebarItem to="/admin/dashboard" icon={<LayoutDashboard size={24} />} label="Dashboard" />
          <SidebarItem to="/admin/manage-hotels" icon={<Building2 size={24} />} label="Manage Hotels" />
          <SidebarItem to="/admin/bookings" icon={<CalendarCheck size={24} />} label="Bookings" />
          <SidebarItem to="/admin/users" icon={<UsersIcon size={24} />} label="Users" />
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, to }: { icon: any; label: string; to: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-4 px-6 py-4 rounded-xl cursor-pointer transition-all duration-300 ${
        isActive
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent"
      }`
    }
  >
    {icon}
    <span className="text-lg font-medium">{label}</span>
  </NavLink>
);

export default AdminLayout;