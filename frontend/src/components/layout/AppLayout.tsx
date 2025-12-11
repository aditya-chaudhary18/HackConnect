import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { motion } from "framer-motion";

export function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />
      
      <motion.main 
        className="pt-16 min-h-screen"
        initial={false}
        animate={{ paddingLeft: isSidebarCollapsed ? "80px" : "256px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
