import { useState } from "react";

export default function LoginPage({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Default hardcoded account
    const DEFAULT_USER = { username: "admin", password: "admin" };

    if (
      form.username === DEFAULT_USER.username &&
      form.password === DEFAULT_USER.password
    ) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", form.username);
      onLoginSuccess();
      return;
    }

    setError("Invalid username or password");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #0B1020 0%, #111827 100%)",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#111827",
          border: "1px solid #1F2937",
          borderRadius: 16,
          padding: 24,
          color: "#E5E7EB",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 6, fontSize: 26 }}>Welcome back</h1>
        <p style={{ marginTop: 0, color: "#9CA3AF", marginBottom: 20 }}>
          Sign in to your Personal Finance account
        </p>

        <form onSubmit={onSubmit}>
          <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>
            Username
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={onChange}
            placeholder="admin"
            required
            style={{
              width: "100%",
              padding: "11px 12px",
              borderRadius: 10,
              border: "1px solid #374151",
              background: "#0F172A",
              color: "#E5E7EB",
              outline: "none",
              marginBottom: 14,
              boxSizing: "border-box",
            }}
          />

          <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="admin"
            required
            style={{
              width: "100%",
              padding: "11px 12px",
              borderRadius: 10,
              border: "1px solid #374151",
              background: "#0F172A",
              color: "#E5E7EB",
              outline: "none",
              marginBottom: 12,
              boxSizing: "border-box",
            }}
          />

          {error ? (
            <p style={{ color: "#FCA5A5", marginTop: 0, marginBottom: 12, fontSize: 14 }}>
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "none",
              borderRadius: 10,
              background: "#3B82F6",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </form>

        <p style={{ marginTop: 16, marginBottom: 0, color: "#9CA3AF", fontSize: 13 }}>
          Demo credentials: <strong>admin / admin</strong>
        </p>
      </div>
    </div>
  );
}