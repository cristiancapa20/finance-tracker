import {
  Utensils,
  Coffee,
  Car,
  Heart,
  ShoppingBag,
  Home,
  Briefcase,
  Plane,
  Dumbbell,
  BookOpen,
  Zap,
  Music,
  PiggyBank,
  Tag,
  Laptop,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const categoryIconMap: { keywords: string[]; Icon: LucideIcon }[] = [
  { keywords: ["comida", "aliment", "restaur", "super", "mercado", "taco", "pizza"], Icon: Utensils },
  { keywords: ["café", "cafe", "coffee"], Icon: Coffee },
  { keywords: ["transport", "auto", "carro", "gasolina", "uber", "taxi", "bus"], Icon: Car },
  { keywords: ["salud", "médic", "medic", "farmac", "doctor", "hospital"], Icon: Heart },
  { keywords: ["ropa", "vestim", "moda", "tienda", "shopping", "compra"], Icon: ShoppingBag },
  { keywords: ["tecnolog", "laptop", "celular", "telefono", "teléfono", "comput", "electro", "gadget", "movil", "móvil"], Icon: Laptop },
  { keywords: ["vivienda", "hogar", "casa", "renta", "rent", "mueble", "limpiez", "departamento", "depa"], Icon: Home },
  { keywords: ["trabajo", "sueldo", "salario", "nómina", "nomina", "ingreso", "ingres"], Icon: Briefcase },
  { keywords: ["viaje", "vuelo", "hotel", "vacacion"], Icon: Plane },
  { keywords: ["deporte", "gym", "gimnasio", "ejercicio"], Icon: Dumbbell },
  { keywords: ["educac", "escuela", "curso", "libro", "univers"], Icon: BookOpen },
  { keywords: ["servic", "luz", "agua", "internet", "teléfon", "telefon"], Icon: Zap },
  { keywords: ["musica", "música", "spotify", "netflix", "suscripc", "entret"], Icon: Music },
  { keywords: ["ahorro", "invers", "fondo"], Icon: PiggyBank },
];

export function getCategoryIcon(name: string): LucideIcon {
  const lower = name.toLowerCase();
  for (const { keywords, Icon } of categoryIconMap) {
    if (keywords.some((k) => lower.includes(k))) return Icon;
  }
  return Tag;
}
