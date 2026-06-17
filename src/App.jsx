import { useState } from "react";
import AISection from "./components/AISection";
import CaseStudies from "./components/CaseStudies";
import Contact from "./components/Contact";
import FeaturedWork from "./components/FeaturedWork";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import Skills from "./components/Skills";
import Timeline from "./components/Timeline";
import WebExperience from "./components/WebExperience";
import "./styles/global.css";

export default function App() {
  const [isLight, setIsLight] = useState(true);

  return (
    <div className={isLight ? "app light" : "app"} id="top">
      <Loader />
      <ScrollProgress />
      <Navbar
        isLight={isLight}
        onThemeToggle={() => setIsLight((value) => !value)}
      />

      <main className="site-shell">
        <Hero />
        <FeaturedWork />
        <WebExperience />
        <CaseStudies />
        <Skills />
        <AISection />
        <Timeline />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
