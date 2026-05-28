import React from "react";
import { Code, Smartphone, Search, Cloud, Palette, ArrowRight } from "lucide-react";

export default function Services() {
  const servicesList = [
    {
      icon: <Code className="w-8 h-8 text-cyan-400" />,
      title: "Custom Web Engineering",
      description: "We architect ultra-fast, robust web architectures using React, state-managed systems, and modular microservices. Optimized for security, scale, and high-concurrency client demands.",
      tags: ["React & Next.js", "State Engine", "Headless CMS"]
    },
    {
      icon: <Smartphone className="w-8 h-8 text-emerald-400" />,
      title: "Native Mobile Apps",
      description: "Elite cross-platform and native engineering for iOS and Android. High-performance, offline-first sync architecture, responsive layouts, and standard-compliant deployment.",
      tags: ["iOS & Android", "Flutter / React Native", "Custom APIs"]
    },
    {
      icon: <Search className="w-8 h-8 text-purple-400" />,
      title: "SEO & Growth Engineering",
      description: "Data-driven SEO strategies built directly into the engineering stack. Code-level optimizations, schema injection, speed tuning, and content architectures that guarantee search placement.",
      tags: ["Speed Optimization", "Technical SEO", "Conversion Rate Optimization"]
    },
    {
      icon: <Cloud className="w-8 h-8 text-cyan-400" />,
      title: "Enterprise Cloud & DevOps",
      description: "Scalable cloud architectures built on AWS, GCP, and Serverless Firebase backends. Secure CI/CD automated deployment pipelines, real-time logging, and global content delivery networks.",
      tags: ["Serverless Architectures", "Docker & Kubernetes", "CI/CD Automations"]
    },
    {
      icon: <Palette className="w-8 h-8 text-emerald-400" />,
      title: "UI/UX & Interactive Design",
      description: "High-end product design frameworks centered around emotional response and functional ease. Interactive prototypes, standard-setting layouts, and fluid design systems.",
      tags: ["Figma Systems", "Interactive Prototypes", "Dynamic Motion Design"]
    }
  ];

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-slate-950/40 border-t border-white/5">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] rounded-full bg-radial-glow opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Our Core Capabilities</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 font-outfit">
            What We Do
          </h2>
          <p className="text-slate-400 font-light text-lg leading-relaxed">
            Fevysis Technology brings enterprise-level engineering standards to your projects. We structure every solution from the ground up to achieve maximum efficiency, bulletproof stability, and clean performance.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between h-full relative group"
            >
              {/* Card Glow Highlight */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center mb-8 shadow-inner">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white font-outfit mb-4 group-hover:text-cyan-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-light mb-8">
                  {service.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-xs font-medium px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
