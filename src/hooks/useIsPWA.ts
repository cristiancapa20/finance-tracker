"use client";

import { useEffect, useState } from "react";

function checkIsPWA(): boolean {
  const nav = window.navigator as unknown as { standalone?: boolean };

  // iOS Safari
  if (nav.standalone === true) return true;

  // Todos los demás navegadores
  const modes = ["standalone", "fullscreen", "minimal-ui"];
  if (modes.some((m) => window.matchMedia(`(display-mode: ${m})`).matches)) return true;

  // Fallback: Android Chrome a veces no reporta display-mode correctamente
  // si vino desde el homescreen sin referrer y no es un tab normal
  if (
    document.referrer === "" &&
    window.matchMedia("(max-width: 768px)").matches &&
    !window.locationbar?.visible
  ) return true;

  return false;
}

export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    setIsPWA(checkIsPWA());

    // Escuchar cambios (por si el modo cambia dinámicamente)
    const mq = window.matchMedia("(display-mode: standalone)");
    const handler = () => setIsPWA(checkIsPWA());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isPWA;
}
