import { apiConfig, tokenUtils } from "../api";

const BASE = apiConfig.baseURL;

export const adminTemplateApi = {
  getAll: async () => {
    const res = await fetch(`${BASE}/admin/templates`, {
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${tokenUtils.get()}`,
      },
    });
    return res.json();
  },

  getById: async (id: number) => {
    const res = await fetch(`${BASE}/admin/templates/${id}`, {
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${tokenUtils.get()}`,
      },
    });
    return res.json();
  },

  create: async (data: any) => {
    const res = await fetch(`${BASE}/admin/templates`, {
      method: "POST",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${tokenUtils.get()}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id: number, data: any) => {
    const res = await fetch(`${BASE}/admin/templates/${id}`, {
      method: "PUT",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${tokenUtils.get()}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id: number) => {
    const res = await fetch(`${BASE}/admin/templates/${id}`, {
      method: "DELETE",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${tokenUtils.get()}`,
      },
    });
    return res.json();
  },
};
