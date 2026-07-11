import { useState } from "react";
import { Link } from "react-router-dom";

const CATEGORY_OPTIONS = [
  "food",
  "medicine",
  "travel",
  "bills",
  "alcohol",
  "vape",
  "ciggarette",
  "extra",
];

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

    const amount = Number(form.amount);
    if (!form.title || !form.date || !form.category || !amount || amount <= 0) {
      alert("Please complete all required fields with a valid amount.");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("transactions") || "[]");
    const newTx = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      ...form,
      amount,
    };

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
          <h1 style={{ margin: 0 }}>Add Expense</h1>
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
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              required
              style={inputStyle}
              placeholder="e.g. Grocery, Salary"
            />
          </label>

          <label>
            Amount
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={form.amount}
              onChange={onChange}
              required
              style={inputStyle}
              placeholder="0.00"
            />
          </label>

          <label>
            Category
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              required
              style={inputStyle}
            >
              <option value="" disabled>
                Select category
              </option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
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