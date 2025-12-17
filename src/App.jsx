import { Link, Route, Routes, Navigate } from "react-router-dom";
import PostsPage from "./pages/PostsPage.jsx";
import AddPage from "./pages/AddPage.jsx";
import EditPage from "./pages/EditPage.jsx";
import PreviewPage from "./pages/PreviewPage.jsx";

export default function App() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Sharing Vision - Posts</h1>
        <div className="flex gap-3 text-sm">
          <Link className="hover:underline" to="/posts">All Posts</Link>
          <Link className="hover:underline" to="/add">Add New</Link>
          <Link className="hover:underline" to="/preview">Preview</Link>
        </div>
      </div>

      <div className="mt-6">
        <Routes>
          <Route path="/" element={<Navigate to="/posts" replace />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/posts/:id" element={<EditPage />} />
          <Route path="/preview" element={<PreviewPage />} />
        </Routes>
      </div>
    </div>
  );
}
