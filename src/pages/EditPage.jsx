// src/pages/EditPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deletePost, getPost, updatePost } from "../lib/api.js";

export default function EditPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({ title: "", content: "", category: "", status: "draft" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function setField(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await getPost(id);
        const p = res.data;
        setForm({
          title: p?.title || "",
          content: p?.content || "",
          category: p?.category || "",
          status: p?.status || "draft",
        });
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function save(nextStatus) {
    // Save changes
    setLoading(true);
    setErr("");
    try {
      await updatePost(id, { ...form, status: nextStatus });
      nav("/posts");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function moveToTrash() {
    // Prefer soft-delete: set status=trash
    setLoading(true);
    setErr("");
    try {
      await updatePost(id, { ...form, status: "trash" });
      nav("/posts");
    } catch (e) {
      // Fallback: hard delete if backend does not support soft delete
      try {
        await deletePost(id);
        nav("/posts");
      } catch (e2) {
        setErr(e2.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Edit Post</h2>
          <div className="text-sm text-gray-500">ID: {id}</div>
        </div>
        <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50" onClick={() => nav("/posts")}>
          Back
        </button>
      </div>

      {err && <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{err}</div>}
      {loading && <div className="mt-3 text-sm text-gray-500">Loading...</div>}

      <div className="mt-4 space-y-3">
        <div>
          <label className="text-sm text-gray-700">Title</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Content</label>
          <textarea
            rows={8}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            value={form.content}
            onChange={(e) => setField("content", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Category</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
            disabled={loading}
            onClick={() => save("publish")}
          >
            Publish
          </button>
          <button
            className="rounded-md border px-4 py-2 text-sm disabled:opacity-60"
            disabled={loading}
            onClick={() => save("draft")}
          >
            Draft
          </button>
          <button
            className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
            disabled={loading}
            onClick={moveToTrash}
          >
            Trash
          </button>
        </div>
      </div>
    </div>
  );
}
