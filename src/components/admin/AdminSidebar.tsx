import { Link, useLocation } from "react-router-dom";

export const AdminSidebar = () => {
  const { pathname } = useLocation();

  const menu = [
    { label: "Dashboard", path: "/admin" },
    { label: "Users", path: "/admin/users" },
    { label: "Templates", path: "/admin/templates" },
    { label: "Transactions", path: "/admin/transactions" },
  ];

  return (
    <aside className="w-64 fixed left-0 top-0 h-screen bg-gray-900 text-white p-4 space-y-2">
      <h1 className="text-2xl font-bold px-3 mb-4">ADMIN</h1>

      {menu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`block px-3 py-2 rounded-md text-sm transition ${
            pathname === item.path ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
};
