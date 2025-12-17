// src/pages/PreviewPage.jsx
import { useEffect, useMemo, useState } from "react";
import { listPosts } from "../lib/api.js";

export default function PreviewPage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await listPosts(200, 0);
        setItems(res.data || []);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const published = useMemo(() => items.filter((p) => p.status === "publish"), [items]);

  const totalPages = Math.max(1, Math.ceil(published.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return published.slice(start, start + pageSize);
  }, [published, safePage]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Preview (Published)</h2>
        <div className="text-sm text-gray-500">
          Total: {published.length}
        </div>
      </div>

      {err && <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{err}</div>}
      {loading && <div className="mt-3 text-sm text-gray-500">Loading...</div>}

      <div className="mt-4 space-y-3">
        {pageItems.map((p) => (
          <article key={p.id} className="rounded-md border p-4">
            <h3 className="text-base font-semibold">{p.title}</h3>
            <div className="mt-1 text-sm text-gray-500">{p.category}</div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-800">{p.content}</p>
          </article>
        ))}

        {!loading && published.length === 0 && (
          <div className="rounded-md border p-4 text-sm text-gray-500">No published posts.</div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
          disabled={safePage <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <div className="text-sm text-gray-600">
          Page {safePage} / {totalPages}
        </div>
        <button
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
          disabled={safePage >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
