import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Reveal({
  as: Tag = "div",
  children,
  className = "",
  direction = "up",
  delay = 0,
}) {
  const { ref, isVisible } = useScrollReveal();

  const directionClass =
    direction === "left"
      ? "reveal-left"
      : direction === "right"
        ? "reveal-right"
        : "reveal-up";

  return (
    <Tag
      ref={ref}
      className={`${directionClass} ${isVisible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
