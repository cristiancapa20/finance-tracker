"use client";

import { useIsPWA } from "@/hooks/useIsPWA";

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const isPWA = useIsPWA();

  return (
    <div
      className={`md:ml-64 flex flex-col min-h-screen transition-all ${
        isPWA
          ? "pt-0 pb-16 md:pt-0 md:pb-0"  // PWA móvil: sin top, espacio bottom nav
          : "pt-14 md:pt-0"               // Web móvil: espacio para el top bar
      }`}
    >
      {children}
    </div>
  );
}
