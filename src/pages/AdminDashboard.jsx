import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  getDocs
} from "firebase/firestore";
import { 
  CheckCircle, 
  Clock, 
  Activity, 
  User, 
  MessageSquare, 
  Sliders, 
  Send,
  Mail,
  TrendingUp,
  Inbox,
  LogOut,
  Users,
  Briefcase,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { currentUser, isAdmin, logout } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatClients, setChatClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [adminReply, setAdminReply] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, leads, support, team
  const [leadFilter, setLeadFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    } else if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [currentUser, isAdmin, navigate]);

  // Fetch inquiries (leads) in real-time
  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, "inquiries"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      list.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      setInquiries(list);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // Fetch registered users directory from Firestore
  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setUsersList(list);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // Auto-select lead when list loads or changes
  useEffect(() => {
    if (inquiries.length > 0 && !selectedLead) {
      setSelectedLead(inquiries[0]);
    }
  }, [inquiries, selectedLead]);

  // Fetch all chat support channels (unique clients who sent messages)
  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, "messages"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });

      const clientsMap = {};
      msgs.forEach((m) => {
        if (m.clientUid) {
          clientsMap[m.clientUid] = {
            uid: m.clientUid,
            email: m.clientEmail || "anonymous@company.com",
            lastMessage: m.text,
            lastActive: m.createdAt?.seconds || 0
          };
        }
      });

      const uniqueClients = Object.values(clientsMap);
      uniqueClients.sort((a, b) => b.lastActive - a.lastActive);
      setChatClients(uniqueClients);
      
      if (uniqueClients.length > 0 && !selectedClient) {
        setSelectedClient(uniqueClients[0]);
      }
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // Fetch chat feed for selected client in real-time
  useEffect(() => {
    if (!isAdmin || !selectedClient) return;

    const q = query(
      collection(db, "messages"),
      where("clientUid", "==", selectedClient.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feed = [];
      snapshot.forEach((doc) => {
        feed.push({ id: doc.id, ...doc.data() });
      });
      feed.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeA - timeB;
      });
      setMessages(feed);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    });

    return () => unsubscribe();
  }, [isAdmin, selectedClient, activeTab]);

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const docRef = doc(db, "inquiries", leadId);
      await updateDoc(docRef, { status: newStatus });
      setSelectedLead((prev) => (prev && prev.id === leadId ? { ...prev, status: newStatus } : prev));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const toggleUserRole = async (userId, currentRole) => {
    try {
      const nextRole = currentRole === "admin" ? "client" : "admin";
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, { role: nextRole });
    } catch (err) {
      console.error("Error changing role:", err);
    }
  };

  const handleAdminReplySubmit = async (e) => {
    e.preventDefault();
    if (!adminReply.trim() || !selectedClient) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: adminReply.trim(),
        sender: "admin",
        clientUid: selectedClient.uid,
        clientEmail: selectedClient.email,
        createdAt: serverTimestamp()
      });
      setAdminReply("");
    } catch (err) {
      console.error("Error saving admin reply:", err);
    }
  };

  // Filter leads based on filter buttons
  const filteredInquiries = inquiries.filter((item) => {
    if (leadFilter === "all") return true;
    if (leadFilter === "new") return item.status === "new" || item.status === "contacted";
    if (leadFilter === "active") return item.status === "in_progress" || item.status === "qa";
    if (leadFilter === "launched") return item.status === "launched" || item.status === "completed";
    return true;
  });

  // Calculate dynamic stats metrics
  const stats = {
    totalLeads: inquiries.length,
    activeDev: inquiries.filter(i => i.status === "in_progress" || i.status === "qa").length,
    completed: inquiries.filter(i => i.status === "launched" || i.status === "completed").length,
    totalUsers: usersList.length,
    adminsCount: usersList.filter(u => u.role === "admin").length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col pt-20">
      
      {/* Admin Top Hub Banner */}
      <div className="border-b border-white/5 bg-slate-950/60 backdrop-blur-md px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl md:text-2xl font-black font-outfit text-white tracking-wider flex items-center gap-2">
              FEVYSIS COMMAND CENTRE
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                Core v1.0.4
              </span>
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1 font-light">
            Central orchestration console for client lead triages, real-time consultation feeds, and secure role scopes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-white/5 bg-slate-900 text-xs text-slate-300">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium font-mono">{currentUser?.email}</span>
          </div>
          <button
            onClick={() => logout().then(() => navigate("/"))}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-grow">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="glass-panel p-4 rounded-3xl flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible shrink-0 shadow-lg">
            {[
              { id: "overview", label: "Analytics Tiles", icon: <TrendingUp className="w-4 h-4" /> },
              { id: "leads", label: "Project Inbound Desk", icon: <Inbox className="w-4 h-4" /> },
              { id: "support", label: "Consultant Channels", icon: <MessageSquare className="w-4 h-4" /> },
              { id: "team", label: "Database Roles", icon: <Users className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black shadow-lg shadow-emerald-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Security Status Box */}
          <div className="glass-panel p-6 rounded-3xl relative overflow-hidden hidden lg:block">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-radial-glow opacity-30 pointer-events-none" />
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Role Controls Active
            </h4>
            <p className="text-slate-400 text-[10px] leading-relaxed font-light mb-4">
              All admin actions directly modify Firestore document attributes. Changes reflect in real-time on target client terminals.
            </p>
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>DB Sync:</span>
              <span className="text-emerald-400 font-bold">Online</span>
            </div>
          </div>
        </div>

        {/* DYNAMIC CONSOLES */}
        <div className="lg:col-span-9 col-span-1">

          {/* TAB 1: ANALYTICS TILES */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-8 animate-fade-in">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { value: stats.totalLeads, label: "Total Lead Pipelines", desc: "Aggregated contact inquiries", icon: <Inbox className="w-5 h-5 text-cyan-400" /> },
                  { value: stats.activeDev, label: "Active Pipelines", desc: "Milestones in active coding/QA", icon: <Activity className="w-5 h-5 text-amber-400" /> },
                  { value: stats.completed, label: "Production Launched", desc: "Systems running on global CDNs", icon: <CheckCircle className="w-5 h-5 text-emerald-400" /> },
                  { value: stats.totalUsers, label: "Database Users", desc: "Total registered client profiles", icon: <Users className="w-5 h-5 text-purple-400" /> }
                ].map((stat, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-radial-glow opacity-25 group-hover:scale-125 transition-transform" />
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-3xl font-black text-white font-outfit tracking-tight">
                        {stat.value}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center">
                        {stat.icon}
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-outfit">
                      {stat.label}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-light">
                      {stat.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recent Activity Table */}
              <div className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-radial-glow opacity-15 pointer-events-none" />
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-bold font-outfit text-white">
                      Recent Inbound Pipelines
                    </h3>
                    <p className="text-slate-500 text-[10px] mt-0.5 font-light">
                      Real-time indexed leads submitted via contact forms.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("leads")}
                    className="text-xs text-emerald-400 font-semibold flex items-center gap-1 hover:text-white transition-colors"
                  >
                    View Leads Desk
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-light text-slate-400">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                        <th className="pb-3">Client</th>
                        <th className="pb-3">Capability</th>
                        <th className="pb-3">Budget</th>
                        <th className="pb-3">Timeline Gate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {inquiries.slice(0, 5).map((lead) => (
                        <tr key={lead.id} className="hover:bg-white/[0.01]">
                          <td className="py-4">
                            <span className="text-white font-bold block">{lead.name}</span>
                            <span className="text-[10px] text-slate-500 font-light block">{lead.company}</span>
                          </td>
                          <td className="py-4">{lead.projectType}</td>
                          <td className="py-4 font-mono text-[10px] text-slate-300">{lead.budget}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                              lead.status === "completed" || lead.status === "launched"
                                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                                : lead.status === "in_progress"
                                ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-400"
                                : "bg-amber-500/5 border-amber-500/20 text-amber-400"
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECT INBOUND LEADS DESK */}
          {activeTab === "leads" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold font-outfit text-white">
                    Inbound Triage Desk
                  </h1>
                  <p className="text-slate-400 text-xs font-light mt-0.5">
                    Filter leads and recalibrate milestone phases directly in the client database.
                  </p>
                </div>
                {/* Filter Selector */}
                <div className="flex gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/5">
                  {[
                    { id: "all", label: "All" },
                    { id: "new", label: "New" },
                    { id: "active", label: "Active" },
                    { id: "launched", label: "Launched" }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setLeadFilter(filter.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        leadFilter === filter.id
                          ? "bg-slate-800 text-white shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center">
                  <Inbox className="w-12 h-12 text-slate-600 mb-6" />
                  <h3 className="text-lg font-bold text-white mb-2 font-outfit">
                    No Matching Lead Pipelines Found
                  </h3>
                  <p className="text-slate-400 text-xs font-light max-w-sm">
                    No inquiries align with the selected category filters at this moment.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Leads List Left Column */}
                  <div className="lg:col-span-5 flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1">
                    {filteredInquiries.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`p-4 rounded-2xl border text-left flex flex-col gap-2.5 transition-all ${
                          selectedLead?.id === lead.id
                            ? "bg-slate-900 border-emerald-500/40 shadow-inner"
                            : "bg-slate-900/60 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-white font-bold text-sm truncate font-outfit">
                            {lead.name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-wide shrink-0 ${
                            lead.status === "completed" || lead.status === "launched"
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                              : lead.status === "in_progress"
                              ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-400"
                              : "bg-amber-500/5 border-amber-500/20 text-amber-400"
                          }`}>
                            {lead.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[10px] truncate leading-relaxed font-light">
                          {lead.projectType} • {lead.budget}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Lead details Right Column */}
                  <div className="lg:col-span-7">
                    {selectedLead && (
                      <div className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col gap-6">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-radial-glow opacity-25 pointer-events-none" />
                        
                        <div className="border-b border-white/5 pb-4">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                            Telemetry Board Focus
                          </span>
                          <h3 className="text-white font-bold text-lg font-outfit mt-1">
                            {selectedLead.name}
                          </h3>
                          <p className="text-slate-500 text-xs mt-0.5">
                            Company: <span className="text-slate-300 font-medium">{selectedLead.company}</span>
                          </p>
                        </div>

                        {/* Telemetry data table grid */}
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</span>
                            <p className="text-white font-medium mt-1 truncate select-all">{selectedLead.email}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mobile Phone</span>
                            <p className="text-white font-medium mt-1 select-all">{selectedLead.phone}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Capability Type</span>
                            <p className="text-white font-medium mt-1">{selectedLead.projectType}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Budget Range</span>
                            <p className="text-white font-medium mt-1 font-mono">{selectedLead.budget}</p>
                          </div>
                        </div>

                        {/* Description Box */}
                        <div className="p-4 rounded-xl bg-slate-900 border border-white/5">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Scope Specification</span>
                          <p className="text-slate-300 text-xs font-light leading-relaxed whitespace-pre-wrap select-all">
                            {selectedLead.message}
                          </p>
                        </div>

                        {/* Calibrate steppers */}
                        <div className="border-t border-white/5 pt-5 flex flex-col gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                            Calibrate Milestones Phase (Firestore Sync)
                          </span>
                          
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: "new", label: "01. Strategy" },
                              { id: "contacted", label: "02. Design" },
                              { id: "in_progress", label: "03. Coding" },
                              { id: "qa", label: "04. Quality QA" },
                              { id: "launched", label: "05. Production" }
                            ].map((phase) => (
                              <button
                                key={phase.id}
                                onClick={() => updateLeadStatus(selectedLead.id, phase.id)}
                                className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                  selectedLead.status === phase.id
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/10"
                                    : "bg-slate-900 border-white/5 text-slate-400 hover:border-white/10"
                                }`}
                              >
                                {phase.label}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONSULTANT CHANNELS CHATS */}
          {activeTab === "support" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold font-outfit text-white">
                  Consultation Channels
                </h1>
                <p className="text-slate-400 text-xs font-light mt-0.5">
                  Stream advice and architectural guidance directly to clients in real-time.
                </p>
              </div>

              {chatClients.length === 0 ? (
                <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center">
                  <MessageSquare className="w-12 h-12 text-slate-600 mb-6" />
                  <h3 className="text-lg font-bold text-white mb-2 font-outfit">
                    Zero Active Conversations
                  </h3>
                  <p className="text-slate-400 text-xs font-light max-w-sm">
                    Client communication lines will display here once conversations are started.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Conversations selector sidebar list */}
                  <div className="lg:col-span-5 flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
                    {chatClients.map((client) => (
                      <button
                        key={client.uid}
                        onClick={() => setSelectedClient(client)}
                        className={`p-4 rounded-2xl border text-left flex flex-col gap-1.5 transition-all ${
                          selectedClient?.uid === client.uid
                            ? "bg-slate-900 border-emerald-500/40"
                            : "bg-slate-900/60 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <h4 className="text-white font-bold text-xs truncate font-outfit">
                          {client.email}
                        </h4>
                        <p className="text-slate-500 text-[10px] truncate leading-relaxed font-light italic">
                          Last: "{client.lastMessage}"
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Messaging panel */}
                  <div className="lg:col-span-7">
                    {selectedClient && (
                      <div className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col h-[520px] relative overflow-hidden shadow-lg border border-white/5">
                        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-radial-glow opacity-25 pointer-events-none" />

                        <div className="border-b border-white/5 pb-4 flex justify-between items-center mb-4 shrink-0">
                          <div>
                            <h2 className="text-xs font-bold font-outfit text-white flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                              Active Channel: {selectedClient.email}
                            </h2>
                            <p className="text-slate-500 text-[9px] font-mono mt-0.5">
                              UID: {selectedClient.uid}
                            </p>
                          </div>
                        </div>

                        {/* Chat Feed */}
                        <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4">
                          {messages.map((msg) => {
                            const isAdminSender = msg.sender === "admin";
                            return (
                              <div
                                key={msg.id}
                                className={`flex flex-col max-w-[80%] ${
                                  isAdminSender ? "ml-auto items-end" : "mr-auto items-start"
                                }`}
                              >
                                <div className={`px-4 py-3 rounded-2xl text-xs font-light leading-relaxed ${
                                  isAdminSender
                                    ? "bg-emerald-500 text-slate-950 rounded-tr-none font-medium"
                                    : "bg-slate-900 text-slate-200 border border-white/5 rounded-tl-none"
                                }`}>
                                  {msg.text}
                                </div>
                                <span className="text-[8px] text-slate-500 mt-1 font-mono">
                                  {isAdminSender ? "Fevysis Technology Admin Support" : "Sent by Client"}
                                </span>
                              </div>
                            );
                          })}
                          <div ref={chatEndRef} />
                        </div>

                        {/* Input Row */}
                        <form onSubmit={handleAdminReplySubmit} className="flex gap-3 shrink-0 pt-3 border-t border-white/5">
                          <input
                            type="text"
                            required
                            value={adminReply}
                            onChange={(e) => setAdminReply(e.target.value)}
                            placeholder="Enter message package..."
                            className="flex-1 px-4 py-3.5 rounded-xl bg-slate-900 border border-white/5 focus:border-emerald-500/40 text-white placeholder-slate-500 outline-none text-xs"
                          />
                          <button
                            type="submit"
                            className="px-4 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center justify-center shadow-lg"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DATABASE ROLES (USER DIRECTORY MANAGEMENT) */}
          {activeTab === "team" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold font-outfit text-white">
                  Database User Directory
                </h1>
                <p className="text-slate-400 text-xs font-light mt-0.5">
                  View all registered workspace accounts and assign security scopes (Admin / Client) in real-time.
                </p>
              </div>

              <div className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-lg border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-radial-glow opacity-15 pointer-events-none" />

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-light text-slate-400">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                        <th className="pb-3">Account Email</th>
                        <th className="pb-3">User UID</th>
                        <th className="pb-3">Security Privilege</th>
                        <th className="pb-3 text-right">Database Operation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {usersList.map((user) => {
                        const isUserAdmin = user.role === "admin";
                        const isSelf = user.uid === currentUser?.uid;

                        return (
                          <tr key={user.id} className="hover:bg-white/[0.01]">
                            <td className="py-4">
                              <span className="text-white font-bold block">{user.email}</span>
                            </td>
                            <td className="py-4 font-mono text-[10px] text-slate-500">
                              {user.uid}
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                                isUserAdmin
                                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                                  : "bg-slate-900 border-white/5 text-slate-500"
                              }`}>
                                {user.role || "client"}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              {isSelf ? (
                                <span className="text-[10px] text-slate-500 font-medium italic pr-4">
                                  Your Account (Protected)
                                </span>
                              ) : (
                                <button
                                  onClick={() => toggleUserRole(user.id, user.role)}
                                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                    isUserAdmin
                                      ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950"
                                  }`}
                                >
                                  {isUserAdmin ? "Revoke Admin Access" : "Promote to Admin"}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
