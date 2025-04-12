import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminFooter from "../components/admin/AdminFooter";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      {/* Admin Navbar */}
      <AdminNavbar />

      {/* Main content area */}
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Content from child components */}
        <Outlet />
      </main>

      {/* Admin Footer */}
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
