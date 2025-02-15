import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaInfoCircle,
  FaLink,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 mt-auto w-full">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start text-center md:text-left">
        {/* About Us */}
        <div>
          <h3 className="text-lg font-semibold text-gold mb-2 flex items-center justify-center md:justify-start">
            <FaInfoCircle className="mr-2" /> About Us
          </h3>
          <p className="text-gray-400 text-sm">
            We provide high-quality products with excellent customer service.
            Your satisfaction is our priority.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gold mb-2 flex items-center justify-center md:justify-start">
            <FaLink className="mr-2" /> Quick Links
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a
                href="/home"
                className="hover:text-blue transition duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/brands"
                className="hover:text-blue transition duration-300"
              >
                Brands
              </a>
            </li>
            <li>
              <a
                href="/categories"
                className="hover:text-blue transition duration-300"
              >
                Categories
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="hover:text-blue transition duration-300"
              >
                Products
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-lg font-semibold text-gold mb-2 flex items-center justify-center md:justify-start">
            Contact Us
          </h3>
          <p className="text-gray-400 flex items-center justify-center md:justify-start">
            <FaEnvelope className="mr-2" /> support@yourwebsite.com
          </p>
          <p className="text-gray-400 flex items-center justify-center md:justify-start mt-2">
            <FaPhone className="mr-2" /> +102 224 6012
          </p>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-lg font-semibold text-gold mb-2">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-blue transition duration-300 text-2xl"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue transition duration-300 text-2xl"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue transition duration-300 text-2xl"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue transition duration-300 text-2xl"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} YourBrand. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
