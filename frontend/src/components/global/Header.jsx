"use client"

import { Phone, Mail } from "lucide-react"

export default function Header() {
  const ContactItem = ({ icon: Icon, title, content, link }) => (
    <div className="flex items-center space-x-3 group">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 border border-red-100 flex-shrink-0 group-hover:bg-red-100 transition-colors duration-200">
        <Icon className="w-5 h-5 text-red-500" />
      </div>
      <a href={link} className="flex flex-col group-hover:scale-105 transition-transform duration-200">
        <p className="text-gray-900 font-medium text-sm">{title}</p>
        <p className="text-gray-600 text-sm font-light">{content}</p>
      </a>
    </div>
  )

  return (
    <header className="bg-white w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            {/* <a href="/" className="group">
              <img
                src="/src/assets/logo.png"
                alt="Paint Company Logo"
                className="h-12 w-auto transition-transform duration-200 group-hover:scale-105"
              />
            </a> */}
          </div>

          {/* Contact Information */}
          <div className="hidden md:flex items-center space-x-8">
            <ContactItem icon={Phone} title="Call Us" content="+977 9800000000" link="tel:+9779800000000" />

            <div className="h-8 w-px bg-gray-200"></div>

            <ContactItem
              icon={Mail}
              title="Email Us"
              content="paintcompany@gmail.com"
              link="mailto:paintcompany@gmail.com"
            />
          </div>

          {/* Mobile Contact */}
          <div className="md:hidden flex items-center space-x-4">
            <a
              href="tel:+9779800000000"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 border border-red-100 hover:bg-red-100 transition-colors duration-200"
            >
              <Phone className="w-5 h-5 text-red-500" />
            </a>
            <a
              href="mailto:paintcompany@gmail.com"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 border border-red-100 hover:bg-red-100 transition-colors duration-200"
            >
              <Mail className="w-5 h-5 text-red-500" />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
