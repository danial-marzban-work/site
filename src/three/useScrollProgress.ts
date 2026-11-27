import { useEffect } from "react";

/**
 * Hero scroll progress (0 at the top of the page, 1 once the hero has scrolled
 * away), shared by every 3D part that reacts to it through one passive listener.
 */
const scrollRef = { current: 0 };
let subscribers = 0;

function readScroll() {
  const viewport = window.innerHeight || 1;
  scrollRef.current = Math.min(1, Math.max(0, window.scrollY / viewport));
}

export function useScrollProgress() {
  useEffect(() => {
    if (subscribers === 0) {
      readScroll();
      window.addEventListener("scroll", readScroll, { passive: true });
      window.addEventListener("resize", readScroll);
    }
    subscribers += 1;
    readScroll();

    return () => {
      subscribers -= 1;
      if (subscribers === 0) {
        window.removeEventListener("scroll", readScroll);
        window.removeEventListener("resize", readScroll);
      }
    };
  }, []);

  return scrollRef;
}
