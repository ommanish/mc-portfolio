import { useState } from "react";
import AISection from "./components/AISection";
import CaseStudies from "./components/CaseStudies";
import Contact from "./components/Contact";
import FeaturedWork from "./components/FeaturedWork";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import PersonalizationBar from "./components/PersonalizationBar";
import ScrollProgress from "./components/ScrollProgress";
import Skills from "./components/Skills";
import Timeline from "./components/Timeline";
import WebExperience from "./components/WebExperience";
import usePersonalization from "./hooks/usePersonalization";
import "./styles/global.css";
import "./styles/personalization.css";

export default function App() {
  const [isLight, setIsLight] = useState(true);
  const { profile, selectAudience, searchIntent, resetAudience } = usePersonalization();

  const sections = {
    work: <FeaturedWork key="work" />,
    "web-experience": <WebExperience key="web-experience" />,
    cases: <CaseStudies key="cases" />,
    skills: <Skills key="skills" />,
    ai: <AISection key="ai" />,
    timeline: <Timeline key="timeline" />,
    contact: <Contact key="contact" />,
  };

  return (
    <div className={isLight ? "app light" : "app"} id="top">
      <Loader />
      <ScrollProgress />
      <Navbar
        isLight={isLight}
        onThemeToggle={() => setIsLight((value) => !value)}
      />

      <main className="site-shell">
        <PersonalizationBar
          profile={profile}
          onSelectAudience={selectAudience}
          onSearchIntent={searchIntent}
          onReset={resetAudience}
        />
        <Hero audienceProfile={profile} />
        {profile.sectionOrder.map((sectionKey) => sections[sectionKey])}
      </main>

      <Footer />
    </div>
  );
}
