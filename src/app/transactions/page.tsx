import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <TransactionForm />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Historial de transacciones
        </h1>
        <Suspense fallback={<div className="text-gray-500 text-sm">Cargando...</div>}>
          <TransactionList />
        </Suspense>
      </div>
    </div>
  );
}
