import { useState } from "react";
import { portfolioContent } from "../content/portfolioContent";

export default function Navbar({ isLight, onThemeToggle }) {
  const { site, nav } = portfolioContent;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleThemeToggle = () => {
    onThemeToggle();
    closeMenu();
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <a
          className="brand"
          href="#top"
          aria-label={`${site.name} home`}
          onClick={closeMenu}
        >
          <span className="brand-mark">{site.initials}</span>
          <span>{site.name}</span>
        </a>

        <button
          className={`mobile-menu-button ${isMenuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`nav-links ${isMenuOpen ? "is-open" : ""}`}
          aria-label="Primary navigation"
        >
          {nav.map((item) => (
            <a href={item.href} key={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}

          <button
            className="theme-toggle"
            type="button"
            onClick={handleThemeToggle}
          >
            {isLight ? "Dark" : "Light"}
          </button>
        </nav>
      </div>
    </header>
  );
}
