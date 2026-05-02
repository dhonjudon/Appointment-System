import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  User,
  ShieldPlus,
  LogOut,
} from "lucide-react";
import { clearAdminSession } from "../utils/adminAuth";

const Sidebar = ({ activeTab, setActiveTab, isAdmin = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login", { replace: true });
  };

  const handleNavigation = (path) => {
    if (isAdmin) {
      navigate(path);
    } else {
      setActiveTab(path);
    }
  };

  const mainLinks = isAdmin
    ? [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/admin/dashboard",
        },
        {
          id: "users",
          label: "Users",
          icon: Users,
          badge: 12,
          path: "/admin/users",
        },
        {
          id: "appointments",
          label: "Appointments",
          icon: Calendar,
          path: "/admin/appointments",
        },
      ]
    : [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "users", label: "Users", icon: Users, badge: 12 },
        { id: "appointments", label: "Appointments", icon: Calendar },
      ];

  const systemLinks = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="w-64  bg-black border-r border-gray-100   text-black   flex flex-col h-screen fixed top-0 left-0">
      {/* Logo Area */}
      <div className="p-6 flex items-center justify-start">
        <img
          src="/logoimage.png"
          alt="Swastha Sewa Logo"
          className="h-16 w-auto object-contain mix-blend-screen"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/150x50?text=Logo+Here";
          }}
        />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-6">
        {/* Main Section */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-3 px-2">
            Main
          </p>
          <div className="flex flex-col gap-1">
            {mainLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavigation(link.path || link.id)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-brand-teal text-white"
                      : "hover:bg-white/5 text-gray-600 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <link.icon
                      className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`}
                    />
                    <span className="font-medium text-sm">{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* System Section */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-3 px-2">
            System
          </p>
          <div className="flex flex-col gap-1">
            {systemLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavigation(link.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-brand-teal text-white"
                      : "hover:bg-white/5 text-gray-600 hover:text-white"
                  }`}
                >
                  <link.icon
                    className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`}
                  />
                  <span className="font-medium text-sm">{link.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <div
          onClick={() => setActiveTab("profile")}
          className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center text-white font-bold">
            SA
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium text-sm">Super Admin</h4>
            <p className="text-brand-teal text-xs">Administrator</p>
          </div>
          <span className="text-gray-400">›</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
