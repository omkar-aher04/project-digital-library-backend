export default function Input({ label, style = {}, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 6, fontWeight: 500 }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: "100%",
          background: "#0f1117",
          border: "1px solid #2e3248",
          borderRadius: 8,
          padding: "9px 13px",
          color: "#e2e8f0",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.15s",
          ...style,
        }}
        onFocus={(event) => (event.target.style.borderColor = "#6366f1")}
        onBlur={(event) => (event.target.style.borderColor = "#2e3248")}
      />
    </div>
  );
}
