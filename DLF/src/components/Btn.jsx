const BUTTON_VARIANTS = {
  primary: { background: "#6366f1", color: "#fff", border: "1px solid #4f46e5" },
  danger: { background: "#3d1515", color: "#fca5a5", border: "1px solid #7f1d1d" },
  ghost: { background: "transparent", color: "#94a3b8", border: "1px solid #2e3248" },
};

export default function Btn({ children, variant = "primary", style = {}, ...props }) {
  return (
    <button
      {...props}
      style={{
        borderRadius: 8,
        padding: "8px 16px",
        fontSize: 14,
        fontWeight: 500,
        cursor: props.disabled ? "not-allowed" : "pointer",
        transition: "opacity 0.15s",
        opacity: props.disabled ? 0.5 : 1,
        ...BUTTON_VARIANTS[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
