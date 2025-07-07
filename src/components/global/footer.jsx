"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/footer/logo.png";
import { FaFacebook, FaArrowUp } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaTiktok } from "react-icons/fa6";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigation = (section) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const navigateToFindStore = () => {
    navigate("/find-store");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalScroll) {
        const percentage = (currentScroll / totalScroll) * 100;
        setScrollProgress(percentage);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (scrollProgress / 100) * circumference;

  const getProgressColor = (progress) => {
    if (progress <= 33) return "#22c55e";
    if (progress <= 66) return "#eab308";
    return "#ef4444";
  };

  return (
    <>
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <div
          className="relative h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] cursor-pointer"
          onClick={scrollToTop}
        >
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={getProgressColor(scrollProgress)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 50 50)"
            />
            <foreignObject x="25" y="25" width="50" height="50">
              <div className="flex h-full w-full items-center justify-center bg-white rounded-full">
                <FaArrowUp className="text-gray-800 text-base sm:text-xl" />
              </div>
            </foreignObject>
          </svg>
        </div>
      </div>

      <footer className="w-full bg-cover bg-center bg-no-repeat text-black min-h-[250px] xs:min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[400px]">
        <div className="container mx-auto px-4 xs:px-4 sm:px-6 md:px-8 lg:px-10 py-6 xs:py-8 sm:py-10 md:py-12 lg:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xs:gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            <div className="flex items-center justify-center sm:justify-start px-2">
              <img
                src={logo}
                alt="Lubro Logo"
                className="w-32 sm:w-40 md:w-48 lg:w-56 object-contain"
              />
            </div>

            <div className="flex flex-col items-center sm:items-start text-gray-800">
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold mb-2 xs:mb-3 md:mb-4 underline decoration-popRed underline-offset-4 text-center sm:text-left">
                Quick Links
              </h3>
              <ul className="space-y-1 xs:space-y-2 md:space-y-3 text-center sm:text-left">
                {[
                  { id: "home", label: "Home" },
                  { id: "about", label: "About Us" },
                  { id: "news", label: "News and Events" },
                  { id: "contact", label: "Contact Us" },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigation(item.id)}
                      className="cursor-pointer hover:text-popRed transition-colors text-xs xs:text-sm sm:text-base md:text-lg font-semibold"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center sm:items-start text-gray-800">
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold mb-2 xs:mb-3 md:mb-4 underline decoration-popRed underline-offset-4 text-center sm:text-left">
                Products
              </h3>
              <ul className="space-y-1 xs:space-y-2 md:space-y-3 text-center sm:text-left">
                {[
                  { id: "products", label: "Paint Category" },
                  { id: "our-products", label: "Our Products" },
                  { action: navigateToFindStore, label: "Find Us" },
                ].map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={item.action || (() => handleNavigation(item.id))}
                      className="hover:text-popRed transition-colors text-xs xs:text-sm sm:text-base md:text-lg font-semibold"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center sm:items-start text-gray-800">
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold mb-2 xs:mb-3 md:mb-4 underline decoration-popRed underline-offset-4 text-center sm:text-left">
                Follow Us
              </h3>
              <div className="flex flex-row lg:flex-col justify-center sm:justify-start space-x-3 xs:space-x-4 lg:space-x-0 lg:space-y-3">
                {[
                  {
                    href: "https://www.facebook.com/",
                    Icon: FaFacebook,
                    label: "Facebook",
                  },
                  {
                    href: "https://www.tiktok.com/",
                    Icon: FaTiktok,
                    label: "TikTok",
                  },
                  {
                    href: "https://Wa.me/+9779800000000",
                    Icon: IoLogoWhatsapp,
                    label: "Whatsapp",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-black rounded-full p-1.5 xs:p-2 hover:bg-gray-800 transition-colors lg:bg-transparent lg:p-0 lg:hover:bg-transparent lg:hover:text-popRed"
                  >
                    <social.Icon className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-white lg:text-black" />
                    <span className="hidden lg:inline-block ml-2 text-sm md:text-base lg:text-lg font-semibold">
                      {social.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full bg-transparent border-b-2 border-purple-900 mt-6 xs:mt-8 sm:mt-10 md:mt-12 mb-3 xs:mb-4 sm:mb-6"></div>
          <div className="text-center text-xs xs:text-sm sm:text-base md:text-lg">
            <p>
              Copyright © 2025 Paint Company. All Rights Reserved. Designed By:
              <span className="text-popRed underline underline-offset-4 ml-2">
                <a
                  href="https://shresthamanoj.info.np/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MARSSL
                </a>
              </span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
