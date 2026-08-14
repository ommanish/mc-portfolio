import { lazy, useMemo, useState } from "react";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import PersonalizingTransition from "./components/PersonalizingTransition";
import ProgressiveSection from "./components/ProgressiveSection";
import ScrollProgress from "./components/ScrollProgress";
import WelcomeExperience from "./components/WelcomeExperience";
import { CANONICAL_SECTION_ORDER, getRecommendedSections } from "./content/lensConfig";
import usePersonalization from "./hooks/usePersonalization";
import "./styles/global.css";
import "./styles/personalization.css";
import "./styles/contact.css";
import "./styles/redesign.css";

const FeaturedWork = lazy(() => import("./components/FeaturedWork"));
const HowICanHelp = lazy(() => import("./components/HowICanHelp"));
const WebExperience = lazy(() => import("./components/WebExperience"));
const CaseStudies = lazy(() => import("./components/CaseStudies"));
const Skills = lazy(() => import("./components/Skills"));
const AISection = lazy(() => import("./components/AISection"));
const Timeline = lazy(() => import("./components/Timeline"));
const Contact = lazy(() => import("./components/Contact"));

const CHAPTERS = {
  work: "BUILD",
  services: "CONNECT",
  "web-experience": "OPERATE",
  cases: "SOLVE",
  skills: "DEPTH",
  ai: "EVOLVE",
  timeline: "LEAD",
  contact: "TALK",
};

const SECTION_COMPONENTS = {
  work: FeaturedWork,
  services: HowICanHelp,
  "web-experience": WebExperience,
  cases: CaseStudies,
  skills: Skills,
  ai: AISection,
  timeline: Timeline,
  contact: Contact,
};

export default function App() {
  const [isLight, setIsLight] = useState(false);
  const {
    profile,
    source,
    stage,
    selectAudience,
    exploreNormally,
    searchIntent,
    resetAudience,
  } = usePersonalization();

  const portfolioVisible = stage === "portfolio";
  const recommendedSections = useMemo(
    () => getRecommendedSections(profile, source),
    [profile, source]
  );
  const recommended = useMemo(
    () => new Set(recommendedSections),
    [recommendedSections]
  );

  return (
    <div className={isLight ? "app light premium-app" : "app premium-app"} id="top">
      <Loader />
      {portfolioVisible && <ScrollProgress />}

      <Navbar
        isLight={isLight}
        onThemeToggle={() => setIsLight((value) => !value)}
        showNavigation={portfolioVisible}
        recommendedSections={recommendedSections}
      />

      <main className={`site-shell experience-stage experience-stage-${stage}`}>
        {stage === "welcome" && (
          <WelcomeExperience
            onSelectAudience={selectAudience}
            onSearchIntent={searchIntent}
            onExploreNormally={exploreNormally}
          />
        )}

        {stage === "personalizing" && <PersonalizingTransition />}

        {portfolioVisible && (
          <>
            <Hero
              audienceProfile={profile}
              source={source}
              recommendedSections={recommendedSections}
              onChangeLens={resetAudience}
            />

            <div className="portfolio-spine" aria-label="Portfolio chapters">
              {CANONICAL_SECTION_ORDER.map((key, index) => {
                const Section = SECTION_COMPONENTS[key];
                const isRecommended = recommended.has(key);
                const sectionProps = key === "services" ? { lensKey: profile.key } : {};

                return (
                  <ProgressiveSection
                    key={key}
                    sectionId={key}
                    chapter={CHAPTERS[key]}
                    index={index}
                    recommended={isRecommended}
                    eager={index < 2 || isRecommended}
                  >
                    <Section embedded {...sectionProps} />
                  </ProgressiveSection>
                );
              })}
            </div>
          </>
        )}
      </main>

      {portfolioVisible && <Footer onRestart={resetAudience} />}
    </div>
  );
}
