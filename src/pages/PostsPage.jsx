import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listPosts, updatePost } from "../lib/api.js";

const TABS = [
  { key: "publish", label: "Published" },
  { key: "draft", label: "Drafts" },
  { key: "trash", label: "Trashed" },
];

export default function PostsPage() {
  const [tab, setTab] = useState("publish");
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => items.filter((p) => p.status === tab),
    [items, tab]
  );

  async function moveToTrash(p) {
    // Simple soft-trash
    try {
      setLoading(true);
      await updatePost(p.id, { title: p.title, content: p.content, category: p.category, status: "trash" });
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              tab === t.key
                ? "rounded-md bg-black px-3 py-2 text-sm text-white"
                : "rounded-md border px-3 py-2 text-sm"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {err && <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{err}</div>}
      {loading && <div className="mt-3 text-sm text-gray-500">Loading...</div>}

      <div className="mt-4 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium" style={{ width: 180 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link className="rounded-md border px-3 py-1.5 hover:bg-gray-50" to={`/posts/${p.id}`}>
                      Edit
                    </Link>
                    <button
                      className="rounded-md border border-red-200 px-3 py-1.5 text-red-700 hover:bg-red-50"
                      onClick={() => moveToTrash(p)}
                    >
                      Trash
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && !loading && (
              <tr className="border-t">
                <td className="px-4 py-6 text-center text-gray-500" colSpan={3}>
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
