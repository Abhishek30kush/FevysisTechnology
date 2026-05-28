import React, { useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Send, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ContactForm() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: currentUser ? currentUser.email : "",
    phone: "",
    projectType: "Web Engineering",
    budget: "$5,000 - $20,000",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Save lead submission to Firestore
      await addDoc(collection(db, "inquiries"), {
        ...formData,
        userId: currentUser ? currentUser.uid : "GUEST",
        status: "new",
        createdAt: serverTimestamp()
      });

      setSubmitted(true);
      setFormData({
        name: "",
        company: "",
        email: currentUser ? currentUser.email : "",
        phone: "",
        projectType: "Web Engineering",
        budget: "$5,000 - $20,000",
        message: ""
      });
    } catch (err) {
      console.error("Firestore submit error:", err);
      setError("Failed to transmit project requirements. Please try again or email rishipandey8991@gmail.com.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-slate-950/40 border-t border-white/5">
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] rounded-full bg-radial-glow opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Side: Text info */}
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Consult Our Squad</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 font-outfit">
            Let's Engineer <br />
            <span className="text-gradient-cyan">Your Next Success</span>
          </h2>
          <p className="text-slate-400 font-light text-lg leading-relaxed mb-8">
            Tell us about your digital product requirements. Whether you are bootstrapping a new product or looking for high-performance scale, our expert engineering team is ready to deliver.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                <strong className="text-white font-medium">Standard SLA Response:</strong> Received inquiries are triaged within 4 hours by our technical leadership.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                <strong className="text-white font-medium">Project Tracking Enabled:</strong> Clients who sign in can track design, development, and launch gates via the client portal.
              </p>
            </div>
          </div>

          {!currentUser && (
            <div className="mt-12 p-6 rounded-2xl border border-white/5 bg-slate-900/60 backdrop-blur-md">
              <h4 className="text-white font-bold text-sm mb-2 font-outfit">Want Real-time Telemetry?</h4>
              <p className="text-slate-400 text-xs font-light leading-relaxed mb-4">
                Register or Sign In before submitting to unlock your private Client Workspace dashboard, enabling milestone tracking and direct communication support channels.
              </p>
              <Link
                to="/signin"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Sign In/Create Portal
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Side: Contact Form Card */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="glass-panel p-8 md:p-12 rounded-3xl text-center flex flex-col items-center justify-center border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white font-outfit mb-4">
                Inquiry Transmitted Successfully
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md font-light mb-8">
                Your engineering request has been recorded. Our lead solutions architect is reviewing your details and will connect shortly.
              </p>
              {currentUser ? (
                <Link
                  to="/dashboard"
                  className="px-6 py-3 rounded-full text-sm font-semibold tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300"
                >
                  Go to Client Workspace
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 rounded-full text-sm font-semibold border border-white/10 hover:border-white/20 bg-white/5 text-white transition-all"
                  >
                    Submit Another Inquiry
                  </button>
                  <Link
                    to="/signin"
                    className="px-6 py-3 rounded-full text-sm font-semibold tracking-wide bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all"
                  >
                    Create Client Portal
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="glass-panel p-8 md:p-10 rounded-3xl flex flex-col gap-6 relative"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

              {error && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Name & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500/40 text-white placeholder-slate-500 outline-none text-sm transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="company" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500/40 text-white placeholder-slate-500 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500/40 text-white placeholder-slate-500 outline-none text-sm transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500/40 text-white placeholder-slate-500 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Project Type & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="projectType" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Capability Needed
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500/40 text-white outline-none text-sm transition-all cursor-pointer appearance-none"
                  >
                    <option value="Web Engineering">Web Engineering</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="SEO & Optimization">SEO & Optimization</option>
                    <option value="Enterprise Cloud & DevOps">Enterprise Cloud & DevOps</option>
                    <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="budget" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Estimate Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500/40 text-white outline-none text-sm transition-all cursor-pointer appearance-none"
                  >
                    <option value="Under $5,000">Under $5,000</option>
                    <option value="$5,000 - $20,000">$5,000 - $20,000</option>
                    <option value="$20,000 - $50,000">$20,000 - $50,000</option>
                    <option value="$50,000+">$50,000+</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Project Description & Requirements
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Summarize your key objectives, integrations, and milestones..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500/40 text-white placeholder-slate-500 outline-none text-sm transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? "Transmitting Scope..." : "Transmit Project Scope"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
