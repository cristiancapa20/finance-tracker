"use client";

import { useState, useEffect, useCallback } from "react";

type AccountType = "CASH" | "BANK" | "CREDIT_CARD" | "OTHER";

interface Account {
  id: string;
  name: string;
  type: AccountType;
  _count?: { transactions: number };
}

interface Category {
  id: string;
  name: string;
  color: string;
  isSystem: boolean;
  _count?: { transactions: number };
}

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  CASH: "Efectivo",
  BANK: "Banco",
  CREDIT_CARD: "Tarjeta de crédito",
  OTHER: "Otro",
};

const PRESET_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#F0A500", "#6C5CE7", "#A29BFE", "#B2BEC3",
  "#FD79A8", "#00B894", "#E17055", "#0984E3", "#FDCB6E",
];

export default function SettingsClient() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Account form state
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountType, setNewAccountType] = useState<AccountType>("CASH");
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountError, setAccountError] = useState("");

  // Category form state
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(PRESET_COLORS[0]);
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const fetchAccounts = useCallback(async () => {
    setLoadingAccounts(true);
    try {
      const res = await fetch("/api/accounts");
      const json = await res.json();
      setAccounts(json.data ?? []);
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      setCategories(json.data ?? []);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
    fetchCategories();
  }, [fetchAccounts, fetchCategories]);

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    setAccountError("");
    setSavingAccount(true);
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAccountName, type: newAccountType }),
      });
      if (!res.ok) {
        const json = await res.json();
        setAccountError(json.error ?? "Error al crear cuenta");
        return;
      }
      setNewAccountName("");
      setNewAccountType("CASH");
      await fetchAccounts();
    } finally {
      setSavingAccount(false);
    }
  }

  async function handleDeleteAccount(id: string) {
    const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      alert(json.error ?? "Error al eliminar cuenta");
      return;
    }
    await fetchAccounts();
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    setCategoryError("");
    setSavingCategory(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, color: newCategoryColor }),
      });
      if (!res.ok) {
        const json = await res.json();
        setCategoryError(json.error ?? "Error al crear categoría");
        return;
      }
      setNewCategoryName("");
      setNewCategoryColor(PRESET_COLORS[0]);
      await fetchCategories();
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      alert(json.error ?? "Error al eliminar categoría");
      return;
    }
    await fetchCategories();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Accounts Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Cuentas</h2>

        {/* Account list */}
        <div className="bg-white rounded-lg border border-gray-200 mb-4">
          {loadingAccounts ? (
            <p className="text-sm text-gray-500 p-4">Cargando...</p>
          ) : accounts.length === 0 ? (
            <p className="text-sm text-gray-500 p-4">No hay cuentas</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {accounts.map((account) => (
                <li
                  key={account.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{account.name}</p>
                    <p className="text-xs text-gray-500">{ACCOUNT_TYPE_LABELS[account.type]}</p>
                  </div>
                  <DeleteButton
                    onDelete={() => handleDeleteAccount(account.id)}
                    label="Eliminar cuenta"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Create account form */}
        <form onSubmit={handleCreateAccount} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Nueva cuenta</h3>
          {accountError && (
            <p className="text-sm text-red-600">{accountError}</p>
          )}
          <div>
            <label htmlFor="accountName" className="block text-xs text-gray-600 mb-1">
              Nombre
            </label>
            <input
              id="accountName"
              type="text"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ej: Cuenta corriente"
            />
          </div>
          <div>
            <label htmlFor="accountType" className="block text-xs text-gray-600 mb-1">
              Tipo
            </label>
            <select
              id="accountType"
              value={newAccountType}
              onChange={(e) => setNewAccountType(e.target.value as AccountType)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {(Object.entries(ACCOUNT_TYPE_LABELS) as [AccountType, string][]).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={savingAccount}
            className="w-full bg-indigo-600 text-white text-sm font-medium py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {savingAccount ? "Creando..." : "Crear cuenta"}
          </button>
        </form>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Categorías</h2>

        {/* Category list */}
        <div className="bg-white rounded-lg border border-gray-200 mb-4">
          {loadingCategories ? (
            <p className="text-sm text-gray-500 p-4">Cargando...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-gray-500 p-4">No hay categorías</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <p className="text-sm font-medium text-gray-800">{category.name}</p>
                    {category.isSystem && (
                      <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                        Sistema
                      </span>
                    )}
                  </div>
                  {!category.isSystem && (
                    <DeleteButton
                      onDelete={() => handleDeleteCategory(category.id)}
                      label="Eliminar categoría"
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Create category form */}
        <form onSubmit={handleCreateCategory} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Nueva categoría</h3>
          {categoryError && (
            <p className="text-sm text-red-600">{categoryError}</p>
          )}
          <div>
            <label htmlFor="categoryName" className="block text-xs text-gray-600 mb-1">
              Nombre
            </label>
            <input
              id="categoryName"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ej: Gimnasio"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewCategoryColor(color)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    newCategoryColor === color
                      ? "border-gray-800 scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">O elige un color:</span>
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                aria-label="Color personalizado"
              />
              <span
                className="inline-block w-5 h-5 rounded-full border border-gray-200"
                style={{ backgroundColor: newCategoryColor }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={savingCategory}
            className="w-full bg-indigo-600 text-white text-sm font-medium py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {savingCategory ? "Creando..." : "Crear categoría"}
          </button>
        </form>
      </section>
    </div>
  );
}

function DeleteButton({ onDelete, label }: { onDelete: () => void; label: string }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={onDelete}
          className="text-xs text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition-colors"
        >
          Confirmar
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded transition-colors"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label={label}
      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}
