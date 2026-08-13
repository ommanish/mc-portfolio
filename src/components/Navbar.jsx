import { useMemo, useState } from "react";
import { portfolioContent } from "../content/portfolioContent";

export default function Navbar({
  isLight,
  onThemeToggle,
  showNavigation = true,
  recommendedSections = [],
}) {
  const { site, nav } = portfolioContent;
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const recommended = useMemo(() => new Set(recommendedSections), [recommendedSections]);

  return (
    <header className="nav premium-nav">
      <div className="nav-inner">
        <a className="brand" href="#top" aria-label={`${site.name} home`} onClick={close}>
          <span className="brand-mark">{site.initials}</span>
          <span className="brand-copy">
            <strong>{site.name}</strong>
            <small>Web Experience · Frontend · AI</small>
          </span>
        </a>

        <div className="nav-actions">
          {showNavigation && (
            <button
              className={`mobile-menu-button ${open ? "is-open" : ""}`}
              type="button"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <span /><span /><span />
            </button>
          )}

          {showNavigation && (
            <nav className={`nav-links ${open ? "is-open" : ""}`} aria-label="Primary navigation">
              {nav.map((item) => {
                const key = item.href.replace(/^#/, "");
                const isRecommended = recommended.has(key);
                return (
                  <a
                    href={item.href}
                    key={item.href}
                    onClick={close}
                    className={isRecommended ? "is-lens-recommended" : undefined}
                  >
                    {isRecommended && <span className="nav-lens-dot" aria-hidden="true" />}
                    {item.label}
                  </a>
                );
              })}
            </nav>
          )}

          <button className="theme-toggle" type="button" onClick={() => { onThemeToggle(); close(); }}>
            {isLight ? "Dark" : "Light"}
          </button>
        </div>
      </div>
    </header>
  );
}
