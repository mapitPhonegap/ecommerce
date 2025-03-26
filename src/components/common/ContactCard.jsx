import React, { useState, useEffect, useRef } from "react";
import { useParams, } from "react-router-dom";
import { Card, CardContent } from '@/components/common/Card';
import { FaPhone, FaEnvelope, FaGlobe, FaInstagram, FaFacebook, FaLinkedin, FaDownload } from "react-icons/fa";
import "daisyui/themes.css"; // Import DaisyUI
import useContact from "@/hooks/useContact";
import { useDispatch } from "react-redux";
import { updateTheme } from "@/redux/actions/profileActions";

const convertToEmbedURL = (url) => {
  if (!url) return "";
  const videoId = url.split("v=")[1]?.split("&")[0]; // Extracts the video ID
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
};

const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald",
    "corporate", "synthwave", "retro", "cyberpunk",
    "valentine", "halloween", "garden", "forest",
    "aqua", "lofi", "pastel", "fantasy", "wireframe",
    "black", "luxury", "dracula", "cmyk", "autumn",
    "business", "acid", "lemonade", "night", "coffee",
    "winter"
  ];
  
  const themeIcons = {
    light: "☀️", dark: "🌙", cupcake: "🍰", cyberpunk: "🤖", dracula: "🦇",
    bumblebee: "🐝", emerald: "💎", corporate: "🏢", synthwave: "🌌", retro: "📻",
    valentine: "💖", halloween: "🎃", garden: "🌿", forest: "🌲", aqua: "💧",
    lofi: "🎵", pastel: "🎨", fantasy: "🧚", wireframe: "🕸️", black: "⚫",
    luxury: "💰", cmyk: "🎨", autumn: "🍂", business: "💼", acid: "🧪",
    lemonade: "🍋", night: "🌙", coffee: "☕", winter: "❄️"
  };
  
  const ContactCard = ({ contact, isEdit }) => {
    const dispatch = useDispatch();
    const containerRef = useRef(null);
    const [theme, setTheme] = useState(contact.theme || "light");
  
    useEffect(() => {
      if (contact.theme) {
        setTheme(contact.theme);
      }
    }, [contact.theme]);
  
    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.classList.add("loaded");
      }
    }, []);
  
    const changeTheme = (newTheme) => {
      setTheme(newTheme);
      dispatch(updateTheme(newTheme));
    };
  
    const saveContactAsVCF = () => {
      const vcfData = `
  BEGIN:VCARD
  VERSION:4.0
  FN:${contact.name}
  TEL;TYPE=cell:${contact.phone}
  EMAIL:${contact.email}
  URL:${contact.website}
  URL;TYPE=facebook:${contact.facebook}
  URL;TYPE=instagram:${contact.instagram}
  PHOTO:${contact.avatar}
  ADR;TYPE=work:${contact.work_address}
  ORG:${contact.work}
  TITLE:${contact.title}
  URL;TYPE=portfolio:${contact.video}
  NOTE:${contact.note}
  END:VCARD
      `;
  
      const blob = new Blob([vcfData], { type: "text/vcard" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${contact.name || "contact"}.vcf`;
      link.click();
    };
  
    return (
    <div ref={containerRef}
    data-theme={theme}
    className="contact-page min-h-screen flex flex-col items-center justify-center bg-base-100">
      <div className="flex space-x-2 mb-6">
      {isEdit? <select
          onChange={(e) => changeTheme(e.target.value)}
          className="select select-bordered w-full max-w-xs h-auto"
        >
          {themes.map((t) => (
            <option key={t} value={t}>
              {themeIcons[t] || "🎭"} {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>: ''}
      </div>
  
      <div 
        className="card bg-base-200 transition-colors duration-300 shadow-xl text-base-content w-full max-w-lg">
  
          {/* Video (Only if available) */}
          {contact.video && (
            <div className="video-container">
              <iframe
                src={convertToEmbedURL(contact.video)}
                title="Video"
                className="video-frame"
                allowFullScreen
              ></iframe>
            </div>
          )}
                <div className="card-header flex flex-col items-center">
          <img
            src={contact.avatar || "/src/images/profile-image-placeholder.jpg"}
            alt="Profile Image"
            className="profile-img rounded-full w-24 h-24 object-cover"
          />
        </div>
        <div className="card-body text-center p-6">
          {/* Name */}
          <p className="name text-2xl font-bold">{contact.fullname || "-"}</p>
  
          {/* Job Title & Company */}
          {contact.title && <p className="text-lg font-semibold text-primary">{contact.title}</p>}
          {contact.work && <p className="text-md text-gray-600">{contact.work}</p>}
          {contact.work_address && <p className="text-sm text-gray-500">{contact.work_address}</p>}
  
          {/* Bio (Max 500 chars) */}
          {contact.bio && (
            <p className="text-sm text-gray-700 mt-4 bg-gray-100 p-3 rounded-lg">
              {contact.bio.length > 500 ? `${contact.bio.substring(0, 500)}...` : contact.bio}
            </p>
          )}
  
          {/* Contact Information */}
          <div className="mt-4 space-y-2">
            {contact.mobile && (
              <div className="flex items-center justify-center gap-2 text-xl">
                <FaPhone className="text-xl" />
                <a href={`tel:${contact.mobile}`} className="link link-primary">{contact.mobile}</a>
              </div>
            )}
            {contact.email && (
              <div className="flex items-center justify-center gap-2 text-xl">
                <FaEnvelope className="text-xl" />
                <a href={`mailto:${contact.email}`} className="link link-primary">{contact.email}</a>
              </div>
            )}
          </div>
        </div>
  
        {/* Social Links */}
        <div className="social-links flex justify-center gap-3 mt-2 pb-2">
          {contact.website && <a href={contact.website} className="!bg-primary fas fa-globe social-icon !text-white"></a>}
          {contact.facebook && <a href={contact.facebook} className="!bg-primary fab fa-facebook social-icon !text-white"></a>}
          {contact.whatsapp && <a href={contact.whatsapp} className="!bg-primary fab fa-whatsapp social-icon !text-white"></a>}
          {contact.instagram && <a href={contact.instagram} className="!bg-primary fab fa-instagram social-icon !text-white"></a>}
          {contact.linkedin && <a href={contact.linkedin} className="!bg-primary fab fa-linkedin social-icon !text-white"></a>}
        </div>
  
        <div className="card-footer p-4">
          <button
            className="w-full btn btn-primary flex items-center justify-center"
            style={{ height: '50px' }}
            onClick={saveContactAsVCF}
          >
            <FaDownload className="mr-5" /> Save Contact
          </button>
        </div>
      </div>
    </div>
);
};

export default ContactCard;