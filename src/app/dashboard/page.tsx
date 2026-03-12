import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import OnboardingModal from "@/components/OnboardingModal";
import { BarChart2, Wallet, HandCoins, Bell } from "lucide-react";

const features = [
  {
    Icon: BarChart2,
    title: "Dashboard en tiempo real",
    desc: "Visualiza ingresos y gastos con gráficos claros",
  },
  {
    Icon: Wallet,
    title: "Múltiples cuentas",
    desc: "Maneja efectivo, banco y tarjetas en un solo lugar",
  },
  {
    Icon: HandCoins,
    title: "Control de préstamos",
    desc: "Registra lo que debes y lo que te deben con facilidad",
  },
  {
    Icon: Bell,
    title: "Alertas de vencimiento",
    desc: "Recibe avisos antes de que venzan tus deudas",
  },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <OnboardingModal />

      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 rounded-2xl p-8 mb-8 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute bottom-0 -left-10 w-36 h-36 rounded-full bg-white/5" />

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white leading-tight">
            Toma el control de tus finanzas personales
          </h1>
          <p className="mt-3 text-indigo-200 text-sm leading-relaxed max-w-2xl">
            Registra gastos, gestiona tus cuentas bancarias y lleva un seguimiento claro de tus préstamos y deudas, todo en un solo lugar.
          </p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{title}</p>
                  <p className="text-indigo-300 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DashboardClient />
    </div>
  );
}
