const NODES = [
  [42, 78, "Web"],
  [146, 34, "Frontend"],
  [258, 82, "CMS"],
  [92, 176, "Accessibility"],
  [222, 184, "AI"],
  [322, 128, "Leadership"],
];
const FOCUS = {
  general: ["Web", "Frontend", "AI"],
  recruiter: ["Leadership", "Web"],
  engineering: ["Frontend", "Accessibility"],
  marketing: ["Web", "CMS"],
  client: ["Web", "Frontend"],
  ai: ["AI", "Frontend"],
};

export default function IntelligenceGraphic({ audienceKey = "general" }) {
  const active = new Set(FOCUS[audienceKey] || FOCUS.general);
  return (
    <div className="intelligence-graphic" aria-hidden="true">
      <svg viewBox="0 0 370 230" role="presentation">
        <path className="intel-line" d="M42 78 L146 34 L258 82 L322 128 L222 184 L92 176 Z" />
        <path className="intel-line intel-line-secondary" d="M42 78 L222 184 M146 34 L92 176 M258 82 L92 176" />
        {NODES.map(([x,y,label]) => (
          <g key={label} className={active.has(label) ? "intel-node is-active" : "intel-node"}>
            <circle cx={x} cy={y} r="8" />
            <text x={x} y={y + 24} textAnchor="middle">{label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
