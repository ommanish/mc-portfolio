import { portfolioContent } from "../content/portfolioContent";
import Reveal from "./Reveal";

export default function Contact() {
  const { contact } = portfolioContent;

  return (
    <section id="contact">
      <Reveal as="article" className="contact-card">
        <div>
          <div className="section-kicker">{contact.kicker}</div>
          <h2>{contact.title}</h2>
          <p>{contact.copy}</p>
        </div>

        <div className="hero-actions contact-actions">
          {contact.actions.map((action) => (
            <a
              className={`btn ${action.variant === "primary" ? "btn-primary" : "btn-ghost"}`}
              href={action.href}
              key={action.label}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noreferrer" : undefined}
            >
              {action.label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
