"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Palette,
  TrendingUp,
  Phone,
  Calendar as CalendarIcon,
  ChevronRight,
  PaintBucket,
  HelpCircle,
} from "lucide-react";

export default function Dashboard() {
  const [userName, setUserName] = useState("Admin");
  const [animate, setAnimate] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("purple");

  useEffect(() => {
    setAnimate(true);
  }, []);

  const themes = {
    purple: {
      gradient: "from-purple-600 to-indigo-600",
      iconText: "text-purple-500",
      bgLight: "bg-purple-50",
      buttonBg: "bg-purple-600 hover:bg-purple-700",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      buttonText: "text-purple-600 hover:text-purple-700",
      borderAccent: "border-purple-200",
    },
    green: {
      gradient: "from-emerald-600 to-teal-600",
      iconText: "text-emerald-500",
      bgLight: "bg-emerald-50",
      buttonBg: "bg-emerald-600 hover:bg-emerald-700",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      buttonText: "text-emerald-600 hover:text-emerald-700",
      borderAccent: "border-emerald-200",
    },
    yellow: {
      gradient: "from-amber-500 to-yellow-500",
      iconText: "text-amber-500",
      bgLight: "bg-amber-50",
      buttonBg: "bg-amber-600 hover:bg-amber-700",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      buttonText: "text-amber-600 hover:text-amber-700",
      borderAccent: "border-amber-200",
    },
    red: {
      gradient: "from-red-600 to-rose-600",
      iconText: "text-red-500",
      bgLight: "bg-red-50",
      buttonBg: "bg-red-600 hover:bg-red-700",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonText: "text-red-600 hover:text-red-700",
      borderAccent: "border-red-200",
    },
    orange: {
      gradient: "from-orange-500 to-amber-600",
      iconText: "text-orange-500",
      bgLight: "bg-orange-50",
      buttonBg: "bg-orange-600 hover:bg-orange-700",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      buttonText: "text-orange-600 hover:text-orange-700",
      borderAccent: "border-orange-200",
    },
  };

  const shortcuts = [
    {
      title: "Products",
      description: "Manage your product catalog",
      icon: <Package className={`h-6 w-6 ${themes[currentTheme].iconText}`} />,
      link: "/admin/products",
    },
    {
      title: "Popular Products",
      description: "View and manage best sellers",
      icon: <Palette className={`h-6 w-6 ${themes[currentTheme].iconText}`} />,
      link: "/admin/popular",
    },
    {
      title: "New Arrivals",
      description: "Manage latest product additions",
      icon: <TrendingUp className={`h-6 w-6 ${themes[currentTheme].iconText}`} />,
      link: "/admin/new-arrivals",
    },
    {
      title: "Contact Us",
      description: "Manage customer communications",
      icon: <Phone className={`h-6 w-6 ${themes[currentTheme].iconText}`} />,
      link: "/admin/contact",
    },
    {
      title: "News & Events",
      description: "Update company announcements",
      icon: <CalendarIcon className={`h-6 w-6 ${themes[currentTheme].iconText}`} />,
      link: "/admin/news",
    },
  ];

  return (
    <div
      className={`space-y-6 p-6 lg:p-8 max-w-7xl mx-auto transition-colors duration-500 ${themes[currentTheme].bgLight} min-h-screen`}
    >
      {/* Theme Switcher */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-600">Theme:</span>
        <div
          className={`flex justify-start space-x-3 transition-all duration-500 ease-in-out ${
            animate ? "opacity-100 scale-100" : "opacity-0 scale-98"
          }`}
        >
          {["purple", "green", "yellow", "red", "orange"].map((theme) => (
            <button
              key={theme}
              onClick={() => setCurrentTheme(theme)}
              className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                themes[theme].gradient
              } shadow-sm ${
                currentTheme === theme
                  ? `ring-2 ring-offset-2 ${themes[theme].iconText}`
                  : ""
              } transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg hover:ring-1 hover:ring-opacity-50 hover:ring-${theme.split("-")[0]}-300 focus:outline-none focus:ring-2 focus:ring-${theme.split("-")[0]}-400 focus:ring-offset-2`}
              aria-label={`Switch to ${theme} theme`}
            />
          ))}
        </div>
      </div>

      {/* Welcome Banner */}
      <div
        className={`relative bg-gradient-to-r ${themes[currentTheme].gradient} rounded-2xl shadow-xl overflow-hidden transition-all duration-700 ease-in-out ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
          <svg className="h-full w-full text-white" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0 0 L100 0 C50 50, 50 50, 0 100 Z" fillOpacity="0.3"></path>
          </svg>
        </div>
        <div className="relative p-8 sm:p-10 md:p-12 text-white text-center">
          <div
            className={`h-16 w-16 rounded-full ${themes[currentTheme].iconBg} flex items-center justify-center mb-6 mx-auto transition-transform duration-500 ${
              animate ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          >
            <PaintBucket className="h-8 w-8 text-white" />
          </div>
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-bold transition-opacity duration-700 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Welcome, {userName}!
          </h1>
          <p
            className={`mt-3 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto transition-opacity duration-700 delay-100 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Manage your paint products, colors, and customer interactions with ease at Lubro Paints.
          </p>
        </div>
      </div>

      {/* Shortcut Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shortcuts.map((shortcut, index) => (
          <Link
            to={shortcut.link}
            key={index}
            className={`group relative bg-white rounded-xl shadow-sm p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border ${themes[currentTheme].borderAccent} overflow-hidden ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
            aria-label={`Navigate to ${shortcut.title}`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${themes[currentTheme].gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            ></div>
            <div className="flex items-center relative z-10">
              <div
                className={`flex-shrink-0 p-3 rounded-full ${themes[currentTheme].iconBg}`}
              >
                {shortcut.icon}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-base font-semibold text-gray-800">{shortcut.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{shortcut.description}</p>
              </div>
              <ChevronRight
                className={`ml-auto h-5 w-5 ${themes[currentTheme].iconText} transform group-hover:translate-x-1 transition-transform`}
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Help and Resources */}
      <div
        className={`relative bg-white rounded-xl shadow-sm p-8 transition-all duration-700 ease-in-out ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } border ${themes[currentTheme].borderAccent}`}
        style={{ transitionDelay: "600ms" }}
      >
        <div
          className={`absolute inset-0 border-2 ${themes[currentTheme].borderAccent} rounded-xl opacity-20`}
        ></div>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 relative z-10">
          <div
            className={`rounded-full ${themes[currentTheme].iconBg} p-4 flex-shrink-0 transition-transform duration-500 ${
              animate ? "scale-100" : "scale-75"
            }`}
          >
            <HelpCircle className={`h-8 w-8 ${themes[currentTheme].iconColor}`} />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-900">Need Assistance?</h3>
            <p className="mt-2 text-md text-gray-600 max-w-3xl">
              Explore our comprehensive documentation to learn how to manage products, update content, and engage with customers effectively.
            </p>
            <Link
              to="/admin/docs"
              className={`inline-flex items-center mt-3 px-4 py-2 rounded-md ${themes[currentTheme].buttonBg} text-white font-medium transition-colors`}
            >
              View Documentation
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}