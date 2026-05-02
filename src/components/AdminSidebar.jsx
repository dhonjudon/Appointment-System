import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Settings,
  UserCircle,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import logoImg from "../assets/logoimage.png";
import { clearAdminSession } from "../utils/adminAuth";

const NAV_ITEMS = [
  { label: "Dashboard", Icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Users", Icon: Users, to: "/admin/users" },
  { label: "Appointments", Icon: CalendarDays, to: "/admin/appointments" },
//   { label: "Settings", Icon: Settings, to: "/admin/settings" },
  { label: "Profile", Icon: UserCircle, to: "/admin/profile" },
];

function AdminSidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    window.location.assign("/admin/login");
  };

  return (
    <aside
      className="shrink-0 bg-white border-r border-gray-100 h-screen flex flex-col shadow-sm transition-all duration-300 overflow-hidden"
      style={{ width: open ? "260px" : "60px" }}
    >
      <div
        className={`flex items-center h-16 border-b border-gray-50 px-4 shrink-0 ${
          open ? "justify-between" : "justify-center"
        }`}
      >
        {open ? (
          <img
            src={logoImg}
            alt="Swastha Sewa Logo"
            className="h-10 md:h-[3.8rem]"
          />
        ) : (
          <div className="w-8" />
        )}
        <button
          onClick={() => setOpen(!open)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition shrink-0"
        >
          {open ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, Icon, to }) => {
          const active = location.pathname === to;

          return (
            <Link
              key={to}
              to={to}
              title={!open ? label : undefined}
              className={`flex items-center gap-3 rounded-xl transition-all duration-150 group relative ${
                open ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"
              } ${
                active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Icon
                className={`shrink-0 ${open ? "w-4 h-4" : "w-5 h-5"} ${
                  active
                    ? "text-emerald-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              {open && (
                <span className="text-sm font-semibold truncate">{label}</span>
              )}
              {open && active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
              {!open && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {open ? (
        <div className="px-3 pb-4 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-[#1b6a55] flex items-center justify-center text-white font-extrabold text-sm">
              SA
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">
                Super Admin
              </p>
              <p className="text-[10px] text-emerald-600 font-medium">
                Administrator
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      ) : (
        <div className="px-2 pb-4 shrink-0 flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1b6a55] flex items-center justify-center text-white font-extrabold text-xs">
            SA
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-8 h-8 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
}

export default AdminSidebar;
