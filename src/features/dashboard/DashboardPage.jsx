import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const refresh = () => {
      try {
        const raw = JSON.parse(localStorage.getItem("transactions") || "[]");
        setTransactions(Array.isArray(raw) ? raw : []);
      } catch {
        setTransactions([]);
      }
    };

    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

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
          <h3 style={{ marginTop: 0 }}>Expense Trend (6 months)</h3>
          <div
            style={{
              height: 240,
              background: "#0F172A",
              borderRadius: 10,
              border: "1px dashed #334155",
              display: "grid",
              placeItems: "center",
              color: "#64748B",
            }}
          >
            Line chart placeholder
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