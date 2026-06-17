import { portfolioContent } from "../content/portfolioContent";

export default function Navbar({ isLight, onThemeToggle }) {
  const { site, nav } = portfolioContent;

  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="brand" href="#top" aria-label={`${site.name} home`}>
          <span className="brand-mark">{site.initials}</span>
          <span>{site.name}</span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          {nav.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
          <button className="theme-toggle" type="button" onClick={onThemeToggle}>
            {isLight ? "Dark" : "Light"}
          </button>
        </nav>
      </div>
    </header>
  );
}
