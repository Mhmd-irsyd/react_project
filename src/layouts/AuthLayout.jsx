import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 px-4 md:px-8 lg:px-12">
      <div className="w-full max-w-md m-auto bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <Outlet /> {/* Halaman Login/Register akan dirender di sini */}
      </div>
    </div>
  );
}
