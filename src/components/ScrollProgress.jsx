import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(value);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />;
}
