import { useState, useEffect, useCallback } from "react";
import { api } from "../api.js";
import Btn from "../components/Btn.jsx";
import Input from "../components/Input.jsx";
import Modal from "../components/Modal.jsx";
import Select from "../components/Select.jsx";
import Table from "../components/Table.jsx";
import { SUB, SUB_COLORS } from "../constants.js";

export default function UsersSection({ toast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", dob: "", subscriptionType: "NOT_SUBSCRIBED" });
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const data = await api("/users/");
      setUsers(data || []);
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = async () => {
    if (!search.trim()) return loadUsers();

    try {
      const data = await api(`/users/name?firstName=${encodeURIComponent(search.trim())}`);
      setUsers(data || []);
    } catch (error) {
      toast(error.message, "error");
    }
  };

  const handleAdd = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.dob) {
      return toast("Fill all fields", "error");
    }

    setSaving(true);
    try {
      await api("/users/addUser", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast("User added!", "success");
      setShowAdd(false);
      setForm({ firstName: "", lastName: "", email: "", dob: "", subscriptionType: "NOT_SUBSCRIBED" });
      loadUsers();
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!confirm(`Delete user "${row.firstName} ${row.lastName}"?`)) return;

    try {
      const msg = await api(`/users/${row.id}`, { method: "DELETE" });
      toast(msg || "Deleted", "success");
      loadUsers();
    } catch (error) {
      toast(error.message, "error");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "firstName",
      label: "Name",
      render: (value, row) => (
        <span style={{ fontWeight: 500, color: "#e2e8f0" }}>{value} {row.lastName}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (value) => <span style={{ color: "#94a3b8", fontSize: 13 }}>{value}</span>,
    },
    { key: "dob", label: "DOB" },
    {
      key: "subscriptionType",
      label: "Plan",
      render: (value) => {
        const { bg, color, border } = SUB_COLORS[value] || SUB_COLORS.NOT_SUBSCRIBED;
        return (
          <span style={{ background: bg, color, border: `1px solid ${border}`, borderRadius: 6, padding: "3px 9px", fontSize: 12, fontWeight: 600 }}>
            {value?.replace("_", " ")}
          </span>
        );
      },
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
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSearch()}
          placeholder="Search by first name…"
          style={{
            flex: 1,
            background: "#1a1d2e",
            border: "1px solid #2e3248",
            borderRadius: 8,
            padding: "9px 14px",
            color: "#e2e8f0",
            fontSize: 14,
            outline: "none",
          }}
        />
        <Btn onClick={handleSearch}>Search</Btn>
        {search && <Btn variant="ghost" onClick={() => { setSearch(""); loadUsers(); }}>Clear</Btn>}
      </div>

      <div style={{ background: "#1a1d2e", border: "1px solid #2e3248", borderRadius: 12 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#3d4560" }}>Loading…</div>
        ) : (
          <Table columns={columns} data={users} onDelete={handleDelete} emptyMsg="No users yet." />
        )}
      </div>

      {showAdd && (
        <Modal title="Add User" onClose={() => setShowAdd(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
            <Input label="First Name" value={form.firstName} onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))} />
            <Input label="Last Name" value={form.lastName} onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))} />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
          <Input label="Date of Birth" type="date" value={form.dob} onChange={(event) => setForm((prev) => ({ ...prev, dob: event.target.value }))} />
          <Select label="Subscription" value={form.subscriptionType} onChange={(event) => setForm((prev) => ({ ...prev, subscriptionType: event.target.value }))}>
            {SUB.map((subscription) => (
              <option key={subscription} value={subscription}>{subscription.replace("_", " ")}</option>
            ))}
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
