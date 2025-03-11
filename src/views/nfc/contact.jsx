import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/common/Card";
import { FaPhone, FaEnvelope, FaGlobe, FaInstagram, FaFacebook, FaLinkedin, FaDownload } from "react-icons/fa";
import "daisyui/themes.css"; // Import DaisyUI
import useContact from "@/hooks/useContact";

const ContactPage = () => {
  const { userId } = useParams();
  const contact = useContact(userId);
  const [theme, setTheme] = useState("light");

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="flex space-x-2 mb-4">
        <select onChange={(e) => changeTheme(e.target.value)} className="select select-bordered">
          <option value="light">☀️ Light</option>
          <option value="dark">🌙 Dark</option>
          <option value="cupcake">🍰 Cupcake</option>
          <option value="cyberpunk">🤖 Cyberpunk</option>
          <option value="dracula">🦇 Dracula</option>
        </select>
      </div>
      <Card className="max-w-md w-full bg-base-100 p-6 rounded-2xl shadow-lg text-center">
        <img
          src={contact.avatar || "/src/images/defaultAvatar.jpg"}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-neutral"
        />
        <h1 className="text-xl font-semibold text-primary">{contact.name || "John Doe"}</h1>
        <p className="text-secondary">{contact.jobTitle || "Software Engineer"}</p>
        
        <button className="w-full mt-4 btn btn-primary flex items-center justify-center" onClick={() => window.location.href='/contact.vcf'}>
          <FaDownload className="mr-2" /> Save Contact
        </button>
        
        <CardContent className="mt-4 space-y-3">
          {contact.phone && (
            <div className="flex items-center space-x-2 text-neutral">
              <FaPhone />
              <a href={`tel:${contact.phone}`} className="hover:underline">{contact.phone}</a>
            </div>
          )}
          {contact.email && (
            <div className="flex items-center space-x-2 text-neutral">
              <FaEnvelope />
              <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
            </div>
          )}
          {contact.website && (
            <div className="flex items-center space-x-2 text-neutral">
              <FaGlobe />
              <a href={contact.website} target="_blank" className="hover:underline">{contact.website}</a>
            </div>
          )}
        </CardContent>

        <div className="mt-4 flex justify-center space-x-4 text-neutral">
          {contact.instagram && (
            <a href={contact.instagram} target="_blank" className="hover:text-pink-600">
              <FaInstagram size={24} />
            </a>
          )}
          {contact.facebook && (
            <a href={contact.facebook} target="_blank" className="hover:text-blue-600">
              <FaFacebook size={24} />
            </a>
          )}
          {contact.linkedin && (
            <a href={contact.linkedin} target="_blank" className="hover:text-blue-700">
              <FaLinkedin size={24} />
            </a>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ContactPage;
