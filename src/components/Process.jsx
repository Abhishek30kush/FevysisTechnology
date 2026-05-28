import React from "react";
import { Compass, Layers, Terminal, Sparkles, Activity } from "lucide-react";

export default function Process() {
  const steps = [
    {
      icon: <Compass className="w-6 h-6 text-cyan-400" />,
      title: "01. Strategy & Scope",
      subtitle: "Milestone Blueprinting",
      description: "We work directly with your stakeholders to outline granular technical scopes, data models, APIs, and timeline expectations. No fluff, just exact execution blueprints."
    },
    {
      icon: <Layers className="w-6 h-6 text-emerald-400" />,
      title: "02. Premium Design",
      subtitle: "Fidelity Prototypes",
      description: "We construct bespoke component-driven UI styles and responsive grids in Figma. Every motion state and layout breakpoint is designed to match premium global aesthetics."
    },
    {
      icon: <Terminal className="w-6 h-6 text-purple-400" />,
      title: "03. Elite Engineering",
      subtitle: "Modern Code Architectures",
      description: "Our core engineering squads write structured, semantic React code supported by secure serverless databases and clean stylesheets. Built to stand up to heavy scaling."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
      title: "04. Quality Assurance",
      subtitle: "Performance Audits",
      description: "Every module undergoes performance audits, cross-browser render testing, accessibility indexing, and database read/write throughput checks to ensure zero leaks."
    },
    {
      icon: <Activity className="w-6 h-6 text-emerald-400" />,
      title: "05. Launch & Optimize",
      subtitle: "Deployment & Scaling",
      description: "We deploy onto highly available global CDNs, configure continuous pipelines, optimize caching headers, and hook up web indexing metrics for maximum growth."
    }
  ];

  return (
    <section id="process" className="py-24 relative overflow-hidden bg-slate-950">
      <div className="absolute top-[20%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-radial-glow opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Execution Framework</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 font-outfit">
            How We Deliver Excellence
          </h2>
          <p className="text-slate-400 font-light text-lg leading-relaxed">
            Our process is built on absolute transparency and meticulous coding practices. We break every project down into predictable, standard-setting stages.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[40px] left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-cyan-500/25 via-emerald-500/25 to-transparent z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-start group">
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mb-6 shadow-lg group-hover:border-cyan-500/30 group-hover:shadow-cyan-500/5 transition-all duration-300 relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {step.icon}
                </div>

                {/* Subtitle */}
                <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-2">
                  {step.subtitle}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 font-outfit">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
