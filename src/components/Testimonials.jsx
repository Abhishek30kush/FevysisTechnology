import React from "react";
import { MessageSquare, Quote } from "lucide-react";

export default function Testimonials() {
  const feedback = [
    {
      quote: "Fevysis Technology delivered our unified energy intelligence portal with absolute precision. Their React architecture standards and real-time backend synchronization are truly elite.",
      author: "Sarah Jenkins",
      title: "VP of Product Engineering",
      company: "Solaria Global",
      initials: "SJ",
      theme: "border-cyan-500/30 text-cyan-400"
    },
    {
      quote: "Working with their team was an absolute game-changer. They engineered our secure ledger mobile app with flawless biometric verification and robust offline state syncing.",
      author: "David Chen",
      title: "Chief Product Officer",
      company: "Lumina Payments",
      initials: "DC",
      theme: "border-emerald-500/30 text-emerald-400"
    },
    {
      quote: "Their technical SEO optimizations and performance audits were exceptional. We achieved a +380% search indexing trajectory inside 90 days. Outstanding digital craftsmanship.",
      author: "Ananya Sen",
      title: "Director of Technical SEO",
      company: "Apex Solutions",
      initials: "AS",
      theme: "border-purple-500/30 text-purple-400"
    }
  ];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-slate-950">
      <div className="absolute bottom-[20%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-radial-glow opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Client Commendations</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 font-outfit">
            Validated by Industry Leaders
          </h2>
          <p className="text-slate-400 font-light text-lg leading-relaxed">
            Don't take our word for it. Read direct recommendations from standard-setting product teams and technology officers who scale with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {feedback.map((f, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between relative group"
            >
              {/* Quote Mark */}
              <div className="absolute top-6 right-8 text-white/5 group-hover:text-cyan-500/10 transition-colors">
                <Quote className="w-16 h-16 transform rotate-180" />
              </div>

              <div className="relative z-10">
                <p className="text-slate-300 text-sm leading-relaxed font-light italic mb-8">
                  "{f.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-white/5">
                {/* Avatar Badge */}
                <div className={`w-11 h-11 rounded-full bg-slate-900 border flex items-center justify-center font-bold font-outfit text-sm ${f.theme}`}>
                  {f.initials}
                </div>

                <div>
                  <h4 className="text-white text-sm font-bold font-outfit">
                    {f.author}
                  </h4>
                  <p className="text-slate-500 text-xs font-light">
                    {f.title}, <span className="text-slate-400 font-medium">{f.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
