import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="PneumoScan Logo" 
              className="h-12 w-12 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <span className="font-bold text-xl text-foreground">PneumoScan</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/upload" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/upload') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Upload
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/about') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              About
            </Link>
            <Link 
              to="/history" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/history') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              History
            </Link>
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Login
                </Button>
              </Link>
            )}
            
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
