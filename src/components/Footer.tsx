"use client";

import { Link } from "next-view-transitions";
import { Github, Linkedin, Instagram, Globe } from "lucide-react";
import { useIsPWA } from "@/hooks/useIsPWA";

const socialLinks = [
  { href: "https://github.com/cristiancapa20",           icon: Github,    label: "GitHub" },
  { href: "https://www.linkedin.com/in/cristian-capa/", icon: Linkedin,  label: "LinkedIn" },
  { href: "https://www.instagram.com/capita_cr",        icon: Instagram, label: "Instagram" },
  { href: "https://portafolio-web-cr.vercel.app/",      icon: Globe,     label: "Portafolio" },
];

const navLinks = [
  { href: "/dashboard",    label: "Dashboard" },
  { href: "/historial",    label: "Transacciones" },
  { href: "/transactions", label: "Nueva transferencia" },
  { href: "/loans",        label: "Préstamos" },
  { href: "/cuentas",      label: "Cuentas" },
  { href: "/help",         label: "Guía de uso" },
];

export default function Footer() {
  const isPWA = useIsPWA();

  if (isPWA) return null;

  return (
    <footer className="mt-12 border-t border-gray-200 py-10 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Columna 1: Nombre de la app */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-gray-900 text-base">Finance Tracker</h3>
          <p className="text-gray-400 leading-relaxed">
            Controla tus finanzas personales: gastos, ingresos, cuentas y préstamos.
          </p>
        </div>

        {/* Columna 2: Secciones de la app */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-gray-900 text-base">Servicios</h3>
          <ul className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 3: Redes sociales + autor */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-gray-900 text-base">Sígueme</h3>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-gray-900 hover:text-indigo-600 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <p className="text-gray-400">
            © {new Date().getFullYear()} — Hecho por{" "}
            <span className="font-medium text-gray-600">Cristian Capa</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
