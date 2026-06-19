import { useState, useCallback, useEffect } from "react";
import { api } from "./api.js";
import { TABS } from "./constants.js";
import Dashboard from "./sections/Dashboard.jsx";
import BooksSection from "./sections/BooksSection.jsx";
import UsersSection from "./sections/UsersSection.jsx";
import IssuesSection from "./sections/IssuesSection.jsx";
import Toast from "./components/Toast.jsx";

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);

  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);

  useEffect(() => {
    api("/books/allbooks").then((data) => setBooks(data || [])).catch(() => {});
    api("/users/").then((data) => setUsers(data || [])).catch(() => {});
    api("/bookissue/all").then((data) => setIssues(data || [])).catch(() => {});
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, 'Segoe UI', system-ui, sans-serif; background: #0f1117; }
        @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn  { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2e3248; border-radius: 3px; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <aside style={{ width: 220, background: "#141720", borderRight: "1px solid #1e2236", display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 }}>
          <div style={{ padding: "0 20px 28px" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#e2e8f0", letterSpacing: "-0.02em" }}>
              📖 <span style={{ background: "linear-gradient(90deg,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LibraryMS</span>
            </div>
            <div style={{ fontSize: 12, color: "#3d4560", marginTop: 3 }}>Management System</div>
          </div>

          <nav style={{ flex: 1 }}>
            {TABS.map((tabItem) => {
              const active = tab === tabItem.id;
              return (
                <button
                  key={tabItem.id}
                  onClick={() => setTab(tabItem.id)}
                  style={{
                    width: "100%",
                    background: active ? "#1e2236" : "none",
                    border: "none",
                    borderLeft: `3px solid ${active ? "#6366f1" : "transparent"}`,
                    color: active ? "#e2e8f0" : "#4a5568",
                    cursor: "pointer",
                    padding: "11px 20px",
                    textAlign: "left",
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "all 0.15s",
                  }}
                >
                  <span>{tabItem.icon}</span>
                  {tabItem.label}
                </button>
              );
            })}
          </nav>

          <div style={{ padding: "16px 20px", borderTop: "1px solid #1e2236", fontSize: 12, color: "#2e3555" }}>
            Backend: <span style={{ color: "#3d4560", fontFamily: "monospace" }}>:8080</span>
          </div>
        </aside>

        <main style={{ flex: 1, overflow: "auto", padding: "36px 40px" }}>
          {tab === "dashboard" && <Dashboard books={books} users={users} issues={issues} />}
          {tab === "books" && <BooksSection toast={showToast} />}
          {tab === "users" && <UsersSection toast={showToast} />}
          {tab === "issues" && <IssuesSection toast={showToast} />}
        </main>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
