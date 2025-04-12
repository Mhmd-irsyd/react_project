import jam_tangan from "../assets/jam_tangan.jpg";
import sepatu from "../assets/sepatu.jpg";
import tas from "../assets/tas.jpg";
import smart_jam from "../assets/smart_watch.jpg";
import sneaker from "../assets/running_sneaker.jpg";
import leather_backpack from "../assets/leather_backpack.jpg";

const products = [
  {
    id: 1,
    name: "Jam Tangan Mewah",
    shortDescription: "Desain elegan dengan bahan premium",
    fullDescription: "Jam tangan mewah dengan desain elegan, material berkualitas tinggi, dan pengerjaan terbaik.",
    price: 199000,
    rating: 4.8,
    reviews: 200,
    images: [jam_tangan],
    variations: [
      { color: "Hitam", stock: 10 },
      { color: "Coklat", stock: 5 }
    ]
  },
  {
    id: 2,
    name: "Sepatu Olahraga",
    shortDescription: "Performa tinggi untuk olahraga & kasual",
    fullDescription: "Sepatu olahraga yang ringan, nyaman, dan bergaya. Cocok untuk berbagai aktivitas.",
    price: 149000,
    rating: 4.6,
    reviews: 150,
    images: [sepatu],
    variations: [
      { color: "Putih", sizes: [{ size: 40, stock: 8 }, { size: 42, stock: 6 }] },
      { color: "Hitam", sizes: [{ size: 40, stock: 5 }, { size: 42, stock: 7 }] }
    ]
  },
  {
    id: 3,
    name: "Tas Tangan Klasik",
    shortDescription: "Gaya klasik dengan ruang luas",
    fullDescription: "Tas tangan elegan berbahan kulit berkualitas tinggi, cocok untuk penggunaan sehari-hari.",
    price: 129000,
    rating: 4.7,
    reviews: 180,
    images: [tas],
    variations: [
      { color: "Hitam", stock: 12 },
      { color: "Coklat", stock: 9 }
    ]
  },
  {
    id: 4,
    name: "Jam Pintar",
    shortDescription: "Pantau kesehatan & notifikasi Anda",
    fullDescription: "Tetap terhubung dengan pemantauan kesehatan real-time dan notifikasi pintar.",
    price: 179000,
    rating: 4.5,
    reviews: 120,
    images: [smart_jam],
    variations: [
      { color: "Silver", stock: 10 },
      { color: "Hitam", stock: 7 }
    ]
  },
  {
    id: 5,
    name: "Sneakers Lari",
    shortDescription: "Desain ringan & tahan lama",
    fullDescription: "Sepatu lari berkinerja tinggi yang memberikan kenyamanan dan daya tahan maksimal.",
    price: 139000,
    rating: 4.4,
    reviews: 90,
    images: [sneaker],
    variations: [
      { color: "Putih", sizes: [{ size: 40, stock: 6 }, { size: 42, stock: 4 }] },
      { color: "Hitam", sizes: [{ size: 40, stock: 5 }, { size: 42, stock: 7 }] }
    ]
  },
  {
    id: 6,
    name: "Ransel Kulit",
    shortDescription: "Sempurna untuk bepergian & bekerja",
    fullDescription: "Ransel kulit bergaya dan tahan lama dengan banyak kompartemen penyimpanan.",
    price: 159000,
    rating: 4.9,
    reviews: 250,
    images: [leather_backpack],
    variations: [
      { color: "Coklat", stock: 15 },
      { color: "Hitam", stock: 10 }
    ]
  }
];

export default products;
