"use client";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";
import { motion } from "framer-motion";

// ✅ Quick Links Data
const quickLinks = [
  { name: "Home", href: WEBSITE_HOME },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "My Account", href: "/account" },
];

// ✅ Information Links Data
const infoLinks = [
  { name: "Terms & Condition", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Shipping Policy", href: "/shipping" },
  { name: "Cancellation Policy", href: "/cancellation" },
  { name: "Refund & Return Policy", href: "/refund" },
];

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 py-10 border-t border-gray-200">
      <motion.div
        className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* About Us */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-black">About Us</h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to our store! We are passionate about delivering the latest fashion and quality products to our customers. Our goal is to make shopping easy, enjoyable, and affordable for everyone. Discover new styles, timeless classics, and a seamless shopping experience with us.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4 text-black">Quick Links</h2>
          <ul className="space-y-2">
            {quickLinks.map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 8 }}
                transition={{ duration: 0.2 }}
                className="text-gray-600 hover:text-black transition"
              >
                <a href={item.href}>{item.name}</a>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Informations */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-black">Informations</h2>
          <ul className="space-y-2">
            {infoLinks.map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 8 }}
                transition={{ duration: 0.2 }}
                className="text-gray-600 hover:text-black transition"
              >
                <a href={item.href}>{item.name}</a>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-black">Contact Us</h2>
          <ul className="space-y-2 text-gray-600">
            <li>
              <span className="font-medium">Phone:</span> +91 9389897294
            </li>
            <li>
              <span className="font-medium">Email:</span>{" "}
              <a
                href="mailto:info@flairrfabric.com"
                className="hover:text-black transition"
              >
                info@example.com
              </a>
            </li>
            <li>
              E-34, Nehru Ground, First floor,
              <br />
              Faridabad, 121001
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
      >
        Copyright © 2025{" "}
        <span className="text-black font-medium">Vicky bisht</span> — All
        rights reserved.
      </motion.div>
    </footer>
  );
};

export default Footer;
