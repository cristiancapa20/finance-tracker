"use client";

import { useEffect, useState } from "react";

export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const nav = window.navigator as unknown as { standalone?: boolean };

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches ||
      nav.standalone === true; // iOS Safari

    setIsPWA(isStandalone);
  }, []);

  return isPWA;
}
