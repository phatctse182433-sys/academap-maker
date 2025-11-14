import { apiConfig, tokenUtils } from "../api";

const BASE = apiConfig.baseURL;

export const adminUserApi = {
  getAll: async () => {
    const res = await fetch(`${BASE}/admin/users`, {
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${tokenUtils.get()}`,
      },
    });
    return res.json(); // ApiResponse<List<User>>
  },

  getById: async (id: number) => {
    const res = await fetch(`${BASE}/admin/users/${id}`, {
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${tokenUtils.get()}`,
      },
    });
    return res.json();
  },

  create: async (data: any) => {
    const res = await fetch(`${BASE}/admin/users`, {
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
    const res = await fetch(`${BASE}/admin/users/${id}`, {
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
    const res = await fetch(`${BASE}/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${tokenUtils.get()}`,
      },
    });
    return res.json();
  },
};
