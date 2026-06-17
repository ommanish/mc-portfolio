import { useEffect, useState } from "react";

export default function Loader() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsHidden(true);
    }, 850);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`loader-screen ${isHidden ? "is-hidden" : ""}`} aria-hidden="true">
      <div className="loader-card">
        <div className="loader-ring" />
        <div className="loader-copy">
          <span>Loading portfolio</span>
          <small>Preparing web experience</small>
        </div>
      </div>
    </div>
  );
}
