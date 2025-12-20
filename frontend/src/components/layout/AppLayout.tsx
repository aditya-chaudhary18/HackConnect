import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useIsFetching } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const isFetching = useIsFetching() > 0;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global loading bar - fixed at top, above everything */}
      <div className={cn(
        "fixed top-0 left-0 right-0 h-1.5 z-[9999] transition-opacity duration-300",
        isFetching ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />
      </div>
      
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
