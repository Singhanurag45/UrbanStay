import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UserCircle,
  Home,
  Calendar,
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  LogIn,
  UserPlus,
} from "lucide-react";
import logoImage from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout, isLoading } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* ---------------- Scroll Effect ---------------- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- Handlers ---------------- */
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const profilePath = user?.role === "admin" ? "/admin/profile" : "/profile";

  /* ---------------- Render ---------------- */
  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/5
        ${
          scrolled
            ? "bg-slate-950/90 backdrop-blur-md py-3 shadow-xl"
            : "bg-transparent py-5"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LOGO */}
        <div
          onClick={() => handleNavigation("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
            <img
              src={logoImage}
              alt="UrbanStay Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/5 backdrop-blur-sm">
          <NavItem
            icon={<Home size={18} />}
            label="Home"
            active={isActive("/")}
            onClick={() => handleNavigation("/")}
          />
          <NavItem
            icon={<Building2 size={18} />}
            label="Hotels"
            active={isActive("/hotels")}
            onClick={() => handleNavigation("/hotels")}
          />

          {isLoggedIn && user?.role !== "admin" && (
            <NavItem
              icon={<Calendar size={18} />}
              label="My Bookings"
              active={isActive("/my-bookings")}
              onClick={() => handleNavigation("/my-bookings")}
            />
          )}

          {isLoggedIn && user?.role === "admin" && (
            <NavItem
              icon={<LayoutDashboard size={18} />}
              label="Admin Panel"
              active={isActive("/admin/dashboard")}
              onClick={() => handleNavigation("/admin/dashboard")}
            />
          )}
        </div>

        {/* DESKTOP AUTH */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoading && isLoggedIn && user ? (
            <div className="flex items-center gap-3">
              {/* Profile */}
              <button
                onClick={() => handleNavigation(profilePath)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all group"
              >
                <div className="bg-emerald-500/20 p-1.5 rounded-full text-emerald-400 group-hover:scale-110 transition-transform">
                  <UserCircle size={20} />
                </div>
                <div className="text-left leading-none">
                  <p className="text-sm font-medium text-white">
                    {user.firstName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {user.role}
                  </p>
                </div>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleNavigation("/login")}
                className="flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <LogIn size={18} /> Login
              </button>
              <button
                onClick={() => handleNavigation("/register")}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium"
              >
                <UserPlus size={18} /> Register
              </button>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950 border-b border-slate-800 p-6 flex flex-col gap-4 shadow-2xl">
          <MobileNavItem
            icon={<Home size={20} />}
            label="Home"
            onClick={() => handleNavigation("/")}
          />
          <MobileNavItem
            icon={<Building2 size={20} />}
            label="Hotels"
            onClick={() => handleNavigation("/hotels")}
          />

          {isLoggedIn && user && (
            <>
              {user.role !== "admin" && (
                <MobileNavItem
                  icon={<Calendar size={20} />}
                  label="My Bookings"
                  onClick={() => handleNavigation("/my-bookings")}
                />
              )}

              {user.role === "admin" && (
                <MobileNavItem
                  icon={<LayoutDashboard size={20} />}
                  label="Dashboard"
                  onClick={() => handleNavigation("/admin/dashboard")}
                />
              )}

              <div className="h-px bg-slate-800 my-2" />

              {/* PROFILE (ROLE BASED) */}
              <MobileNavItem
                icon={<UserCircle size={20} />}
                label="My Profile"
                onClick={() => handleNavigation(profilePath)}
              />

              <button
                onClick={handleLogout}
                className="flex items-center gap-4 p-3 rounded-xl text-red-400 hover:bg-red-500/10 font-medium"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          )}

          {!isLoggedIn && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleNavigation("/login")}
                className="py-3 rounded-xl bg-slate-800 text-white font-medium"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigation("/register")}
                className="py-3 rounded-xl bg-emerald-500 text-white font-medium"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

/* ---------------- Helper Components ---------------- */

const NavItem = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
      ${
        active
          ? "bg-emerald-500 text-white shadow-lg"
          : "text-slate-400 hover:text-white hover:bg-white/10"
      }
    `}
  >
    {icon}
    {label}
  </button>
);

const MobileNavItem = ({
  icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 p-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 font-medium text-left"
  >
    {icon}
    {label}
  </button>
);

export default Navbar;
