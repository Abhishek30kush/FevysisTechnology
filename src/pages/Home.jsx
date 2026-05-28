import React from "react";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Process from "../components/Process";
import Portfolio from "../components/Portfolio";
import Testimonials from "../components/Testimonials";
import ContactForm from "../components/ContactForm";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <Hero />
      <Services />
      <Process />
      <Portfolio />
      <Testimonials />
      <ContactForm />
    </div>
  );
}
