import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-64 overflow-hidden">{children}</div>
    </div>
  );
};

export default Layout;
