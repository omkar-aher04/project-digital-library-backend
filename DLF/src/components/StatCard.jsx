export default function StatCard({ label, value, icon, accent = "#6366f1" }) {
  return (
    <div
      style={{
        background: "#1a1d2e",
        border: "1px solid #2e3248",
        borderRadius: 12,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `${accent}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#e2e8f0" }}>{value}</div>
      </div>
    </div>
  );
}
