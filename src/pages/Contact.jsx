import { motion } from "framer-motion";
import { 
  FaInstagram, FaFacebook, FaYoutube, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaWhatsapp, FaLinkedin, FaTelegram 
} from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      {/* Header */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="text-4xl font-bold text-gray-800 mb-4 text-center"
      >
        Kontak Kami
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }} 
        className="text-gray-600 text-center mb-8 max-w-lg"
      >
        Kami siap membantu! Hubungi kami melalui email, telepon, atau media sosial kami di bawah ini.
      </motion.p>

      {/* Contact Information */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5, delay: 0.4 }} 
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg"
      >
        {/* Email */}
        <div className="flex items-center space-x-3 mb-4">
          <FaEnvelope className="text-xl text-red-500" />
          <p className="text-gray-700">irsyadmuhammad4321@gmail.com</p>
        </div>
        
        {/* Phone Number */}
        <div className="flex items-center space-x-3 mb-4">
          <FaPhone className="text-xl text-green-500" />
          <p className="text-gray-700">+62 812 3456 7890</p>
        </div>

        {/* WhatsApp Business */}
        <div className="flex items-center space-x-3 mb-4">
          <FaWhatsapp className="text-xl text-green-500" />
          <p className="text-gray-700">+62 852 1234 5678 (WhatsApp)</p>
        </div>

        {/* Office Address */}
        <div className="flex items-center space-x-3 mb-4">
          <FaMapMarkerAlt className="text-xl text-blue-500" />
          <p className="text-gray-700">Jl. Sudirman No.45, Jakarta, Indonesia</p>
        </div>

        {/* Working Hours */}
        <div className="flex items-center space-x-3 mb-4">
          <FaClock className="text-xl text-yellow-500" />
          <p className="text-gray-700">Senin - Jumat: 08.00 - 17.00 WIB</p>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mt-6">
          <motion.a 
            whileHover={{ scale: 1.2 }} 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-500 text-2xl"
          >
            <FaInstagram />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.2 }} 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 text-2xl"
          >
            <FaFacebook />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.2 }} 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-red-600 text-2xl"
          >
            <FaYoutube />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.2 }} 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 text-2xl"
          >
            <FaTwitter />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.2 }} 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-700 text-2xl"
          >
            <FaLinkedin />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.2 }} 
            href="https://telegram.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 text-2xl"
          >
            <FaTelegram />
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
