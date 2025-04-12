import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile, updateUserProfile, uploadUserProfileImage } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

export default function Settings() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    photoURL: "",
  });

  const [originalData, setOriginalData] = useState(null); // ✅ Untuk membandingkan data lama
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // ✅ progress upload

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      localStorage.setItem("currentPage", "/settings");

      const fetchUserData = async () => {
        try {
          const data = await getUserProfile(currentUser.uid);
          if (data) {
            const initialData = {
              fullName: data.fullName || "",
              dob: data.dob || "",
              gender: data.gender || "",
              photoURL: data.photoURL || "",
            };

            setFormData(initialData);
            setOriginalData(initialData); // ✅ Simpan data awal

            if (data.photoURL) {
              setPreviewImage(data.photoURL);
            }
          }
        } catch (error) {
          Swal.fire("Kesalahan", "Gagal memuat data pengguna.", "error");
        }
      };

      fetchUserData();
    }
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!validTypes.includes(file.type)) {
        Swal.fire("Format Tidak Didukung", "Hanya boleh JPG, JPEG, dan PNG.", "warning");
        return;
      }

      if (file.size > maxSize) {
        Swal.fire("File Terlalu Besar", "Ukuran maksimum adalah 2MB.", "warning");
        return;
      }

      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updatedData = { ...formData };
      let isChanged = false;

      // ✅ Cek perubahan pada form
      if (
        originalData.fullName !== formData.fullName ||
        originalData.dob !== formData.dob ||
        originalData.gender !== formData.gender
      ) {
        isChanged = true;
      }

      // ✅ Cek kalau ada file yang dipilih
      if (selectedFile) {
        const imageUrl = await uploadUserProfileImage(
          currentUser.uid,
          selectedFile,
          (percent) => setUploadProgress(percent)
        );
        updatedData.photoURL = imageUrl;
        isChanged = true;
      }

      if (!isChanged) {
        Swal.fire("Tidak ada perubahan", "Data profil tidak berubah.", "info");
        return;
      }

      await updateUserProfile(currentUser.uid, updatedData);

      Swal.fire({
        title: "Berhasil!",
        text: "Profil berhasil diperbarui!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // ✅ Update originalData dan reset file upload
      setOriginalData(updatedData);
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      Swal.fire("Kesalahan", "Terjadi kesalahan saat memperbarui profil. Silakan coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;


  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-24">
      <h2 className="text-2xl font-semibold text-center mb-6">Edit Profil</h2>
  
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ Input Upload Foto */}
        <div className="text-center">
          {previewImage ? (
            <div className="w-28 h-28 mx-auto mb-4 rounded-full border-4 border-blue-500 overflow-hidden flex items-center justify-center">
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-28 h-28 mx-auto mb-4 rounded-full border-4 border-gray-300 bg-gray-200 overflow-hidden flex items-center justify-center">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
  
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600"
          />
  
          {/* ✅ Progress Bar saat upload */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-sm text-gray-500 text-center mt-1">{uploadProgress}%</p>
            </div>
          )}
        </div>
  
        {/* ✅ Nama Lengkap */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            id="fullName"
            className="mt-1 p-3 border border-gray-300 rounded w-full"
            placeholder="Masukkan nama lengkap"
          />
        </div>
  
        {/* ✅ Tanggal Lahir */}
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
            Tanggal Lahir
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            required
            id="dob"
            className="mt-1 p-3 border border-gray-300 rounded w-full"
          />
        </div>
  
        {/* ✅ Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Jenis Kelamin
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
            id="gender"
            className="mt-1 p-3 border border-gray-300 rounded w-full"
          >
            <option value="" disabled>Pilih Jenis Kelamin</option>
            <option value="Male">Laki-laki</option>
            <option value="Female">Perempuan</option>
            <option value="Other">Lainnya</option>
          </select>
        </div>
  
        {/* ✅ Tombol Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
  
  
}
