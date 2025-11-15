import React, { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { tokenUtils } from "@/service/api";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const AdminLayout = () => {
  const token = tokenUtils.get();
  const role = token ? tokenUtils.getUserRole(token) : null;
  const navigate = useNavigate();

  // If not authenticated, go to login
  if (!token) return <Navigate to="/login" replace />;

  // If authenticated but not an admin: show a NOT AUTHORIZED page (do NOT redirect to "/")
  if (role !== "ROLE_ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-md border border-gray-100 p-8 text-center">
          <h1 className="text-2xl font-bold text-rose-600 mb-2">Access Denied</h1>
          <p className="text-sm text-gray-600 mb-6">
            You are signed in but you don't have permission to view the admin area.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                // Go back to a safe user area or home (explicit navigation, not automatic redirect)
                navigate("/", { replace: true });
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Go to Home
            </button>

            <button
              onClick={() => {
                // Allow user to logout if they need to sign in as admin
                tokenUtils.remove();
                window.location.href = "/login";
              }}
              className="px-4 py-2 border rounded-md text-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const email = tokenUtils.getUserEmail(token);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleLogout = () => {
    tokenUtils.remove();
    window.location.href = "/login";
  };

  return (
    // Use a subtle colored background (not pure white) and ensure main content text is dark.
    <div className="flex bg-gradient-to-b from-indigo-50 to-indigo-100 min-h-screen text-sm">
      {/* SIDEBAR (dark themed so its white text is intentional and isolated) */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64 transform bg-slate-800 text-white shadow-lg transition-transform duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        aria-hidden={!sidebarOpen && window.innerWidth < 768}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-6 border-b border-slate-700">
            <div className="text-lg font-bold">ADMIN</div>
            <div className="text-xs text-slate-300 mt-0.5">System</div>
          </div>
          <div className="flex-1 overflow-auto">
            <AdminSidebar />
          </div>
        </div>
      </aside>

      {/* overlay for mobile when sidebar open */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-20 md:hidden bg-black/30"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Main area: force text-gray-900 so white text inheritance can't make content unreadable */}
      <main className="flex-1 ml-0 md:ml-64 text-gray-900">
        {/* HEADER */}
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur px-6 py-3 flex items-center justify-between gap-4 border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen((s) => !s)}
              className="p-2 rounded-md hover:bg-gray-100 md:hidden text-gray-700"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Admin Panel</h2>
              <p className="text-xs text-gray-600 hidden md:block">Overview and management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <input
                className="w-56 md:w-72 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-300"
                placeholder="Search admin area..."
                aria-label="Search"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </span>
            </div>

            <button className="p-2 rounded-lg hover:bg-gray-100 relative text-gray-700" aria-label="Notifications">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-rose-500 rounded-full">3</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((m) => !m)}
                className="flex items-center gap-3 p-1.5 rounded-md hover:bg-gray-100 text-gray-700"
                aria-expanded={menuOpen}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">
                  {email?.charAt(0)?.toUpperCase() ?? "A"}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-sm text-gray-800 truncate max-w-[140px]">{email}</span>
                  <span className="text-xs text-gray-500">Administrator</span>
                </div>
                <svg className="w-4 h-4 text-gray-500 hidden sm:block" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 overflow-hidden text-gray-900">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-gray-50">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Explicitly set the panel text color to dark so modals / forms inside inherit correctly */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-gray-900">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
