import React, { useState, useEffect, useRef } from "react";
import { useParams, } from "react-router-dom";
import { Card, CardContent } from '@/components/common/Card';
import { FaPhone, FaEnvelope, FaGlobe, FaInstagram, FaFacebook, FaLinkedin, FaDownload } from "react-icons/fa";
import "daisyui/themes.css"; // Import DaisyUI
import useContact from "@/hooks/useContact";


const ContactPage = () => {
  const { id } = useParams();
  const { contact, loading, error } = useContact(id);
  const containerRef = useRef(null); // Create a ref for the container

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add("loaded");
    }
  }, [contact]); // Run the effect when contact is updated

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
  
  const [theme, setTheme] = useState("light");
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const saveContactAsVCF = () => {
    const vcfData = `
BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
TEL:${contact.phone}
EMAIL:${contact.email}
URL:${contact.website}
END:VCARD
    `;

    const blob = new Blob([vcfData], { type: 'text/vcard' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${contact.name || 'contact'}.vcf`;
    link.click();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="contact-page min-h-screen flex flex-col items-center justify-center bg-base-100">
      <div className="flex space-x-2 mb-6">
        <select
          onChange={(e) => changeTheme(e.target.value)}
          className="select select-bordered w-full max-w-xs h-auto" // Override height to auto
        >
          {themes.map((t) => (
            <option key={t} value={t}>
              {themeIcons[t] || "🎭"} {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>
        <div className="card bg-base-200 transition-colors duration-300 shadow-xl text-base-content">
        <div className="card-header">
            <img src={ contact.users?.avatar || "/src/images/profile-image-placeholder.jpg"} alt="Profile Image" className="profile-img"/>
        </div>
        <div className="card-body">
            <p className="name">{contact.name || "-"}</p>
            {contact.phone && (
              <div className="flex items-center justify-center gap-2 text-xl ">
                <FaPhone className="text-xl" />
                <a href={`tel:${contact.phone}`} className="link link-primary">{contact.phone}</a>
              </div>
            )}
            {contact.email && (
              <div className="flex items-center justify-center gap-2 text-xl ">
                <FaEnvelope className="text-xl" />
                <a href={`mailto:${contact.email}`} className="link link-primary">{contact.email}</a>
              </div>
            )}
            <p className="job">{contact.job_title}</p>
        </div>
          <div className="social-links">
          {contact.website && (<a href={contact.website} className="!bg-primary fas fa-globe social-icon !text-white"></a>)}
          {contact.facebook && (<a href={contact.facebook} className="!bg-primary fab fa-facebook social-icon !text-white"></a>)}
          {contact.whatsapp && (<a href={contact.whatsapp} className="!bg-primary fab fa-whatsapp social-icon !text-white"></a>)}
          {contact.instagram && (<a href={contact.instagram} className="!bg-primary fab fa-instagram social-icon !text-white"></a>)}
          {contact.linkedin && (<a href={contact.linkedin} className="!bg-primary fab fa-linkedin social-icon !text-white"></a>)}

          </div>
        <div className="card-footer">
            <button className="w-full mt-4 btn btn-primary flex items-center justify-center"   style={{ height: '50px' }}
            onClick={saveContactAsVCF}>
            <FaDownload className="mr-5" /> Save Contact
          </button>
        </div>
    </div>
      </div>

      
  );
};

export default ContactPage;
