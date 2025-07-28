"use client"

import { useState, useEffect } from "react"
import { MapPin, Mail, Phone, Clock, Send, Loader2 } from "lucide-react"
import axios from "axios"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  })
  const [submitStatus, setSubmitStatus] = useState(null)
  const [contactInfo, setContactInfo] = useState({
    email: "paintcompany@gmail.com",
    phone: "9800000000",
    address: "Itahari, Sunsari",
  })
  const [loading, setLoading] = useState(false)

  const API_BASE_URL = "https://paintcompanybackend.onrender.com"

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/contact/info`)
        if (response.data) {
          setContactInfo({
            email: response.data.email || contactInfo.email,
            phone: response.data.phone || contactInfo.phone,
            address: response.data.address || contactInfo.address,
          })
        }
      } catch (error) {
        console.error("Error fetching contact info:", error)
      }
    }

    fetchContactInfo()
  }, [])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus(null)
    setLoading(true)

    try {
      const response = await axios.post(`${API_BASE_URL}/api/contact/submit`, {
        full_name: formData.fullName,
        email: formData.email,
        message: formData.message,
      })

      setSubmitStatus("Message sent successfully! We'll get back to you soon.")
      setFormData({ fullName: "", email: "", message: "" })
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus(
        error.response?.data?.detail || "Failed to send message. Please try again or contact us directly.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6">
            Get In <span className="text-red-500 font-normal">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 font-light">
            Have a question? We're here to help you transform your space.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-medium text-gray-900">Contact Information</h3>
              <p className="text-lg text-gray-600 font-light">
                Reach out to us through any of these channels. We're always ready to assist you.
              </p>
            </div>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-red-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900">Address</h4>
                  {contactInfo.address.split("\n").map((address, index) => (
                    <p key={index} className="text-gray-600 font-light">
                      {index === 0 ? `Corporate Office: ${address || "Not set"}` : `Factory: ${address || "Not set"}`}
                    </p>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-red-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900">Email</h4>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-gray-600 font-light hover:text-red-500 transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-red-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900">Phone</h4>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-gray-600 font-light hover:text-red-500 transition-colors"
                  >
                    +977 {contactInfo.phone}
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-red-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900">Business Hours</h4>
                  <div className="text-gray-600 font-light space-y-1">
                    <p>Sunday - Friday: 10:00 AM - 5:00 PM</p>
                    <p>Saturday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-medium text-gray-900">Send us a Message</h3>
                <p className="text-gray-600 font-light">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors font-light"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors font-light"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors font-light resize-none"
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                {submitStatus && (
                  <div
                    className={`p-4 rounded-xl text-sm font-light ${
                      submitStatus.includes("success")
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {submitStatus}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
