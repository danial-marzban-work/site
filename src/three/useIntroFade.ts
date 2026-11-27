import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

/**
 * Eased 0 -> 1 value driven by framer-motion, so 3D pieces fade in with the hero
 * copy instead of popping into the scene.
 */
export function useIntroFade(reduced: boolean, duration = 1.8) {
  const value = useRef(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      value.current = 1;
      return;
    }
    value.current = 0;
    const controls = animate(0, 1, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        value.current = v;
      },
    });
    return () => controls.stop();
  }, [reduced, duration]);

  return value;
}
