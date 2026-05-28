import React from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden">
      {/* Background Glowing Circles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[35rem] h-[35rem] rounded-full bg-radial-glow animate-pulse-glow" />
        <div className="absolute bottom-[10%] right-[5%] w-[40rem] h-[40rem] rounded-full bg-radial-glow-green animate-pulse-glow" style={{ animationDelay: '4s' }} />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
            Next-Gen Product Engineering
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-8 font-outfit max-w-5xl leading-tight">
          We Engineer Standard-Setting <br />
          <span className="text-gradient-cyan">Digital Products</span> & <span className="text-gradient-emerald">Platforms</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-slate-400 font-light max-w-3xl mb-12 leading-relaxed">
          Fevysis Technology is a premier software development and product consultancy partner. We architect high-performance web systems, native mobile apps, and technical SEO platforms designed for absolute reliability and growth.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <button
            onClick={() => handleScrollTo("contact")}
            className="group px-8 py-4 rounded-full text-base font-semibold tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-300 flex items-center gap-2"
          >
            Start Your Project
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <Link
            to="/signin"
            className="px-8 py-4 rounded-full text-base font-semibold tracking-wide border border-white/10 hover:border-cyan-500/30 bg-white/5 hover:bg-white/10 text-white transition-all duration-300"
          >
            Access Client Workspace
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full max-w-5xl border-t border-white/5 pt-12">
          {[
            { value: "150+", label: "Products Engineered" },
            { value: "99.8%", label: "Client Satisfaction" },
            { value: "45+", label: "Expert In-House Devs" },
            { value: "5+ Yrs", label: "Avg Client Relationship" },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-black text-white font-outfit tracking-tight mb-2">
                <span className={idx % 2 === 0 ? "text-gradient-cyan" : "text-gradient-emerald"}>
                  {stat.value}
                </span>
              </span>
              <span className="text-xs md:text-sm text-slate-500 font-medium tracking-wide uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
