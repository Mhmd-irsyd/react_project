import { db } from "./firebase";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import axios from "axios"; // Upload ke Cloudinary

// Referensi dokumen user di Firestore
const getUserRef = (uid) => doc(db, "users", uid);

// ✅ Upload gambar profil ke Cloudinary
export async function uploadUserProfileImage(userId, file, onProgress) {
  if (!userId || !file) {
    throw new Error("uploadUserProfileImage: userId atau file tidak valid");
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_upload");
    formData.append("cloud_name", "dsvu2w2kz");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dsvu2w2kz/image/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      }
    );

    const data = response.data;

    const optimizedUrl = data.secure_url.replace(
      "/upload/",
      "/upload/q_auto,f_auto,w_300,h_300,c_fill/"
    );

    console.log("✅ File uploaded to Cloudinary:", optimizedUrl);
    return optimizedUrl;
  } catch (error) {
    console.error("🔥 Error uploading to Cloudinary:", error);
    throw error;
  }
}

// ✅ Simpan data user baru ke Firestore
export async function createUserProfile(userId, userData, file) {
  if (!userId || !userData) {
    throw new Error("createUserProfile: userId atau userData tidak valid");
  }

  try {
    let profileImageUrl = "";
    if (file) {
      profileImageUrl = await uploadUserProfileImage(userId, file, (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });
    }

    const userRef = getUserRef(userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        ...userData,
        profileImage: profileImageUrl,
        role: "user", // Default role
        createdAt: serverTimestamp(),
      });
      console.log("✅ User data saved successfully!");
    } else {
      console.warn("⚠️ User profile already exists, skipping creation.");
    }
  } catch (error) {
    await handleFirestoreError(error);
  }
}

// ✅ Ambil data user dari Firestore
export async function getUserProfile(uid) {
  if (!uid) {
    throw new Error("getUserProfile: UID tidak valid");
  }

  try {
    const userRef = getUserRef(uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.warn(`⚠️ User with UID ${uid} not found.`);
      return null;
    }
  } catch (error) {
    await handleFirestoreError(error);
  }
}

// ✅ Update data user ke Firestore
export async function updateUserProfile(uid, data, file) {
  if (!uid || !data) {
    throw new Error("updateUserProfile: UID atau data tidak valid");
  }

  try {
    let profileImageUrl = data.profileImage || "";
    if (file) {
      profileImageUrl = await uploadUserProfileImage(uid, file, (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });
    }

    const userRef = getUserRef(uid);
    await updateDoc(userRef, {
      ...data,
      profileImage: profileImageUrl,
    });
    console.log("✅ User profile updated successfully!");
  } catch (error) {
    await handleFirestoreError(error);
  }
}

// ✅ Error handler Firestore
async function handleFirestoreError(error) {
  console.error("🔥 Firestore Error:", error);

  if (error.code === "permission-denied") {
    console.error("⛔ Akses Firestore ditolak. Periksa aturan keamanan Firestore.");
  } else if (error.code === "unavailable") {
    console.error("⚠️ Firestore sedang tidak tersedia. Coba lagi nanti.");
  } else {
    console.error("❌ Error:", error.message);
  }

  throw error;
}
