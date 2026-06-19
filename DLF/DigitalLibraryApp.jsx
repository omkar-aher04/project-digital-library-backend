import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:8080";

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return text ? JSON.parse(text) : null;
}

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "books", label: "Books", icon: "📚" },
  { id: "users", label: "Users", icon: "👤" },
  { id: "issues", label: "Book Issues", icon: "🔖" },
];

const SUB = ["NOT_SUBSCRIBED", "PLUS", "PRO", "PREMIUM"];

const SUB_COLORS = {
  NOT_SUBSCRIBED: { bg: "#1e1e2e", color: "#9399b2", border: "#313244" },
  PLUS: { bg: "#1e2d40", color: "#89b4fa", border: "#1e3a5f" },
  PRO: { bg: "#2d2040", color: "#cba6f7", border: "#4a2d6e" },
  PREMIUM: { bg: "#2d3a1e", color: "#a6e3a1", border: "#3d5c2a" },
};

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  const bg = type === "error" ? "#3d1515" : "#153d1e";
  const border = type === "error" ? "#7f1d1d" : "#14532d";
  const color = type === "error" ? "#fca5a5" : "#86efac";
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: bg, border: `1px solid ${border}`, color, borderRadius: 10,
      padding: "12px 18px", fontSize: 14, fontWeight: 500,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)", display: "flex",
      alignItems: "center", gap: 10, maxWidth: 320,
      animation: "slideUp 0.25s ease",
    }}>
      <span>{type === "error" ? "✕" : "✓"}</span>
      <span>{msg}</span>
      <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.72)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#1a1d2e", border: "1px solid #2e3248", borderRadius: 14,
        padding: "28px 32px", width: "100%", maxWidth: 460,
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)", animation: "fadeIn 0.2s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 600, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 22, lineHeight: 1, padding: "0 4px" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 6, fontWeight: 500 }}>{label}</label>}
      <input {...props} style={{
        width: "100%", background: "#0f1117", border: "1px solid #2e3248",
        borderRadius: 8, padding: "9px 13px", color: "#e2e8f0", fontSize: 14,
        outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
        ...props.style,
      }}
        onFocus={e => e.target.style.borderColor = "#6366f1"}
        onBlur={e => e.target.style.borderColor = "#2e3248"}
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 6, fontWeight: 500 }}>{label}</label>}
      <select {...props} style={{
        width: "100%", background: "#0f1117", border: "1px solid #2e3248",
        borderRadius: 8, padding: "9px 13px", color: "#e2e8f0", fontSize: 14,
        outline: "none", boxSizing: "border-box",
        ...props.style,
      }}>
        {children}
      </select>
    </div>
  );
}

function Btn({ children, variant = "primary", ...props }) {
  const styles = {
    primary: { background: "#6366f1", color: "#fff", border: "1px solid #4f46e5" },
    danger: { background: "#3d1515", color: "#fca5a5", border: "1px solid #7f1d1d" },
    ghost: { background: "transparent", color: "#94a3b8", border: "1px solid #2e3248" },
  };
  return (
    <button {...props} style={{
      borderRadius: 8, padding: "8px 16px", fontSize: 14, fontWeight: 500,
      cursor: props.disabled ? "not-allowed" : "pointer", transition: "opacity 0.15s",
      opacity: props.disabled ? 0.5 : 1,
      ...styles[variant], ...props.style,
    }}>
      {children}
    </button>
  );
}

function Table({ columns, data, onDelete, emptyMsg = "No records found" }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key} style={{
                padding: "10px 16px", textAlign: "left", color: "#64748b",
                fontSize: 12, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.05em", borderBottom: "1px solid #1e2236",
                whiteSpace: "nowrap",
              }}>{c.label}</th>
            ))}
            {onDelete && <th style={{ padding: "10px 16px", borderBottom: "1px solid #1e2236" }}></th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + 1} style={{ padding: "40px 16px", textAlign: "center", color: "#3d4560" }}>{emptyMsg}</td></tr>
          ) : data.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #1a1d2e" }}
              onMouseEnter={e => e.currentTarget.style.background = "#181b2a"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {columns.map(c => (
                <td key={c.key} style={{ padding: "12px 16px", color: "#cbd5e1", verticalAlign: "middle" }}>
                  {c.render ? c.render(row[c.key], row) : (row[c.key] ?? "—")}
                </td>
              ))}
              {onDelete && (
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <button onClick={() => onDelete(row)} style={{
                    background: "none", border: "none", color: "#4a3030", cursor: "pointer",
                    fontSize: 16, padding: "2px 6px", borderRadius: 6, transition: "color 0.15s",
                  }}
                    onMouseEnter={e => e.target.style.color = "#fca5a5"}
                    onMouseLeave={e => e.target.style.color = "#4a3030"}
                  >🗑</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value, icon, accent = "#6366f1" }) {
  return (
    <div style={{
      background: "#1a1d2e", border: "1px solid #2e3248", borderRadius: 12,
      padding: "20px 24px", display: "flex", alignItems: "center", gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${accent}20`, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#e2e8f0" }}>{value}</div>
      </div>
    </div>
  );
}

// ─── Sections ───────────────────────────────────────────────────────────────

function Dashboard({ books, users, issues }) {
  const activeIssues = issues.filter(i => new Date(i.expiryDate) >= new Date()).length;
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
        <h3 style={{ color: "#94a3b8", fontSize: 14, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Subscription Breakdown</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {SUB.map(s => {
            const count = users.filter(u => u.subscriptionType === s).length;
            const { bg, color, border } = SUB_COLORS[s];
            return (
              <div key={s} style={{ background: bg, border: `1px solid ${border}`, color, borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 500 }}>
                {s.replace("_", " ")} <span style={{ opacity: 0.7 }}>({count})</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BooksSection({ toast }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", author: "", price: "", isbn: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api("/books/allbooks");
      setBooks(data || []);
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.name || !form.author || !form.price || !form.isbn) return toast("Fill all fields", "error");
    setSaving(true);
    try {
      await api("/books/addbooks", { method: "POST", body: JSON.stringify({ ...form, price: parseFloat(form.price) }) });
      toast("Book added!", "success");
      setShowAdd(false);
      setForm({ name: "", author: "", price: "", isbn: "" });
      load();
    } catch (e) { toast(e.message, "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    if (!confirm(`Delete "${row.name}"?`)) return;
    try {
      const msg = await api(`/books/${row.id}`, { method: "DELETE" });
      toast(msg || "Deleted", "success");
      load();
    } catch (e) { toast(e.message, "error"); }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Title", render: v => <span style={{ fontWeight: 500, color: "#e2e8f0" }}>{v}</span> },
    { key: "author", label: "Author" },
    { key: "isbn", label: "ISBN", render: v => <span style={{ fontFamily: "monospace", fontSize: 13, color: "#6366f1" }}>{v}</span> },
    { key: "price", label: "Price", render: v => `₹${parseFloat(v).toFixed(2)}` },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ color: "#e2e8f0", fontSize: 24, fontWeight: 700, margin: 0 }}>Books</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>{books.length} books in library</p>
        </div>
        <Btn onClick={() => setShowAdd(true)}>+ Add Book</Btn>
      </div>
      <div style={{ background: "#1a1d2e", border: "1px solid #2e3248", borderRadius: 12 }}>
        {loading ? <div style={{ padding: 40, textAlign: "center", color: "#3d4560" }}>Loading…</div>
          : <Table columns={columns} data={books} onDelete={handleDelete} emptyMsg="No books yet. Add one!" />}
      </div>
      {showAdd && (
        <Modal title="Add Book" onClose={() => setShowAdd(false)}>
          <Input label="Title" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Clean Code" />
          <Input label="Author" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder="e.g. Robert C. Martin" />
          <Input label="ISBN" value={form.isbn} onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))} placeholder="e.g. 978-0132350884" />
          <Input label="Price (₹)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 499" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn onClick={handleAdd} disabled={saving}>{saving ? "Saving…" : "Add Book"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function UsersSection({ toast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", dob: "", subscriptionType: "NOT_SUBSCRIBED" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api("/users/ ");
      setUsers(data || []);
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = async () => {
    if (!search.trim()) return load();
    try {
      const data = await api(`/users/name?firstName=${encodeURIComponent(search.trim())}`);
      setUsers(data || []);
    } catch (e) { toast(e.message, "error"); }
  };

  const handleAdd = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.dob) return toast("Fill all fields", "error");
    setSaving(true);
    try {
      await api("/users/addUser", { method: "POST", body: JSON.stringify(form) });
      toast("User added!", "success");
      setShowAdd(false);
      setForm({ firstName: "", lastName: "", email: "", dob: "", subscriptionType: "NOT_SUBSCRIBED" });
      load();
    } catch (e) { toast(e.message, "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    if (!confirm(`Delete user "${row.firstName} ${row.lastName}"?`)) return;
    try {
      const msg = await api(`/users/${row.id}`, { method: "DELETE" });
      toast(msg || "Deleted", "success");
      load();
    } catch (e) { toast(e.message, "error"); }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "firstName", label: "Name", render: (v, row) => <span style={{ fontWeight: 500, color: "#e2e8f0" }}>{v} {row.lastName}</span> },
    { key: "email", label: "Email", render: v => <span style={{ color: "#94a3b8", fontSize: 13 }}>{v}</span> },
    { key: "dob", label: "DOB" },
    {
      key: "subscriptionType", label: "Plan", render: v => {
        const { bg, color, border } = SUB_COLORS[v] || SUB_COLORS.NOT_SUBSCRIBED;
        return <span style={{ background: bg, color, border: `1px solid ${border}`, borderRadius: 6, padding: "3px 9px", fontSize: 12, fontWeight: 600 }}>{v?.replace("_", " ")}</span>;
      }
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ color: "#e2e8f0", fontSize: 24, fontWeight: 700, margin: 0 }}>Users</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>{users.length} registered users</p>
        </div>
        <Btn onClick={() => setShowAdd(true)}>+ Add User</Btn>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="Search by first name…"
          style={{
            flex: 1, background: "#1a1d2e", border: "1px solid #2e3248", borderRadius: 8,
            padding: "9px 14px", color: "#e2e8f0", fontSize: 14, outline: "none",
          }}
        />
        <Btn onClick={handleSearch}>Search</Btn>
        {search && <Btn variant="ghost" onClick={() => { setSearch(""); load(); }}>Clear</Btn>}
      </div>
      <div style={{ background: "#1a1d2e", border: "1px solid #2e3248", borderRadius: 12 }}>
        {loading ? <div style={{ padding: 40, textAlign: "center", color: "#3d4560" }}>Loading…</div>
          : <Table columns={columns} data={users} onDelete={handleDelete} emptyMsg="No users yet." />}
      </div>
      {showAdd && (
        <Modal title="Add User" onClose={() => setShowAdd(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
            <Input label="First Name" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
            <Input label="Last Name" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <Input label="Date of Birth" type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
          <Select label="Subscription" value={form.subscriptionType} onChange={e => setForm(f => ({ ...f, subscriptionType: e.target.value }))}>
            {SUB.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </Select>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn onClick={handleAdd} disabled={saving}>{saving ? "Saving…" : "Add User"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function IssuesSection({ toast }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ userId: "", bookId: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api("/bookissue/all");
      setIssues(data || []);
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.userId || !form.bookId) return toast("Fill all fields", "error");
    setSaving(true);
    try {
      await api("/bookissue/add", {
        method: "POST",
        body: JSON.stringify({
          userEntity: { id: parseInt(form.userId) },
          bookEntity: { id: parseInt(form.bookId) },
        }),
      });
      toast("Book issued!", "success");
      setShowAdd(false);
      setForm({ userId: "", bookId: "" });
      load();
    } catch (e) { toast(e.message, "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    if (!confirm("Delete this issue record?")) return;
    try {
      await api(`/bookissue/${row.id}`, { method: "DELETE" });
      toast("Issue deleted", "success");
      load();
    } catch (e) { toast(e.message, "error"); }
  };

  const isExpired = (date) => new Date(date) < new Date();

  const columns = [
    { key: "id", label: "ID" },
    { key: "userEntity", label: "User", render: v => v ? <span style={{ fontWeight: 500, color: "#e2e8f0" }}>{v.firstName} {v.lastName}</span> : "—" },
    { key: "bookEntity", label: "Book", render: v => v ? <span style={{ color: "#a5b4fc" }}>{v.name}</span> : "—" },
    { key: "issueDate", label: "Issued On" },
    {
      key: "expiryDate", label: "Expires", render: v => {
        const expired = isExpired(v);
        return <span style={{ color: expired ? "#fca5a5" : "#86efac", fontWeight: 500 }}>{v} {expired ? "(expired)" : "(active)"}</span>;
      }
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ color: "#e2e8f0", fontSize: 24, fontWeight: 700, margin: 0 }}>Book Issues</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
            {issues.filter(i => !isExpired(i.expiryDate)).length} active · {issues.filter(i => isExpired(i.expiryDate)).length} expired
          </p>
        </div>
        <Btn onClick={() => setShowAdd(true)}>+ Issue Book</Btn>
      </div>
      <div style={{ background: "#1a1d2e", border: "1px solid #2e3248", borderRadius: 12 }}>
        {loading ? <div style={{ padding: 40, textAlign: "center", color: "#3d4560" }}>Loading…</div>
          : <Table columns={columns} data={issues} onDelete={handleDelete} emptyMsg="No book issues yet." />}
      </div>
      {showAdd && (
        <Modal title="Issue a Book" onClose={() => setShowAdd(false)}>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>Enter the user ID and book ID. The issue will be valid for 14 days.</p>
          <Input label="User ID" type="number" value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))} placeholder="e.g. 1" />
          <Input label="Book ID" type="number" value={form.bookId} onChange={e => setForm(f => ({ ...f, bookId: e.target.value }))} placeholder="e.g. 3" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn onClick={handleAdd} disabled={saving}>{saving ? "Issuing…" : "Issue Book"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);

  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);

  useEffect(() => {
    api("/books/allbooks").then(d => setBooks(d || [])).catch(() => {});
    api("/users/ ").then(d => setUsers(d || [])).catch(() => {});
    api("/bookissue/all").then(d => setIssues(d || [])).catch(() => {});
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
        {/* Sidebar */}
        <aside style={{
          width: 220, background: "#141720", borderRight: "1px solid #1e2236",
          display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0,
        }}>
          <div style={{ padding: "0 20px 28px" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#e2e8f0", letterSpacing: "-0.02em" }}>
              📖 <span style={{ background: "linear-gradient(90deg,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LibraryMS</span>
            </div>
            <div style={{ fontSize: 12, color: "#3d4560", marginTop: 3 }}>Management System</div>
          </div>

          <nav style={{ flex: 1 }}>
            {TABS.map(t => {
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  width: "100%", background: active ? "#1e2236" : "none",
                  border: "none", borderLeft: `3px solid ${active ? "#6366f1" : "transparent"}`,
                  color: active ? "#e2e8f0" : "#4a5568", cursor: "pointer",
                  padding: "11px 20px", textAlign: "left", fontSize: 14,
                  fontWeight: active ? 600 : 400, display: "flex", alignItems: "center",
                  gap: 10, transition: "all 0.15s",
                }}>
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </nav>

          <div style={{ padding: "16px 20px", borderTop: "1px solid #1e2236", fontSize: 12, color: "#2e3555" }}>
            Backend: <span style={{ color: "#3d4560", fontFamily: "monospace" }}>:8080</span>
          </div>
        </aside>

        {/* Main content */}
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
