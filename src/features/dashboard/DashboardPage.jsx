import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const cardStyle = {
  background: "#111827",
  border: "1px solid #1F2937",
  borderRadius: 14,
  padding: "16px",
  color: "#E5E7EB",
};

const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(n || 0));

// Compact currency for axis ticks, e.g. $1,200 -> $1.2k
const moneyCompact = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(n || 0));

const MONTHS_TO_SHOW = 6;

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date) {
  return date.toLocaleDateString("en-US", { month: "short" });
}

// Custom tooltip so it matches the dashboard's dark theme
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: "#0F172A",
        border: "1px solid #334155",
        borderRadius: 10,
        padding: "10px 12px",
        fontSize: 13,
      }}
    >
      <p style={{ margin: "0 0 6px 0", color: "#E5E7EB", fontWeight: 600 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ margin: "2px 0", color: p.color }}>
          {p.name}: {money(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);

  const refresh = useCallback(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("transactions") || "[]");
      setTransactions((prev) => {
        const next = Array.isArray(raw) ? raw : [];
        // Avoid pointless re-renders/chart re-draws if nothing actually changed
        return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
      });
    } catch {
      setTransactions([]);
    }
  }, []);

  useEffect(() => {
    refresh();

    // Fires when another tab changes localStorage
    window.addEventListener("storage", refresh);
    // Fires when the user tabs back into this window
    window.addEventListener("focus", refresh);
    // Fires immediately when this tab writes a transaction — dispatch this
    // from your Add Income / Add Expense pages right after saving, e.g.:
    //   localStorage.setItem("transactions", JSON.stringify(updated));
    //   window.dispatchEvent(new Event("transactions-updated"));
    window.addEventListener("transactions-updated", refresh);
    // Fallback poll so the dashboard stays live even if a page forgets
    // to dispatch the event above (cheap since refresh() no-ops on no change)
    const interval = setInterval(refresh, 2000);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("transactions-updated", refresh);
      clearInterval(interval);
    };
  }, [refresh]);

  const { income, expenses, totalBalance } = useMemo(() => {
    let inc = 0;
    let exp = 0;

    for (const tx of transactions) {
      const amount = Number(tx.amount || 0);
      if (tx.type === "income") inc += amount;
      if (tx.type === "expense") exp += amount;
    }

    return {
      income: inc,
      expenses: exp,
      totalBalance: inc - exp,
    };
  }, [transactions]);

  // Build the last N months of income vs. expenses vs. net balance
  const trendData = useMemo(() => {
    const now = new Date();
    const buckets = new Map();
    const order = [];

    for (let i = MONTHS_TO_SHOW - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = monthKey(d);
      buckets.set(key, { key, month: monthLabel(d), income: 0, expenses: 0 });
      order.push(key);
    }

    for (const tx of transactions) {
      if (!tx.date) continue;
      const d = new Date(tx.date);
      if (Number.isNaN(d.getTime())) continue;

      const key = monthKey(d);
      const bucket = buckets.get(key);
      if (!bucket) continue; // outside the visible window

      const amount = Number(tx.amount || 0);
      if (tx.type === "income") bucket.income += amount;
      if (tx.type === "expense") bucket.expenses += amount;
    }

    return order.map((key) => {
      const b = buckets.get(key);
      return { ...b, net: b.income - b.expenses };
    });
  }, [transactions]);

  const kpis = [
    { label: "Total Balance", value: money(totalBalance), color: "#3B82F6" },
    { label: "Income", value: money(income), color: "#22C55E" },
    { label: "Expenses", value: money(expenses), color: "#EF4444" },
  ];

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 8);

  return (
    <div style={{ background: "#0B1020", minHeight: "100vh", padding: 24, color: "white" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Personal Finance Dashboard</h1>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/income">
            <button
              style={{
                background: "#22C55E",
                border: "none",
                color: "white",
                padding: "10px 14px",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              + Add Income
            </button>
          </Link>

          <Link to="/transactions">
            <button
              style={{
                background: "#3B82F6",
                border: "none",
                color: "white",
                padding: "10px 14px",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              + Add Expense
            </button>
          </Link>
        </div>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 14,
          marginBottom: 14,
        }}
      >
        {kpis.map((kpi) => (
          <div key={kpi.label} style={cardStyle}>
            <p style={{ margin: 0, color: "#9CA3AF", fontSize: 13 }}>{kpi.label}</p>
            <h2 style={{ margin: "8px 0 0 0", color: kpi.color }}>{kpi.value}</h2>
          </div>
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Income vs. Expenses ({MONTHS_TO_SHOW} months)</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#1F2937" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={moneyCompact}
                  width={56}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: "#9CA3AF" }}
                  formatter={(value) => <span style={{ color: "#9CA3AF" }}>{value}</span>}
                />
                <Bar dataKey="income" name="Income" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={18} />
                <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={18} />
                <Line
                  type="monotone"
                  dataKey="net"
                  name="Net Balance"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#3B82F6" }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Budget Progress</h3>
          {["Food", "Transport", "Bills", "Shopping"].map((c, i) => (
            <div key={c} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9CA3AF" }}>
                <span>{c}</span>
                <span>{[72, 48, 90, 35][i]}%</span>
              </div>
              <div style={{ height: 8, background: "#1F2937", borderRadius: 99 }}>
                <div
                  style={{
                    width: `${[72, 48, 90, 35][i]}%`,
                    height: "100%",
                    background: "#3B82F6",
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Recent Transactions</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#D1D5DB" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#9CA3AF", fontSize: 13 }}>
                <th style={{ padding: "8px 0" }}>Name</th>
                <th>Date</th>
                <th>Category</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "12px 0", color: "#9CA3AF" }}>
                    No transactions yet. Add one to see live totals.
                  </td>
                </tr>
              ) : (
                recent.map((t, idx) => {
                  const isIncome = t.type === "income";
                  const sign = isIncome ? "+" : "-";
                  return (
                    <tr key={t.id || idx} style={{ borderTop: "1px solid #1F2937" }}>
                      <td style={{ padding: "10px 0" }}>{t.title || "-"}</td>
                      <td>{t.date || "-"}</td>
                      <td>{t.category || "-"}</td>
                      <td style={{ textAlign: "right", color: isIncome ? "#22C55E" : "#EF4444" }}>
                        {sign}
                        {money(Math.abs(Number(t.amount || 0)))}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Spending by Category</h3>
          <div
            style={{
              height: 220,
              background: "#0F172A",
              borderRadius: 10,
              border: "1px dashed #334155",
              display: "grid",
              placeItems: "center",
              color: "#64748B",
            }}
          >
            Donut chart placeholder
          </div>
        </div>
      </section>
    </div>
  );
}
