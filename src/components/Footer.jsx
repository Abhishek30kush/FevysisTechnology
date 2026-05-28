import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  const handleNavClick = (elementId) => {
    const el = document.getElementById(elementId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="flex flex-col space-y-4">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-wider font-outfit">
            <img
              src="/logo.jpg"
              className="w-8 h-8 rounded-lg object-cover border border-white/10"
              alt="Fevysis Technology Logo"
            />
            <span className="text-white">
              Fevysis Technology<span className="text-cyan-400">.</span>
            </span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed font-light">
            We engineer standard-setting digital solutions for progressive brands and enterprises. Your core technology partner for high-impact growth.
          </p>
        </div>

        {/* Services Links */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
            Expertise
          </h4>
          <ul className="space-y-3">
            {["Custom Web Engineering", "iOS & Android Apps", "SEO & Optimization", "Enterprise Cloud & DevOps", "Premium UI/UX Design"].map((item) => (
              <li key={item}>
                <button
                  onClick={() => handleNavClick("services")}
                  className="text-sm text-slate-400 hover:text-cyan-400 transition-colors text-left font-light"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
            Navigation
          </h4>
          <ul className="space-y-3">
            {[
              { label: "Home", id: "hero" },
              { label: "Our Services", id: "services" },
              { label: "Our Process", id: "process" },
              { label: "Portfolio", id: "portfolio" },
              { label: "Success Stories", id: "testimonials" },
            ].map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => handleNavClick(link.id)}
                  className="text-sm text-slate-400 hover:text-cyan-400 transition-colors font-light"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
            Get In Touch
          </h4>
          <div className="space-y-3">
            <a
              href="mailto:rishipandey8991@gmail.com"
              className="flex items-center gap-3 text-sm text-slate-400 hover:text-cyan-400 transition-colors font-light"
            >
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              rishipandey8991@gmail.com
            </a>
            <a
              href="tel:+917002154255"
              className="flex items-center gap-3 text-sm text-slate-400 hover:text-cyan-400 transition-colors font-light"
            >
              <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
              +91 70021 54255
            </a>
            <div className="flex items-start gap-3 text-sm text-slate-400 font-light">
              <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <span>Signature Global Millennia 1,<br />Sector 37D, Gurugram,<br />Haryana 122006</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-500 font-light">
          &copy; {new Date().getFullYear()} Fevysis Technology Private Limited. All rights reserved.
        </p>
        <div className="flex space-x-6 text-xs text-slate-500 font-light">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
