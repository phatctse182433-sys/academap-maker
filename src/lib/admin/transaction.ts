import { apiConfig, tokenUtils } from "../api";

const BASE = apiConfig.baseURL;

export const adminTransactionApi = {
  getAll: async () => {
    const res = await fetch(`${BASE}/admin/transactions`, {
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${tokenUtils.get()}`,
      },
    });
    return res.json();
  },

  getById: async (id: number) => {
    const res = await fetch(`${BASE}/admin/transactions/${id}`, {
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${tokenUtils.get()}`,
      },
    });
    return res.json();
  },

  delete: async (id: number) => {
    const res = await fetch(`${BASE}/admin/transactions/${id}`, {
      method: "DELETE",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${tokenUtils.get()}`,
      },
    });
    return res.json();
  },
};
