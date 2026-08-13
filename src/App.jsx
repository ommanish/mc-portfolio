import { useCallback, useState } from "react";
import AISection from "./components/AISection";
import CaseStudies from "./components/CaseStudies";
import Contact from "./components/Contact";
import FeaturedWork from "./components/FeaturedWork";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HowICanHelp from "./components/HowICanHelp";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import PersonalizingTransition from "./components/PersonalizingTransition";
import ScrollProgress from "./components/ScrollProgress";
import Skills from "./components/Skills";
import Timeline from "./components/Timeline";
import ViewSelector from "./components/ViewSelector";
import WebExperience from "./components/WebExperience";
import WelcomeExperience from "./components/WelcomeExperience";
import usePersonalization from "./hooks/usePersonalization";
import "./styles/global.css";
import "./styles/personalization.css";
import "./styles/contact.css";
import "./styles/redesign.css";

export default function App() {
  const [isLight, setIsLight] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const { profile, source, stage, selectAudience, exploreNormally, searchIntent, resetAudience } = usePersonalization();
  const closeSelector = useCallback(() => setSelectorOpen(false), []);

  const sections = {
    work: <FeaturedWork key="work" />,
    services: <HowICanHelp key="services" />,
    "web-experience": <WebExperience key="web-experience" />,
    cases: <CaseStudies key="cases" />,
    skills: <Skills key="skills" />,
    ai: <AISection key="ai" />,
    timeline: <Timeline key="timeline" />,
    contact: <Contact key="contact" />,
  };
  const portfolioVisible = stage === "portfolio";

  return (
    <div className={isLight ? "app light premium-app" : "app premium-app"} id="top">
      <Loader />
      {portfolioVisible && <ScrollProgress />}
      <Navbar isLight={isLight} onThemeToggle={() => setIsLight((v) => !v)} showNavigation={portfolioVisible} />

      <main className={`site-shell experience-stage experience-stage-${stage}`}>
        {stage === "welcome" && <WelcomeExperience onSelectAudience={selectAudience} onSearchIntent={searchIntent} onExploreNormally={exploreNormally} />}
        {stage === "personalizing" && <PersonalizingTransition />}
        {portfolioVisible && <>
          <Hero audienceProfile={profile} source={source} onAdjust={() => setSelectorOpen(true)} />
          {profile.sectionOrder.map((key) => sections[key])}
        </>}
      </main>

      {portfolioVisible && <Footer />}
      <ViewSelector open={selectorOpen && portfolioVisible} onClose={closeSelector}
        onSelectAudience={selectAudience} onSearchIntent={searchIntent} onReset={resetAudience} />
    </div>
  );
}
