// src/pages/admin/Dashboard.jsx

import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">👑 Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang, admin! Kelola aplikasi dari sini.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">📊 Statistik</h2>
            <p className="text-gray-700">Lihat data pengguna, trafik, dan aktivitas terbaru.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-green-600 mb-2">👥 Manajemen Pengguna</h2>
            <p className="text-gray-700">Kelola user, ubah peran, dan pantau aktivitas mereka.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">⚙️ Pengaturan</h2>
            <p className="text-gray-700">Atur preferensi aplikasi dan konfigurasi sistem.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
