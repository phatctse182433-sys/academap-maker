import { apiConfig, tokenUtils } from "../api";

const BASE = apiConfig.baseURL;

export const adminDashboardApi = {
  getOverview: async () => {
    const res = await fetch(`${BASE}/admin/dashboard/overview`, {
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${tokenUtils.get()}`,
      },
    });

    return res.json(); // ApiResponse<Map<String, Object>>
  },
};
