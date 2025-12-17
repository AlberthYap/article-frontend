const BASE = import.meta.env.VITE_API_BASE_URL;

async function http(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || "Request failed");
  return json;
}


export async function listPosts(limit = 50, offset = 0) {
  return http(`/article?limit=${limit}&offset=${offset}`);
}
export async function getPost(id) {
  return http(`/article/${id}`);
}
export async function createPost(payload) {
  return http(`/article/`, { method: "POST", body: JSON.stringify(payload) });
}
export async function updatePost(id, payload) {
  return http(`/article/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}
export async function deletePost(id) {
  return http(`/article/${id}`, { method: "DELETE" });
}
