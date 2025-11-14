import { useEffect, useState } from "react";
import { adminTransactionApi } from "@/lib/admin/transaction";

const currency = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminTransactionApi.getAll();
      setTransactions(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Confirm delete this transaction?")) return;
    await adminTransactionApi.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button onClick={load} className="px-3 py-2 bg-white border rounded text-sm">Refresh</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 text-sm text-gray-500">ID</th>
              <th className="p-3 text-sm text-gray-500">User</th>
              <th className="p-3 text-sm text-gray-500">Amount</th>
              <th className="p-3 text-sm text-gray-500">Status</th>
              <th className="p-3 text-sm text-gray-500">Created</th>
              <th className="p-3 text-sm text-gray-500">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">No transactions</td></tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.transactionId} className="border-t hover:bg-gray-50">
                  <td className="p-3">{t.transactionId}</td>
                  <td className="p-3">{t.user?.fullName || t.user?.username}</td>
                  <td className="p-3">{currency.format(Number(t.amount) || 0)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{t.createdAt}</td>

                  <td className="p-3">
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded"
                      onClick={() => handleDelete(t.transactionId)}
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
    </div>
  );
};

export default AdminTransactionsPage;
