import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, User, LayoutDashboard, Settings } from "lucide-react";

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavClick = (elementId) => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const el = document.getElementById(elementId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-xl font-bold tracking-wider font-outfit"
        >
          <img
            src="/logo.jpg"
            className="w-8 h-8 rounded-lg object-cover shadow-lg border border-white/10"
            alt="Fevysis Technology Logo"
          />
          <span className="text-white hover:text-cyan-400 transition-colors">
            Fevysis Technology<span className="text-cyan-400">.</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => handleNavClick("services")}
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
          >
            Services
          </button>
          <button
            onClick={() => handleNavClick("process")}
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
          >
            Our Process
          </button>
          <button
            onClick={() => handleNavClick("portfolio")}
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
          >
            Portfolio
          </button>
          <button
            onClick={() => handleNavClick("testimonials")}
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
          >
            Success Stories
          </button>
          <button
            onClick={() => handleNavClick("contact")}
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
          >
            Contact
          </button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 transition-all"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Admin Console
                </Link>
              )}
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Client Workspace
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors ml-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signin"
                className="px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300"
              >
                Start Project
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-300 hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] bg-slate-950 z-40 px-6 py-8 flex flex-col space-y-6 animate-fade-in border-t border-white/5">
          <button
            onClick={() => handleNavClick("services")}
            className="text-lg font-medium text-slate-300 text-left border-b border-white/5 pb-2"
          >
            Services
          </button>
          <button
            onClick={() => handleNavClick("process")}
            className="text-lg font-medium text-slate-300 text-left border-b border-white/5 pb-2"
          >
            Our Process
          </button>
          <button
            onClick={() => handleNavClick("portfolio")}
            className="text-lg font-medium text-slate-300 text-left border-b border-white/5 pb-2"
          >
            Portfolio
          </button>
          <button
            onClick={() => handleNavClick("testimonials")}
            className="text-lg font-medium text-slate-300 text-left border-b border-white/5 pb-2"
          >
            Success Stories
          </button>
          <button
            onClick={() => handleNavClick("contact")}
            className="text-lg font-medium text-slate-300 text-left border-b border-white/5 pb-2"
          >
            Contact
          </button>

          <div className="flex flex-col space-y-4 pt-4">
            {currentUser ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center gap-2 py-3 rounded-full text-sm font-semibold tracking-wide text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    Admin Console
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center gap-2 py-3 rounded-full text-sm font-semibold tracking-wide text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Client Workspace
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex justify-center items-center gap-2 py-3 rounded-full text-sm font-semibold text-slate-400 hover:text-red-400 border border-white/5 hover:bg-white/5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="py-3 rounded-full text-sm font-semibold text-slate-300 text-center border border-white/5 hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="py-3 rounded-full text-sm font-semibold tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-center shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all"
                >
                  Start Project
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
