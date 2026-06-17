import { portfolioContent } from "../content/portfolioContent";

export default function Footer() {
  const { site, footer } = portfolioContent;

  return (
    <footer>
      <div className="footer-inner">
        <span>
          © {new Date().getFullYear()} {site.name}. {footer.left}
        </span>
        <span>{footer.right}</span>
      </div>
    </footer>
  );
}
