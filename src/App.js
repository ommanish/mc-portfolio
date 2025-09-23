import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Contact from "./sections/Contact";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-zinc-900/80 sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-700">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <a
            href="/"
            className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Manish Chawla
          </a>
          <nav aria-label="Primary">
            <ul className="flex items-center gap-4">
              <li>
                <a
                  href="#about"
                  className="text-zinc-900 dark:text-zinc-100 hover:text-brand-600 dark:hover:text-brand-400 hover:underline underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 rounded-sm"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="text-zinc-900 dark:text-zinc-100 hover:text-brand-600 dark:hover:text-brand-400 hover:underline underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 rounded-sm"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  className="text-zinc-900 dark:text-zinc-100 hover:text-brand-600 dark:hover:text-brand-400 hover:underline underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 rounded-sm"
                >
                  Skills
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-zinc-900 dark:text-zinc-100 hover:text-brand-600 dark:hover:text-brand-400 hover:underline underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 rounded-sm"
                >
                  Contact
                </a>
              </li>
              <li>
                <ThemeToggle />
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main id="main" className="min-h-dvh">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-8">
        <div className="container mx-auto px-4 text-sm text-zinc-600 dark:text-zinc-400">
          © {new Date().getFullYear()} Manish Chawla
        </div>
      </footer>
    </div>
  );
}
