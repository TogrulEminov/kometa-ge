"use client";

import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaWhatsapp,
  FaTelegramPlane,
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaPhoneAlt,
} from "react-icons/fa";

// Custom marker icon — primary red
const customIcon = new Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23b11226'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const BAKU_COORDS: [number, number] = [40.4093, 49.8671];

const contactInfo = [
  {
    icon: FaPhoneAlt,
    label: "Phone",
    value: "+994 55 262 40 37",
    href: "tel:+994552624037",
  },
  {
    icon: FaEnvelope,
    label: "Email",
    value: "info@kometa.ge",
    href: "mailto:info@kometa.ge",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Address",
    value: "Baku, Azerbaijan",
    href: "#",
  },
  {
    icon: FaClock,
    label: "Working Hours",
    value: "Mon - Fri: 09:00 - 18:00",
    href: "#",
  },
];

const socials = [
  { icon: FaWhatsapp, href: "https://wa.me/994552624037", label: "WhatsApp" },
  { icon: FaTelegramPlane, href: "https://t.me/kometage", label: "Telegram" },
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] py-20">
      <div className="container">
        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left mb-16"
        >
        
          <h1 className="text-secondary text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Get in <span className="text-primary">touch</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Have a question? We are here to help. Reach out to our team.
          </p>
        </motion.div>

        {/* ===== CONTACT INFO CARDS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {contactInfo.map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gray-50 group-hover:bg-primary rounded-2xl flex items-center justify-center mb-4 transition-all duration-300">
                <item.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                {item.label}
              </div>
              <div className="text-base font-semibold text-secondary group-hover:text-primary transition-colors duration-300">
                {item.value}
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* ===== MAIN CONTENT: FORM + MAP ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100"
          >
            <h2 className="text-secondary text-2xl font-bold mb-2">
              Send a message
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Fill out the form and we will get back to you shortly.
            </p>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-secondary text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-secondary text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-secondary text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-secondary text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
              <textarea
                rows={4}
                placeholder="Your Message..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-secondary text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
              />
              <button
                type="submit"
                className="w-full bg-secondary hover:bg-primary text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Right — Map + Social */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Map */}
            <div className="bg-white rounded-3xl p-3 border border-gray-100">
              <div className="rounded-2xl overflow-hidden h-[320px]">
                <MapContainer
                  center={BAKU_COORDS}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                  <Marker position={BAKU_COORDS} icon={customIcon}>
                    <Popup>
                      <div className="text-center">
                        <div className="font-bold text-secondary text-sm">
                          Kometa GE
                        </div>
                        <div className="text-xs text-gray-400">Head Office</div>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              {/* Address below map */}
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <FaMapMarkerAlt className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-secondary text-sm">
                      Head Office
                    </div>
                    <div className="text-gray-400 text-sm mt-0.5">
                      Baku city, Nizami district, C. Mammadguluzade st. 123
                    </div>
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=40.4093,49.8671"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-2 hover:underline"
                    >
                      Get Directions
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100">
              <div className="text-sm text-gray-400 font-medium mb-4">
                Follow us on social media
              </div>
              <div className="flex gap-3">
                {socials.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex-1 h-12 bg-gray-50 hover:bg-primary rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
