import StatCard from "../components/StatCard.jsx";
import { SUB, SUB_COLORS } from "../constants.js";

export default function Dashboard({ books, users, issues }) {
  const activeIssues = issues.filter((issue) => new Date(issue.expiryDate) >= new Date()).length;

  return (
    <div>
      <h1 style={{ color: "#e2e8f0", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Dashboard</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Digital Library overview</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Books" value={books.length} icon="📚" accent="#6366f1" />
        <StatCard label="Registered Users" value={users.length} icon="👤" accent="#0ea5e9" />
        <StatCard label="Total Issues" value={issues.length} icon="🔖" accent="#f59e0b" />
        <StatCard label="Active Issues" value={activeIssues} icon="✅" accent="#10b981" />
      </div>

      <div style={{ background: "#1a1d2e", border: "1px solid #2e3248", borderRadius: 12, padding: "20px 24px" }}>
        <h3 style={{ color: "#94a3b8", fontSize: 14, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Subscription Breakdown
        </h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {SUB.map((subscription) => {
            const count = users.filter((user) => user.subscriptionType === subscription).length;
            const { bg, color, border } = SUB_COLORS[subscription];
            return (
              <div key={subscription} style={{ background: bg, border: `1px solid ${border}`, color, borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 500 }}>
                {subscription.replace("_", " ")} <span style={{ opacity: 0.7 }}>({count})</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
