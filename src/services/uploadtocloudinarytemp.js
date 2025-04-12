const uploadToCloudinary = async (file) => {
  const formData = new FormData();

  // 🌐 Logging ENV untuk debugging
  console.log("🌐 ENV Preset:", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  console.log("🌐 ENV Cloud Name:", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  try {
    // Mengirim request ke Cloudinary
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    // Mengambil response dari Cloudinary
    const data = await res.json();

    // 📦 Log response dari Cloudinary untuk debugging
    console.log("📦 Cloudinary response:", data);

    // Validasi: cek apakah secure_url ada dalam response
    if (!data.secure_url) {
      console.error("❌ Cloudinary tidak mengembalikan secure_url:", data);
      throw new Error("Upload gagal, secure_url tidak tersedia.");
    }

    return data.secure_url;
  } catch (error) {
    // Menangani error saat upload ke Cloudinary
    console.error("❌ Error saat upload ke Cloudinary:", error);
    throw error;
  }
};

export default uploadToCloudinary;
