"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Package,
  Palette,
  TrendingUp,
  Phone,
  CalendarIcon,
  ChevronRight,
  PaintBucket,
  HelpCircle,
  Sparkles,
} from "lucide-react"

export default function Dashboard() {
  const [userName, setUserName] = useState("Admin")
  const [animate, setAnimate] = useState(false)
  const [currentTheme, setCurrentTheme] = useState("red")

  useEffect(() => {
    setAnimate(true)
  }, [])

  const themes = {
    red: {
      gradient: "from-red-500 to-rose-600",
      iconText: "text-red-500",
      bgLight: "bg-red-50",
      buttonBg: "bg-red-500 hover:bg-red-600",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      borderAccent: "border-red-200",
    },
    blue: {
      gradient: "from-blue-500 to-indigo-600",
      iconText: "text-blue-500",
      bgLight: "bg-blue-50",
      buttonBg: "bg-blue-500 hover:bg-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      borderAccent: "border-blue-200",
    },
    green: {
      gradient: "from-emerald-500 to-teal-600",
      iconText: "text-emerald-500",
      bgLight: "bg-emerald-50",
      buttonBg: "bg-emerald-500 hover:bg-emerald-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      borderAccent: "border-emerald-200",
    },
    purple: {
      gradient: "from-purple-500 to-indigo-600",
      iconText: "text-purple-500",
      bgLight: "bg-purple-50",
      buttonBg: "bg-purple-500 hover:bg-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      borderAccent: "border-purple-200",
    },
  }

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
  ]

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themes[currentTheme].bgLight}`}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Theme Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">Theme:</span>
            <div className="flex space-x-3">
              {["red", "blue", "green", "purple"].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setCurrentTheme(theme)}
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${themes[theme].gradient} shadow-sm ${
                    currentTheme === theme ? "ring-2 ring-offset-2 ring-gray-400" : ""
                  } transition-all duration-200 hover:scale-105`}
                  aria-label={`Switch to ${theme} theme`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Sparkles className="h-4 w-4" />
            <span>Minimalist Design</span>
          </div>
        </div>

        {/* Welcome Banner */}
        <div
          className={`relative bg-gradient-to-r ${themes[currentTheme].gradient} rounded-2xl shadow-xl overflow-hidden transition-all duration-700 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative p-12 text-white text-center">
            <div
              className={`w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 mx-auto transition-transform duration-500 ${animate ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
            >
              <PaintBucket className="h-10 w-10 text-white" />
            </div>
            <h1
              className={`text-4xl md:text-5xl font-bold transition-opacity duration-700 ${animate ? "opacity-100" : "opacity-0"}`}
            >
              Welcome, {userName}!
            </h1>
            <p
              className={`mt-4 text-xl text-white/90 max-w-2xl mx-auto transition-opacity duration-700 delay-100 ${animate ? "opacity-100" : "opacity-0"}`}
            >
              Manage your paint products, colors, and customer interactions with our modern admin panel.
            </p>
          </div>
        </div>

        {/* Shortcut Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortcuts.map((shortcut, index) => (
            <Link
              to={shortcut.link}
              key={index}
              className={`group bg-white rounded-2xl shadow-sm border ${themes[currentTheme].borderAccent} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 p-3 rounded-xl ${themes[currentTheme].iconBg} group-hover:scale-110 transition-transform duration-200`}
                >
                  {shortcut.icon}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {shortcut.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{shortcut.description}</p>
                </div>
                <ChevronRight
                  className={`ml-auto h-5 w-5 ${themes[currentTheme].iconText} transform group-hover:translate-x-1 transition-transform`}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Help Section */}
        <div
          className={`bg-white rounded-2xl shadow-sm border ${themes[currentTheme].borderAccent} p-8 transition-all duration-700 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className={`rounded-full ${themes[currentTheme].iconBg} p-4 flex-shrink-0`}>
              <HelpCircle className={`h-8 w-8 ${themes[currentTheme].iconColor}`} />
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-xl font-semibold text-gray-900">Need Assistance?</h3>
              <p className="mt-2 text-gray-600 max-w-3xl">
                Explore our comprehensive documentation to learn how to manage products, update content, and engage with
                customers effectively.
              </p>
            </div>
            <Link
              to="/admin/docs"
              className={`${themes[currentTheme].buttonBg} text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center`}
            >
              View Documentation
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
