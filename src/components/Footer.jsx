import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import mandirilogo from "../assets/mandiri.png";
import bcalogo from "../assets/bca.png";
import gopayLogo from "../assets/gopay.png";
import ovoLogo from "../assets/ovo.png";

const Footer = () => {
  return (
    <motion.footer
      className="bg-gray-900 text-gray-300 py-10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Bagian 1: Tentang Kami */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold text-white">Tentang Kami</h3>
          <p className="mt-4 sm:mt-3 text-sm leading-relaxed">
            Kami adalah toko online yang menyediakan berbagai produk berkualitas dengan harga terbaik. Kepuasan pelanggan adalah prioritas utama kami.
          </p>
        </motion.div>

        {/* Bagian 2: Social Media */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold text-white">Ikuti Kami</h3>
          <div className="flex justify-center md:justify-start gap-4 mt-4 sm:mt-3">
            {[
              { icon: <FaFacebookF />, bg: "bg-blue-600" },
              { icon: <FaTwitter />, bg: "bg-blue-400" },
              { icon: <FaInstagram />, bg: "bg-pink-500" },
              { icon: <FaYoutube />, bg: "bg-red-600" },
            ].map((item, index) => (
              <motion.a
                key={index}
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-700 rounded-full text-white text-lg transition"
                whileHover={{ scale: 1.1, backgroundColor: item.bg }}
                whileTap={{ scale: 0.9 }}
              >
                {item.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Bagian 3: Metode Pembayaran */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold text-white">Metode Pembayaran</h3>
          <div className="flex justify-center md:justify-start gap-4 mt-4 sm:mt-3">
            {[bcalogo, mandirilogo, gopayLogo, ovoLogo].map((logo, index) => (
              <motion.img
                key={index}
                src={logo}
                alt="Payment Logo"
                className="h-6 sm:h-8"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bagian Copyright */}
      <motion.div
        className="border-t border-gray-700 mt-6 pt-4 text-center text-xs sm:text-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        viewport={{ once: true }}
      >
        <p>© 2025 Nama Toko. All Rights Reserved.</p>
        <p className="mt-1">
          <a href="#" className="hover:underline">Kebijakan Privasi</a> | 
          <a href="#" className="hover:underline ml-2">Syarat & Ketentuan</a>
        </p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
