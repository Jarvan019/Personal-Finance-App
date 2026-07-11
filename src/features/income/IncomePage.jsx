import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const INCOME_CATEGORIES = ["salary", "bonus", "freelance"];

export default function IncomePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    note: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const amount = Number(form.amount);
    if (!form.title || !form.date || !form.category || !amount || amount <= 0) {
      alert("Please fill Title, Category, Date, and valid Amount.");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("transactions") || "[]");

    const newTx = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      type: "income",
      title: form.title,
      amount,
      category: form.category,
      date: form.date,
      note: form.note || "",
      created_at: new Date().toISOString(),
    };

    localStorage.setItem("transactions", JSON.stringify([newTx, ...existing]));
    alert("Income added!");
    navigate("/dashboard");
  };

  return (
    <div style={{ background: "#0B1020", minHeight: "100vh", padding: 24, color: "white" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h1 style={{ margin: 0 }}>Add Income</h1>
          <Link to="/dashboard" style={{ color: "#93C5FD", textDecoration: "none" }}>
            ← Back to Dashboard
          </Link>
        </div>

        <form
          onSubmit={onSubmit}
          style={{
            background: "#111827",
            border: "1px solid #1F2937",
            borderRadius: 14,
            padding: 16,
            display: "grid",
            gap: 12,
          }}
        >
          <label>
            <div style={{ marginBottom: 6, color: "#9CA3AF" }}>Title</div>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Salary payment"
              style={inputStyle}
              required
            />
          </label>

          <label>
            <div style={{ marginBottom: 6, color: "#9CA3AF" }}>Amount</div>
            <input
              name="amount"
              value={form.amount}
              onChange={onChange}
              type="number"
              step="0.01"
              min="0.01"
              placeholder="2500"
              style={inputStyle}
              required
            />
          </label>

          <label>
            <div style={{ marginBottom: 6, color: "#9CA3AF" }}>Category</div>
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              style={inputStyle}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {INCOME_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <div style={{ marginBottom: 6, color: "#9CA3AF" }}>Date</div>
            <input
              name="date"
              value={form.date}
              onChange={onChange}
              type="date"
              style={inputStyle}
              required
            />
          </label>

          <label>
            <div style={{ marginBottom: 6, color: "#9CA3AF" }}>Note</div>
            <textarea
              name="note"
              value={form.note}
              onChange={onChange}
              rows={3}
              placeholder="Optional note..."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </label>

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button type="submit" style={{ ...btnStyle, background: "#22C55E" }}>
              + Save Income
            </button>
            <Link to="/dashboard">
              <button type="button" style={{ ...btnStyle, background: "#374151" }}>
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "#0F172A",
  color: "white",
  border: "1px solid #334155",
  borderRadius: 10,
  padding: "10px 12px",
  outline: "none",
};

const btnStyle = {
  border: "none",
  color: "white",
  padding: "10px 14px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600,
};