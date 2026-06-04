import { useEffect } from "react";

const styles = {
  container: {
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 9999,
    borderRadius: 10,
    padding: "12px 18px",
    fontSize: 14,
    fontWeight: 500,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    maxWidth: 320,
    animation: "slideUp 0.25s ease",
  },
  button: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1,
  },
};

export default function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3200);
    return () => clearTimeout(timer);
  }, [onClose]);

  const theme = type === "error"
    ? { background: "#3d1515", border: "#7f1d1d", color: "#fca5a5" }
    : { background: "#153d1e", border: "#14532d", color: "#86efac" };

  return (
    <div style={{ ...styles.container, background: theme.background, border: `1px solid ${theme.border}`, color: theme.color }}>
      <span>{type === "error" ? "✕" : "✓"}</span>
      <span>{msg}</span>
      <button onClick={onClose} style={{ ...styles.button, color: theme.color }}>×</button>
    </div>
  );
}
