import { useState, useEffect, useCallback } from "react";
import { api } from "../api.js";
import Btn from "../components/Btn.jsx";
import Input from "../components/Input.jsx";
import Modal from "../components/Modal.jsx";
import Table from "../components/Table.jsx";

function isExpired(dateString) {
  return new Date(dateString) < new Date();
}

export default function IssuesSection({ toast }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ userId: "", bookId: "" });
  const [saving, setSaving] = useState(false);

  const loadIssues = useCallback(async () => {
    try {
      const data = await api("/bookissue/all");
      setIssues(data || []);
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  const handleAdd = async () => {
    if (!form.userId || !form.bookId) {
      return toast("Fill all fields", "error");
    }

    setSaving(true);
    try {
      await api("/bookissue/add", {
        method: "POST",
        body: JSON.stringify({ userId: parseInt(form.userId, 10), bookId: parseInt(form.bookId, 10) }),
      });
      toast("Book issued!", "success");
      setShowAdd(false);
      setForm({ userId: "", bookId: "" });
      loadIssues();
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!confirm("Delete this issue record?")) return;

    try {
      await api(`/bookissue/${row.id}`, { method: "DELETE" });
      toast("Issue deleted", "success");
      loadIssues();
    } catch (error) {
      toast(error.message, "error");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "userEntity",
      label: "User",
      render: (entity) =>
        entity ? <span style={{ fontWeight: 500, color: "#e2e8f0" }}>{entity.firstName} {entity.lastName}</span> : "—",
    },
    {
      key: "bookEntity",
      label: "Book",
      render: (entity) => (entity ? <span style={{ color: "#a5b4fc" }}>{entity.name}</span> : "—"),
    },
    { key: "issueDate", label: "Issued On" },
    {
      key: "expiryDate",
      label: "Expires",
      render: (value) => {
        const expired = isExpired(value);
        return (
          <span style={{ color: expired ? "#fca5a5" : "#86efac", fontWeight: 500 }}>
            {value} {expired ? "(expired)" : "(active)"}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ color: "#e2e8f0", fontSize: 24, fontWeight: 700, margin: 0 }}>Book Issues</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
            {issues.filter((issue) => !isExpired(issue.expiryDate)).length} active · {issues.filter((issue) => isExpired(issue.expiryDate)).length} expired
          </p>
        </div>
        <Btn onClick={() => setShowAdd(true)}>+ Issue Book</Btn>
      </div>

      <div style={{ background: "#1a1d2e", border: "1px solid #2e3248", borderRadius: 12 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#3d4560" }}>Loading…</div>
        ) : (
          <Table columns={columns} data={issues} onDelete={handleDelete} emptyMsg="No book issues yet." />
        )}
      </div>

      {showAdd && (
        <Modal title="Issue a Book" onClose={() => setShowAdd(false)}>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
            Enter the user ID and book ID. The issue will be valid for 14 days.
          </p>
          <Input
            label="User ID"
            type="number"
            value={form.userId}
            onChange={(event) => setForm((prev) => ({ ...prev, userId: event.target.value }))}
            placeholder="e.g. 1"
          />
          <Input
            label="Book ID"
            type="number"
            value={form.bookId}
            onChange={(event) => setForm((prev) => ({ ...prev, bookId: event.target.value }))}
            placeholder="e.g. 3"
          />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn onClick={handleAdd} disabled={saving}>{saving ? "Issuing…" : "Issue Book"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
