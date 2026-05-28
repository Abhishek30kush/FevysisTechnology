import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  getDocs
} from "firebase/firestore";
import { 
  Send, 
  LayoutDashboard, 
  MessageSquare, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileCode,
  Smartphone,
  Search,
  Cloud,
  ChevronRight,
  TrendingUp,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatError, setChatError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, requests, support
  const [loading, setLoading] = useState(true);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  // Project request subform state
  const [requestData, setRequestData] = useState({
    title: "",
    projectType: "Web Engineering",
    budget: "$5,000 - $20,000",
    message: ""
  });
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  // Fetch client inquiries (leads / projects) from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "inquiries"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setInquiries(list);
      
      // Select the first active project or inquiry as the focus
      if (list.length > 0) {
        // If there's an active status project, select it, otherwise the first
        const active = list.find(p => p.status === "in_progress" || p.status === "new") || list[0];
        setActiveProject(active);
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Real-time Chat support feed for this specific client
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "messages"),
      where("clientUid", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      // Sort client-side by createdAt to prevent Firebase indexes requirement errors
      list.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeA - timeB;
      });
      setMessages(list);
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: "smooth"
          });
        }
      }, 150);
    });

    return () => unsubscribe();
  }, [currentUser, activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    setChatError("");

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage.trim(),
        sender: "client",
        clientUid: currentUser.uid,
        clientEmail: currentUser.email,
        createdAt: serverTimestamp()
      });
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setChatError(`Transmission failed: ${err.message || err}`);
    }
  };

  const handleNewProjectSubmit = async (e) => {
    e.preventDefault();
    setRequestSubmitting(true);
    setRequestSuccess("");

    try {
      await addDoc(collection(db, "inquiries"), {
        name: currentUser.displayName || "Client User",
        company: "My Workspace",
        email: currentUser.email,
        phone: "N/A",
        projectType: requestData.projectType,
        budget: requestData.budget,
        message: requestData.title + ": " + requestData.message,
        userId: currentUser.uid,
        status: "new",
        createdAt: serverTimestamp()
      });

      setRequestSuccess("Scope submitted successfully! Our squad has been alerted.");
      setRequestData({
        title: "",
        projectType: "Web Engineering",
        budget: "$5,000 - $20,000",
        message: ""
      });
    } catch (err) {
      console.error("Error submitting scope:", err);
    } finally {
      setRequestSubmitting(false);
    }
  };

  // Helper to render project status step timeline
  const renderTimeline = (project) => {
    // Mapping status code to index: new -> 1, contacted -> 2, in_progress -> 3, launched -> 5
    let currentStep = 1;
    if (project.status === "contacted") currentStep = 2;
    if (project.status === "in_progress") currentStep = 3;
    if (project.status === "qa") currentStep = 4;
    if (project.status === "launched" || project.status === "completed") currentStep = 5;

    const stages = [
      { num: 1, name: "Strategy & Discovery", desc: "Scope & architecture blueprinting" },
      { num: 2, name: "UI/UX Prototyping", desc: "High-fidelity motion components" },
      { num: 3, name: "Core Engineering", desc: "Active fullstack coding pipeline" },
      { num: 4, name: "Performance QA", desc: "Vulnerability & speed audit gates" },
      { num: 5, name: "Production Release", desc: "Global CDN launch & DNS mapping" }
    ];

    return (
      <div className="flex flex-col gap-6 w-full mt-4">
        {stages.map((stage) => {
          let stepState = "pending"; // pending, active, completed
          if (stage.num < currentStep) stepState = "completed";
          if (stage.num === currentStep) stepState = "active";

          return (
            <div key={stage.num} className="flex gap-4 items-start relative">
              {stage.num < 5 && (
                <div className={`absolute left-4 top-8 bottom-0 w-[2px] ${
                  stage.num < currentStep ? "bg-cyan-500" : "bg-white/5"
                }`} />
              )}
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all font-bold text-xs ${
                stepState === "completed" 
                  ? "bg-cyan-500 border-cyan-500 text-slate-950" 
                  : stepState === "active"
                  ? "bg-slate-900 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-400/10 animate-pulse"
                  : "bg-slate-950 border-white/10 text-slate-500"
              }`}>
                {stepState === "completed" ? "✓" : stage.num}
              </div>
              <div className="flex-1 pb-6">
                <h4 className={`font-bold font-outfit text-sm ${stepState === "active" ? "text-cyan-400" : "text-white"}`}>
                  {stage.name}
                </h4>
                <p className="text-slate-400 text-xs font-light mt-1">
                  {stage.desc}
                </p>
                {stepState === "active" && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-[9px] text-cyan-400 font-bold uppercase tracking-wider mt-2 animate-pulse">
                    Active Phase
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Client Bio Header */}
          <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-radial-glow opacity-30 pointer-events-none" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 block mb-1">
              Active Session
            </span>
            <h3 className="text-white font-bold font-outfit text-base truncate">
              {currentUser?.email?.split("@")[0]}
            </h3>
            <p className="text-slate-500 text-[10px] truncate mb-4">
              {currentUser?.email}
            </p>
            <button
              onClick={() => logout().then(() => navigate("/"))}
              className="w-full py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs text-slate-300 font-semibold hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Terminate Session
            </button>
          </div>

          {/* Nav Tabs */}
          <div className="glass-panel p-4 rounded-3xl flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
            {[
              { id: "overview", label: "Project Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: "requests", label: "New Project", icon: <PlusCircle className="w-4 h-4" /> },
              { id: "support", label: "Consultation Chat", icon: <MessageSquare className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Panels */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-8 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold font-outfit text-white">
                    Client Portal
                  </h1>
                  <p className="text-slate-400 text-xs font-light mt-1">
                    Telemetry view of your digital products and execution pipelines.
                  </p>
                </div>
              </div>

              {inquiries.length === 0 ? (
                /* Empty state */
                <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center">
                  <FileCode className="w-12 h-12 text-slate-600 mb-6" />
                  <h3 className="text-lg font-bold text-white mb-2 font-outfit">
                    No Active Milestones Found
                  </h3>
                  <p className="text-slate-400 text-xs font-light max-w-sm mb-6 leading-relaxed">
                    You have not submitted a digital project specification yet. Launch a custom scope inquiry to trigger your milestone roadmap.
                  </p>
                  <button
                    onClick={() => setActiveTab("requests")}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
                  >
                    Specify Digital Scope
                  </button>
                </div>
              ) : (
                /* Overview Grid */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Selector list */}
                  <div className="lg:col-span-5 flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                      Your Inquiries
                    </h3>
                    <div className="flex flex-col gap-3">
                      {inquiries.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => setActiveProject(project)}
                          className={`p-5 rounded-2xl border text-left flex justify-between items-center transition-all ${
                            activeProject?.id === project.id
                              ? "bg-slate-900 border-cyan-500/40 shadow-inner"
                              : "bg-slate-900/60 border-white/5 hover:border-white/10"
                          }`}
                        >
                          <div className="truncate pr-4">
                            <h4 className="text-white font-bold text-sm truncate font-outfit">
                              {project.projectType}
                            </h4>
                            <p className="text-slate-500 text-[10px] truncate mt-1">
                              Budget: {project.budget}
                            </p>
                          </div>
                          
                          <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                            activeProject?.id === project.id ? "text-cyan-400 translate-x-1" : "text-slate-600"
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Tracking Board */}
                  <div className="lg:col-span-7">
                    {activeProject && (
                      <div className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-radial-glow opacity-30 pointer-events-none" />
                        
                        <div className="border-b border-white/5 pb-5 mb-5 flex flex-wrap justify-between items-start gap-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                              Tracking Console
                            </span>
                            <h3 className="text-white font-bold text-lg font-outfit mt-1">
                              {activeProject.projectType}
                            </h3>
                          </div>
                          
                          {/* Project State Badge */}
                          <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                            activeProject.status === "completed" || activeProject.status === "launched"
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                              : activeProject.status === "in_progress"
                              ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-400"
                              : "bg-amber-500/5 border-amber-500/20 text-amber-400"
                          }`}>
                            {activeProject.status === "completed" || activeProject.status === "launched" ? (
                              <CheckCircle className="w-3.5 h-3.5" />
                            ) : activeProject.status === "in_progress" ? (
                              <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                            {activeProject.status}
                          </div>
                        </div>

                        {/* Visual Timeline Stepper */}
                        {renderTimeline(activeProject)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REQUESTS */}
          {activeTab === "requests" && (
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden max-w-2xl animate-fade-in">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-radial-glow opacity-25 pointer-events-none" />
              
              <div className="border-b border-white/5 pb-6 mb-6">
                <h2 className="text-xl font-bold font-outfit text-white">
                  Submit New Custom Project Scope
                </h2>
                <p className="text-slate-400 text-xs font-light mt-1.5 leading-relaxed">
                  Provide granular design requirements or technical outlines below. An engineer will immediately catalog and evaluate your specifications.
                </p>
              </div>

              {requestSuccess ? (
                <div className="text-center py-10 flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-emerald-400 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-outfit mb-3">
                    Project Scope Transmitted!
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-md font-light mb-8">
                    Your request has been successfully written to the secure database. Our squad has been alerted, and you can now track its execution.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={() => {
                        setRequestSuccess("");
                        setActiveTab("overview");
                      }}
                      className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300 flex items-center gap-2"
                    >
                      View in Tracking Console
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setRequestSuccess("")}
                      className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 hover:text-white transition-all"
                    >
                      Submit Another Scope
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleNewProjectSubmit} className="flex flex-col gap-5">
                  {/* Title */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="reqTitle" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Project Reference / Title
                    </label>
                    <input
                      type="text"
                      id="reqTitle"
                      required
                      value={requestData.title}
                      onChange={(e) => setRequestData({ ...requestData, title: e.target.value })}
                      placeholder="e.g. Lumina E-Commerce Dashboard Integration"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500/40 text-white placeholder-slate-500 outline-none text-sm transition-all"
                    />
                  </div>

                  {/* Grid Type & Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="reqType" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Primary Stack Area
                      </label>
                      <select
                        id="reqType"
                        value={requestData.projectType}
                        onChange={(e) => setRequestData({ ...requestData, projectType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500/40 text-white outline-none text-sm transition-all cursor-pointer"
                      >
                        <option value="Web Engineering">Web Engineering</option>
                        <option value="Mobile Apps">Mobile Apps</option>
                        <option value="SEO & Optimization">SEO & Optimization</option>
                        <option value="Enterprise Cloud & DevOps">Enterprise Cloud & DevOps</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="reqBudget" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Allocated Budget Range
                      </label>
                      <select
                        id="reqBudget"
                        value={requestData.budget}
                        onChange={(e) => setRequestData({ ...requestData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500/40 text-white outline-none text-sm transition-all cursor-pointer"
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
                    <label htmlFor="reqMessage" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Technical Goals & Deliverables
                    </label>
                    <textarea
                      id="reqMessage"
                      required
                      rows="5"
                      value={requestData.message}
                      onChange={(e) => setRequestData({ ...requestData, message: e.target.value })}
                      placeholder="Specify backend integrations, desired layout aesthetic, or mobile targets..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500/40 text-white placeholder-slate-500 outline-none text-sm transition-all resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={requestSubmitting}
                    className="py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {requestSubmitting ? "Transmitting Scope Spec..." : "Transmit Scope Specification"}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: SUPPORT */}
          {activeTab === "support" && (
            <div className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col h-[520px] animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-radial-glow opacity-25 pointer-events-none" />

              <div className="border-b border-white/5 pb-4 flex justify-between items-center mb-4 shrink-0">
                <div>
                  <h2 className="text-base font-bold font-outfit text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    Direct Squad Consultation
                  </h2>
                  <p className="text-slate-500 text-[10px] font-light">
                    Direct secure channel to Fevysis Technology primary solution architects.
                  </p>
                </div>
              </div>

              {/* Chat Message Box */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 font-light">
                    <MessageSquare className="w-8 h-8 text-slate-600 mb-3" />
                    <p className="text-xs">No communication packets transmitted yet.</p>
                    <p className="text-[10px] text-slate-600 mt-1 max-w-xs">Write your query below. Our squad will reply immediately in this channel.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender === "client";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] ${
                          isMe ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                      >
                        <div className={`px-4 py-3 rounded-2xl text-xs font-light leading-relaxed ${
                          isMe
                            ? "bg-cyan-500 text-slate-950 rounded-tr-none font-medium"
                            : "bg-slate-900 text-slate-200 border border-white/5 rounded-tl-none"
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[8px] text-slate-500 mt-1 font-mono">
                          {isMe ? "Sent by You" : "Fevysis Technology Admin Support"}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {chatError && (
                <div className="px-4 py-2 text-[10px] text-red-400 bg-red-500/5 border border-red-500/10 rounded-xl mb-3 shrink-0">
                  {chatError}
                </div>
              )}

              {/* Input row */}
              <form onSubmit={handleSendMessage} className="flex gap-3 shrink-0 pt-3 border-t border-white/5">
                <input
                  type="text"
                  required
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Enter message package..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500/40 text-white placeholder-slate-500 outline-none text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center justify-center shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
