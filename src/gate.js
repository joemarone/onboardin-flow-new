// src/Gate.jsx
import { useState } from "react";

// Pull password from env var or default to "changeme"
const PASS = process.env.REACT_APP_PASS || "changeme";
const isTest = process.env.NODE_ENV === 'test';

export default function Gate({ children }) {
  const [ok, setOk] = useState(isTest);
  const [v, setV] = useState("");

  if (ok) return children;

  return (
    <div style={{
      maxWidth: 480,
      margin: "10vh auto",
      padding: 24,
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: 12,
      fontFamily: "sans-serif"
    }}>
      <h2>Restricted Access</h2>
      <input
        type="password"
        placeholder="Enter password"
        value={v}
        onChange={(e) => setV(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginTop: 12,
          borderRadius: 4,
          border: "1px solid #ccc"
        }}
      />
      <button
        onClick={() => setOk(v === PASS)}
        style={{
          marginTop: 12,
          padding: "10px 16px",
          borderRadius: 4,
          background: "#111",
          color: "#fff",
          border: "none",
          cursor: "pointer"
        }}
      >
        Enter
      </button>
    </div>
  );
}