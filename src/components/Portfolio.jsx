import React, { useState } from "react";
import { ExternalLink, Code2, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Web Engineering", "Mobile Apps", "SEO & Optimization"];

  const projects = [
    {
      title: "Apex CRM Dashboard",
      category: "Web Engineering",
      description: "A secure, enterprise-level CRM engine that aggregates live telemetry, sales pipes, and client messages. Integrates dynamic SVG charts and instant messaging pathways.",
      metrics: "React, Firebase, Tailwind CSS",
      icon: <Code2 className="w-5 h-5 text-cyan-400" />
    },
    {
      title: "Lumina Financial App",
      category: "Mobile Apps",
      description: "A biometric-authenticated personal asset ledger for progressive wealth creators. Fully compliant offline caching, responsive charts, and unified multi-currency transfers.",
      metrics: "React Native, Cloud Firestore",
      icon: <ShieldAlert className="w-5 h-5 text-emerald-400" />
    },
    {
      title: "Solarize Growth Engine",
      category: "SEO & Optimization",
      description: "A technical SEO stack overhaul for a global renewable energy grid. Implements standard JSON-LD schema feeds, high-performance static rendering, and edge cached content pipelines.",
      metrics: "+380% Search Indexing / React",
      icon: <TrendingUp className="w-5 h-5 text-purple-400" />
    },
    {
      title: "Zenith Retail Engine",
      category: "Web Engineering",
      description: "High-throughput headless e-commerce store with absolute state synchrony, instant elastic indexing, and visual cart animations.",
      metrics: "Next.js, Tailwind, GraphQL",
      icon: <Code2 className="w-5 h-5 text-cyan-400" />
    },
    {
      title: "Atlas Navigation Core",
      category: "Mobile Apps",
      description: "Bespoke native mobile mapping system utilizing advanced geometry meshes and telemetry APIs for logistics standard-bearers.",
      metrics: "Swift, Kotlin, Custom APIs",
      icon: <ShieldAlert className="w-5 h-5 text-emerald-400" />
    }
  ];

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden bg-slate-950/40 border-t border-white/5">
      <div className="absolute top-[30%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-radial-glow opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Case Studies</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 font-outfit">
              Our Selected Works
            </h2>
            <p className="text-slate-400 font-light leading-relaxed">
              We design and engineer digital systems that deliver real results. View our latest premium deployments across varied technology layers.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeFilter === cat
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/10"
                    : "border border-white/5 hover:border-white/10 bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between h-[340px] relative group overflow-hidden"
            >
              {/* Highlight Background Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center">
                    {project.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-900 border border-white/5 px-2.5 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-outfit mb-3 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed font-light mb-6">
                  {project.description}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-xs font-medium text-slate-500 font-mono">
                  {project.metrics}
                </span>
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1 group-hover:text-white transition-colors cursor-pointer">
                  Case Study
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
