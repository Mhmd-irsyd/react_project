const signInWithEmailPassword = async (email, password) => {
  try {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY; // 🔥 Ambil API key dari .env.local
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message); // Tangani error jika ada
    }

    console.log('Login successful:', data);
    return data; // Kembalikan data jika login berhasil
  } catch (error) {
    console.error('Login failed:', error);
    throw error; // Lempar error untuk ditangani di luar fungsi
  }
};

export default signInWithEmailPassword;
