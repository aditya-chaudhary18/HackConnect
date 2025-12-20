import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationPanel } from "@/components/features/NotificationPanel";
import { 
  Zap, 
  Menu, 
  X
} from "lucide-react";
import { useState } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/signup');
  const isFetching = useIsFetching() > 0;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="relative fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="relative">
              <img src="/logo.svg" alt="HackConnect Logo" className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <div className={cn(
                "absolute inset-0 blur-lg transition-all duration-300",
                isFetching ? "bg-primary/50" : "bg-primary/30 group-hover:bg-primary/50"
              )} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Hack<span className="text-primary">Connect</span>
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <NotificationPanel />
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="interactive-scale"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
