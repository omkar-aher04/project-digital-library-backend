import { useState, useEffect, useCallback } from "react";
import { api } from "../api.js";
import Btn from "../components/Btn.jsx";
import Input from "../components/Input.jsx";
import Modal from "../components/Modal.jsx";
import Table from "../components/Table.jsx";

export default function BooksSection({ toast }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", author: "", price: "", isbn: "" });
  const [saving, setSaving] = useState(false);

  const loadBooks = useCallback(async () => {
    try {
      const data = await api("/books/allbooks");
      setBooks(data || []);
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleAdd = async () => {
    if (!form.name || !form.author || !form.price || !form.isbn) {
      return toast("Fill all fields", "error");
    }

    setSaving(true);
    try {
      await api("/books/addbooks", {
        method: "POST",
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      });
      toast("Book added!", "success");
      setShowAdd(false);
      setForm({ name: "", author: "", price: "", isbn: "" });
      loadBooks();
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!confirm(`Delete "${row.name}"?`)) return;

    try {
      const msg = await api(`/books/${row.id}`, { method: "DELETE" });
      toast(msg || "Deleted", "success");
      loadBooks();
    } catch (error) {
      toast(error.message, "error");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "name",
      label: "Title",
      render: (value) => <span style={{ fontWeight: 500, color: "#e2e8f0" }}>{value}</span>,
    },
    { key: "author", label: "Author" },
    {
      key: "isbn",
      label: "ISBN",
      render: (value) => <span style={{ fontFamily: "monospace", fontSize: 13, color: "#6366f1" }}>{value}</span>,
    },
    {
      key: "price",
      label: "Price",
      render: (value) => `₹${parseFloat(value).toFixed(2)}`,
    },
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
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#3d4560" }}>Loading…</div>
        ) : (
          <Table columns={columns} data={books} onDelete={handleDelete} emptyMsg="No books yet. Add one!" />
        )}
      </div>

      {showAdd && (
        <Modal title="Add Book" onClose={() => setShowAdd(false)}>
          <Input label="Title" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="e.g. Clean Code" />
          <Input label="Author" value={form.author} onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))} placeholder="e.g. Robert C. Martin" />
          <Input label="ISBN" value={form.isbn} onChange={(event) => setForm((prev) => ({ ...prev, isbn: event.target.value }))} placeholder="e.g. 978-0132350884" />
          <Input label="Price (₹)" type="number" value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} placeholder="e.g. 499" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn onClick={handleAdd} disabled={saving}>{saving ? "Saving…" : "Add Book"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
