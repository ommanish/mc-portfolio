const PATHS = {
  underline: (
    <>
      <path className="handwritten-accent-path" pathLength="1" d="M7 23 C 39 16, 78 21, 111 15 S 158 16, 174 11" />
      <path className="handwritten-accent-path handwritten-accent-path-secondary" pathLength="1" d="M12 29 C 48 23, 86 28, 121 21 S 158 22, 169 19" />
    </>
  ),
  circle: (
    <>
      <path className="handwritten-accent-path" pathLength="1" d="M81 7 C 123 5, 151 19, 151 39 C 151 62, 119 75, 78 73 C 35 71, 10 59, 10 38 C 10 17, 39 8, 81 7 Z" />
      <path className="handwritten-accent-path handwritten-accent-path-secondary" pathLength="1" d="M79 11 C 119 8, 145 21, 146 39 C 147 58, 117 69, 79 69 C 40 69, 16 58, 15 39 C 14 20, 40 12, 79 11 Z" />
    </>
  ),
  arrow: (
    <>
      <path className="handwritten-accent-path" pathLength="1" d="M9 51 C 52 47, 82 33, 118 24 C 137 19, 150 18, 166 18" />
      <path className="handwritten-accent-path" pathLength="1" d="M149 8 C 157 12, 163 16, 169 19 C 161 22, 154 28, 148 34" />
    </>
  ),
  marker: (
    <>
      <path className="handwritten-accent-fill" d="M7 19 C 44 9, 96 7, 173 13 L 168 38 C 112 34, 64 41, 12 35 Z" />
      <path className="handwritten-accent-path handwritten-accent-path-secondary" pathLength="1" d="M9 31 C 55 25, 111 29, 169 21" />
    </>
  ),
};

const viewBoxForAccent = (accentType) =>
  accentType === "circle" ? "0 0 160 80" : accentType === "arrow" ? "0 0 180 64" : "0 0 180 48";

const renderAccentArt = (accentType, className) => (
  <svg
    className={`handwritten-accent-art ${className}`.trim()}
    viewBox={viewBoxForAccent(accentType)}
    aria-hidden="true"
    focusable="false"
  >
    {PATHS[accentType] || PATHS.underline}
  </svg>
);

export default function HandwrittenAccent({
  type = "underline",
  label = "",
  className = "",
  notePosition = "below",
  mobileType = "",
  mobileNotePosition = "",
  hideOnMobile = false,
}) {
  const resolvedMobileType = mobileType || type;
  const resolvedMobileNotePosition = mobileNotePosition || notePosition;
  const hasMobileArt = Boolean(mobileType && mobileType !== type);

  return (
    <span
      className={`handwritten-accent ${hasMobileArt ? "handwritten-accent-has-mobile-art" : ""} ${className}`.trim()}
      data-accent-type={type}
      data-note-position={notePosition}
      data-mobile-type={resolvedMobileType}
      data-mobile-note-position={resolvedMobileNotePosition}
      data-mobile-hidden={hideOnMobile ? "true" : "false"}
      aria-hidden="true"
    >
      {renderAccentArt(type, "handwritten-accent-art-desktop")}
      {hasMobileArt ? renderAccentArt(resolvedMobileType, "handwritten-accent-art-mobile") : null}
      {label ? <span className="handwritten-note">{label}</span> : null}
    </span>
  );
}
