import { useEffect, useMemo, useState } from "react";
import { adminUserApi } from "@/lib/admin/user";

const avatarBg = (s: string) => {
  const colors = ["bg-indigo-500", "bg-emerald-500", "bg-rose-500", "bg-sky-500", "bg-yellow-500"];
  return colors[s.charCodeAt(0) % colors.length];
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminUserApi.getAll();
      setUsers(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        String(u.id).includes(q) ||
        (u.mail || "").toLowerCase().includes(q) ||
        (u.fullName || "").toLowerCase().includes(q) ||
        (u.username || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  // hide admin accounts from User management view
  const filteredNoAdmin = useMemo(() => filtered.filter((u) => (u.role || "").toUpperCase() !== "ADMIN"), [filtered]);

  const pages = Math.max(1, Math.ceil(filteredNoAdmin.length / perPage));
  const pageItems = filteredNoAdmin.slice((page - 1) * perPage, page * perPage);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = {
      mail: String(form.get("mail") || "").trim(),
      fullName: String(form.get("fullName") || "").trim(),
      username: String(form.get("username") || "").trim(),
      password: String(form.get("password") || "").trim(),
      role: String(form.get("role") || "USER"),
      userStatus: String(form.get("userStatus") || "ACTIVE"),
    };

    try {
      if (editing) {
        await adminUserApi.update(editing.id, payload);
      } else {
        await adminUserApi.create(payload);
      }
      setModalOpen(false);
      setEditing(null);
      setPage(1);
      await load();
    } catch (err) {
      // simple feedback, keep minimal
      alert("Save failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xác nhận xóa người dùng này?")) return;
    try {
      await adminUserApi.delete(id);
      await load();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý người dùng hệ thống</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white text-gray-900 placeholder-gray-400"
              placeholder="Search by email, name, username, role..."
              aria-label="Search users"
            />
            <button
              onClick={() => { setQuery(""); setPage(1); }}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-sm text-gray-500 px-2 py-1"
              aria-label="Clear"
            >
              Reset
            </button>
          </div>

          <button onClick={openNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700">
            + Add User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm text-gray-500">User</th>
                <th className="p-3 text-left text-sm text-gray-500">Email</th>
                <th className="p-3 text-left text-sm text-gray-500">Role</th>
                <th className="p-3 text-left text-sm text-gray-500">Status</th>
                <th className="p-3 text-right text-sm text-gray-500">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: perPage }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-3"><div className="h-6 bg-gray-200 rounded w-32" /></td>
                    <td className="p-3"><div className="h-6 bg-gray-200 rounded w-48" /></td>
                    <td className="p-3"><div className="h-6 bg-gray-200 rounded w-20" /></td>
                    <td className="p-3"><div className="h-6 bg-gray-200 rounded w-20" /></td>
                    <td className="p-3 text-right"><div className="h-8 inline-block bg-gray-200 rounded w-24" /></td>
                  </tr>
                ))
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">Không có người dùng</td>
                </tr>
              ) : (
                pageItems.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium ${avatarBg(String(u.fullName || u.mail || u.username || "a"))}`}>
                        {(u.fullName || u.mail || u.username || "U").charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{u.fullName || u.username || "-"}</div>
                        <div className="text-xs text-gray-500">{u.username ? `@${u.username}` : ""}</div>
                      </div>
                    </td>

                    <td className="p-3 text-sm text-gray-700">{u.mail}</td>
                    <td className="p-3 text-sm text-gray-700">{u.role}</td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.userStatus === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                        {u.userStatus || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => { setEditing(u); setModalOpen(true); }}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{Math.min(filtered.length, (page - 1) * perPage + 1)}</span> - <span className="font-medium">{Math.min(filtered.length, page * perPage)}</span> of <span className="font-medium">{filtered.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md border bg-white disabled:opacity-50"
            >
              Prev
            </button>
            <div className="text-sm text-gray-700 px-2">Page</div>
            <input
              className="w-12 text-center border rounded-md px-2 py-1 bg-white text-gray-900 placeholder-gray-400"
              value={page}
              onChange={(e) => {
                const v = Number(e.target.value || 1);
                if (!isNaN(v)) setPage(Math.max(1, Math.min(pages, v)));
              }}
            />
            <div className="text-sm text-gray-700 px-2">/ {pages}</div>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="px-3 py-1 rounded-md border bg-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden text-gray-900"
          >
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing ? "Edit User" : "New User"}</h2>
              <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="px-6 py-4 space-y-3">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input name="mail" defaultValue={editing?.mail} required className="w-full mt-1 px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Full name</label>
                <input name="fullName" defaultValue={editing?.fullName} className="w-full mt-1 px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Username</label>
                  <input name="username" defaultValue={editing?.username} className="w-full mt-1 px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Role</label>
                  <select name="role" defaultValue={editing?.role || "USER"} className="w-full mt-1 px-3 py-2 border rounded-lg">
                    <option value="USER">USER</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Password {editing ? "(leave blank to keep)" : ""}</label>
                  <input name="password" type="password" className="w-full mt-1 px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <select name="userStatus" defaultValue={editing?.userStatus || "ACTIVE"} className="w-full mt-1 px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-2">
              <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className="px-4 py-2 rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
