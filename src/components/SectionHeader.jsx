import Reveal from "./Reveal";

export default function SectionHeader({ kicker, title, copy }) {
  return (
    <Reveal className="section-header">
      <div>
        <div className="section-kicker">{kicker}</div>
        <h2 className="section-title">{title}</h2>
      </div>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </Reveal>
  );
}
