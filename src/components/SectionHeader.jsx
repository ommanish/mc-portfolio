import Reveal from "./Reveal";
import HandwrittenAccent from "./HandwrittenAccent";

export default function SectionHeader({ kicker, title, copy, accentType, accentLabel, accentClassName = "" }) {
  return (
    <Reveal className="section-header">
      <div>
        <div className="section-kicker">{kicker}</div>
        <h2 className="section-title">{title}</h2>
        {accentType ? (
          <HandwrittenAccent
            type={accentType}
            label={accentLabel}
            className={`section-header-handwritten ${accentClassName}`.trim()}
          />
        ) : null}
      </div>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </Reveal>
  );
}
