"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
interface ChartLegendProps {
  payload?: { value: string; color: string }[];
}

function RoundedLegend({ payload }: ChartLegendProps) {
  if (!payload?.length) return null;
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry, i) => (
        <span key={i} className="flex items-center gap-1.5 text-sm text-gray-600">
          <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </span>
      ))}
    </div>
  );
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md px-4 py-3 text-sm">
      {label && (
        <p className="text-gray-500 text-xs mb-2 font-medium">
          {formatMonthLabel(label)}
        </p>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

interface ExpensesByCategory {
  categoryId: string;
  categoryName: string;
  color: string;
  total: number;
}

interface MonthStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: ExpensesByCategory[];
}

interface MonthlyDataPoint {
  month: string;
  income: number;
  expenses: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatMonthLabel(yyyyMm: string) {
  const [year, month] = yyyyMm.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("es-MX", { month: "short", year: "numeric" });
}

function getMonthString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function addMonths(yyyyMm: string, delta: number) {
  const [year, month] = yyyyMm.split("-").map(Number);
  const d = new Date(year, month - 1 + delta, 1);
  return getMonthString(d);
}

export default function DashboardClient() {
  const [selectedMonth, setSelectedMonth] = useState(getMonthString(new Date()));
  const [monthStats, setMonthStats] = useState<MonthStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMonthly, setLoadingMonthly] = useState(true);

  const fetchMonthStats = useCallback(async (month: string) => {
    setLoadingStats(true);
    try {
      const res = await fetch(`/api/stats?month=${month}`);
      if (res.ok) {
        const data = await res.json();
        setMonthStats(data);
      }
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchMonthlyData = useCallback(async () => {
    setLoadingMonthly(true);
    try {
      const res = await fetch("/api/stats/monthly?months=6");
      if (res.ok) {
        const data = await res.json();
        setMonthlyData(data.data);
      }
    } finally {
      setLoadingMonthly(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthStats(selectedMonth);
  }, [selectedMonth, fetchMonthStats]);

  useEffect(() => {
    fetchMonthlyData();
  }, [fetchMonthlyData]);

  const handlePrev = () => setSelectedMonth((m) => addMonths(m, -1));
  const handleNext = () => {
    const next = addMonths(selectedMonth, 1);
    if (next <= getMonthString(new Date())) {
      setSelectedMonth(next);
    }
  };
  const isCurrentMonth = selectedMonth >= getMonthString(new Date());

  const hasMonthData =
    monthStats &&
    (monthStats.totalIncome > 0 ||
      monthStats.totalExpenses > 0 ||
      monthStats.balance !== 0);

  const hasMonthlyData = monthlyData.some((d) => d.income > 0 || d.expenses > 0);

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
          aria-label="Mes anterior"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-lg font-semibold text-gray-800 min-w-[140px] text-center capitalize">
          {formatMonthLabel(selectedMonth)}
        </span>
        <button
          onClick={handleNext}
          disabled={isCurrentMonth}
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Mes siguiente"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Summary Cards */}
      {loadingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500 mb-1">Balance del mes</p>
            <p
              className={`text-2xl font-bold ${
                (monthStats?.balance ?? 0) >= 0 ? "text-indigo-600" : "text-red-600"
              }`}
            >
              {formatCurrency(monthStats?.balance ?? 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500 mb-1">Total Ingresos</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(monthStats?.totalIncome ?? 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500 mb-1">Total Gastos</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(monthStats?.totalExpenses ?? 0)}
            </p>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart - Expenses by Category */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            Gastos por categoría
          </h2>
          {loadingStats ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !hasMonthData || (monthStats?.expensesByCategory?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm">Sin transacciones en este período</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={monthStats!.expensesByCategory}
                  dataKey="total"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                >
                  {monthStats!.expensesByCategory.map((entry) => (
                    <Cell key={entry.categoryId} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend content={<RoundedLegend />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart - Last 6 months */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            Ingresos vs Gastos (últimos 6 meses)
          </h2>
          {loadingMonthly ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !hasMonthlyData ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm">Sin transacciones en este período</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonthLabel}
                  tick={{ fontSize: 11 }}
                />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<ChartTooltip />} />
                <Legend content={<RoundedLegend />} />
                <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="expenses" name="Gastos" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
