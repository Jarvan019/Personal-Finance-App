import React from "react";
import { Link } from "react-router-dom";
const cardStyle = {
  background: "#111827",
  border: "1px solid #1F2937",
  borderRadius: 14,
  padding: "16px",
  color: "#101b32",
};

const kpis = [
  { label: "Total Balance", value: "$12,480.20", color: "#3B82F6" },
  { label: "Income", value: "$6,200.00", color: "#22C55E" },
  { label: "Expenses", value: "$3,940.35", color: "#EF4444" },
  { label: "Savings Rate", value: "36.4%", color: "#A78BFA" },
];

export default function DashboardPage() {
  return (
    <div style={{ background: "#0B1020", minHeight: "100vh", padding: 24, color: "white" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Personal Finance Dashboard</h1>
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
    + Add Transaction
  </button>
</Link>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
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
          <div style={{ height: 240, background: "#0F172A", borderRadius: 10, border: "1px dashed #334155", display: "grid", placeItems: "center", color: "#64748B" }}>
            Line chart placeholder
          </div>
        </div>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Budget Progress</h3>
          {["Food", "Transport", "Bills", "Shopping"].map((c, i) => (
            <div key={c} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9CA3AF" }}>
                <span>{c}</span><span>{[72, 48, 90, 35][i]}%</span>
              </div>
              <div style={{ height: 8, background: "#1F2937", borderRadius: 99 }}>
                <div style={{ width: `${[72, 48, 90, 35][i]}%`, height: "100%", background: "#3B82F6", borderRadius: 99 }} />
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
              {[
                ["Starbucks", "Jul 10", "Food", "-$8.50"],
                ["Salary", "Jul 09", "Income", "+$2,500.00"],
                ["Uber", "Jul 09", "Transport", "-$14.20"],
                ["Electric Bill", "Jul 08", "Bills", "-$95.00"],
              ].map((t, idx) => (
                <tr key={idx} style={{ borderTop: "1px solid #1F2937" }}>
                  <td style={{ padding: "10px 0" }}>{t[0]}</td>
                  <td>{t[1]}</td>
                  <td>{t[2]}</td>
                  <td style={{ textAlign: "right", color: t[3].startsWith("+") ? "#22C55E" : "#EF4444" }}>{t[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Spending by Category</h3>
          <div style={{ height: 220, background: "#0F172A", borderRadius: 10, border: "1px dashed #334155", display: "grid", placeItems: "center", color: "#64748B" }}>
            Donut chart placeholder
          </div>
        </div>
      </section>
    </div>
  );
}