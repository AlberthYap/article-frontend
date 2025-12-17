import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../lib/api.js";

export default function AddPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function set(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function submit(status) {
    // Basic submit
    setLoading(true);
    setErr("");
    try {
      await createPost({ ...form, status });
      nav("/posts");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-md border p-4">
      <h2 className="text-lg font-semibold">Add New</h2>

      {err && <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{err}</div>}

      <div className="mt-4 space-y-3">
        <div>
          <label className="text-sm text-gray-700">Title</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Content</label>
          <textarea
            rows={8}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Category</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
            disabled={loading}
            onClick={() => submit("publish")}
          >
            Publish
          </button>
          <button
            className="rounded-md border px-4 py-2 text-sm disabled:opacity-60"
            disabled={loading}
            onClick={() => submit("draft")}
          >
            Draft
          </button>
        </div>
      </div>
    </div>
  );
}
