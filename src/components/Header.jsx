import React from "react";
import { Search, Bell, Grid } from "lucide-react";

const Header = ({ title, subtitle, showSearch = true }) => {
  return (
    <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
      {/* Left side: Title and Subtitle */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-400 font-medium">{subtitle}</p>
      </div>

      {/* Right side: Search, Icons, Profile */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        {showSearch && (
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patients, doctors..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 w-64 text-gray-600"
            />
          </div>
        )}

        {/* Action Icons */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
            <Grid className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center text-white font-bold cursor-pointer hover:bg-brand-teal/90 transition-colors">
          SA
        </div>
      </div>
    </div>
  );
};

export default Header;
