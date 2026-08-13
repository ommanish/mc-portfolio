import { Suspense, useEffect, useRef, useState } from "react";

export default function ProgressiveSection({
  sectionId,
  chapter,
  index,
  eager = false,
  children,
}) {
  const shellRef = useRef(null);
  const [loaded, setLoaded] = useState(eager);

  useEffect(() => {
    if (loaded) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setLoaded(true);
      return undefined;
    }

    const node = shellRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "900px 0px", threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loaded]);

  return (
    <div
      ref={shellRef}
      id={sectionId}
      className={`spine-chapter spine-chapter-${sectionId} progressive-section-shell`}
      data-chapter={chapter}
      data-loaded={loaded ? "true" : "false"}
    >
      <div className="spine-marker" aria-hidden="true">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <strong>{chapter}</strong>
      </div>

      {loaded ? (
        <Suspense
          fallback={
            <div className="progressive-section-loading" aria-hidden="true">
              <span />
            </div>
          }
        >
          {children}
        </Suspense>
      ) : (
        <div className="progressive-section-placeholder" aria-hidden="true">
          <span>{chapter}</span>
        </div>
      )}
    </div>
  );
}
