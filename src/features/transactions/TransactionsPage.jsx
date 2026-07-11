import { useState } from "react";
import { Link } from "react-router-dom";

export default function TransactionsPage() {
  const [form, setForm] = useState({
    type: "expense",
    title: "",
    amount: "",
    category: "",
    date: "",
    note: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const existing = JSON.parse(localStorage.getItem("transactions") || "[]");
    const newTx = { id: crypto.randomUUID(), ...form, amount: Number(form.amount) };
    localStorage.setItem("transactions", JSON.stringify([newTx, ...existing]));

    alert("Transaction saved!");
    setForm({
      type: "expense",
      title: "",
      amount: "",
      category: "",
      date: "",
      note: "",
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0B1020", color: "white", padding: 24 }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h1 style={{ margin: 0 }}>Add Transaction</h1>
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
            Type
            <select name="type" value={form.type} onChange={onChange} style={inputStyle}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label>
            Title
            <input name="title" value={form.title} onChange={onChange} required style={inputStyle} />
          </label>

          <label>
            Amount
            <input name="amount" type="number" step="0.01" value={form.amount} onChange={onChange} required style={inputStyle} />
          </label>

          <label>
            Category
            <input name="category" value={form.category} onChange={onChange} placeholder="Food, Salary, Bills..." style={inputStyle} />
          </label>

          <label>
            Date
            <input name="date" type="date" value={form.date} onChange={onChange} required style={inputStyle} />
          </label>

          <label>
            Note
            <textarea name="note" value={form.note} onChange={onChange} rows={3} style={inputStyle} />
          </label>

          <button
            type="submit"
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
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: 6,
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #374151",
  background: "#0F172A",
  color: "#E5E7EB",
  boxSizing: "border-box",
};