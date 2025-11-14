import { useEffect, useState } from "react";
import { adminTemplateApi } from "@/lib/admin/template";

const AdminTemplatesPage = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminTemplateApi.getAll();
      setTemplates(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const payload = {
      title: String(form.get("title") || "").trim(),
      description: String(form.get("description") || "").trim(),
      content: String(form.get("content") || "").trim(),
      price: Number(form.get("price") || 0),
    };

    if (editing) {
      await adminTemplateApi.update(editing.templateId, payload);
    } else {
      await adminTemplateApi.create(payload);
    }

    setModal(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Confirm delete this template?")) return;
    await adminTemplateApi.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Templates</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditing(null);
            setModal(true);
          }}
        >
          + Add Template
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 text-sm text-gray-500">ID</th>
              <th className="p-3 text-sm text-gray-500">Title</th>
              <th className="p-3 text-sm text-gray-500">Price</th>
              <th className="p-3 text-sm text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : templates.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No templates
                </td>
              </tr>
            ) : (
              templates.map((t) => (
                <tr key={t.templateId} className="border-t hover:bg-gray-50">
                  <td className="p-3">{t.templateId}</td>
                  <td className="p-3">{t.title}</td>
                  <td className="p-3">{t.price}</td>
                  <td className="p-3 space-x-2">
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                      onClick={() => {
                        setEditing(t);
                        setModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded"
                      onClick={() => handleDelete(t.templateId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      { /* change modal form to force dark text and ensure inputs use white bg + dark text */ }
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm z-50">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-white text-gray-900 rounded-lg shadow-xl p-6 space-y-4"
          >
            <h2 className="text-xl font-bold">
              {editing ? "Edit Template" : "New Template"}
            </h2>

            <input
              name="title"
              placeholder="Title"
              defaultValue={editing?.title}
              className="border p-2 w-full rounded bg-white text-gray-900 placeholder-gray-400"
            />
            <input
              name="description"
              placeholder="Short description"
              defaultValue={editing?.description}
              className="border p-2 w-full rounded bg-white text-gray-900 placeholder-gray-400"
            />
            <textarea
              name="content"
              placeholder="Content"
              defaultValue={editing?.content}
              className="border p-2 w-full rounded h-32 bg-white text-gray-900 placeholder-gray-400"
            />
            <input
              name="price"
              type="number"
              placeholder="Price"
              defaultValue={editing?.price}
              className="border p-2 w-full rounded bg-white text-gray-900 placeholder-gray-400"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModal(false)}
                className="px-3 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminTemplatesPage;
