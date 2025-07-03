import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    email: "digitalpaints@gmail.com",
    phone: "98000001232",
    address: "Itahari-6, Sunsari",
  });
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "https://paintcompanybackend.onrender.com";

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/contact/info`);
        if (response.data) {
          setContactInfo({
            email: response.data.email || contactInfo.email,
            phone: response.data.phone || contactInfo.phone,
            address: response.data.address || contactInfo.address,
          });
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    fetchContactInfo();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/contact/submit`, {
        full_name: formData.fullName,
        email: formData.email,
        message: formData.message,
      });

      setSubmitStatus("Message sent successfully! We'll get back to you soon.");
      setFormData({ fullName: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus(
        error.response?.data?.detail ||
          "Failed to send message. Please try again or contact us directly."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMessageInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="min-h-[60vh] bg-gray-50 py-4 sm:py-6 md:py-8 lg:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12">
          <div className="w-full lg:w-2/5 space-y-4 sm:space-y-">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-black tracking-tight mb-5">
                Get In{" "}
                <span className="underline underline-offset-4 decoration-2 decoration-popRed">
                  Touch
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl font-bold text-black">
                Have a question? We're here to help you.
              </p>
            </div>

            <div className="space-y-3">
              {contactInfo.address.split("\n").map((address, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm sm:text-base md:text-base font-semibold text-black break-all">
                    {index === 0
                      ? `Corporate Office: ${address || "Not set"}`
                      : `Factory: ${address || "Not set"}`}
                  </span>
                </div>
              ))}
              {[
                {
                  icon: <FaEnvelope className="w-4 h-4 text-red-600" />,
                  text: (
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-sm sm:text-base md:text-base font-semibold text-black break-all hover:underline"
                      aria-label={`Send email to ${contactInfo.email}`}
                    >
                      {contactInfo.email}
                    </a>
                  ),
                },
                {
                  icon: <FaPhoneAlt className="w-4 h-4 text-red-600 rotate-90" />,
                  text: (
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-sm sm:text-base md:text-base font-semibold text-black break-all hover:underline"
                      aria-label={`Call ${contactInfo.phone}`}
                    >
                      {contactInfo.phone}
                    </a>
                  ),
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-sm sm:text-base md:text-base font-semibold text-black break-all">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-3/5 mt-4 lg:mt-0">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-lg lg:max-w-xl lg:ml-16">
              <form className="space-y-6 sm:space-y-8 w-full" onSubmit={handleSubmit}>
                {[
                  { id: "fullName", placeholder: "Full Name", type: "text" },
                  { id: "email", placeholder: "E-mail", type: "email" },
                ].map((field) => (
                  <div key={field.id}>
                    <input
                      type={field.type}
                      id={field.id}
                      value={formData[field.id]}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-200 rounded-2xl text-sm sm:text-base text-gray-500 focus:outline-none placeholder-gray-500 focus:bg-gray-100 transition-colors"
                      placeholder={field.placeholder}
                      required
                    />
                  </div>
                ))}

                <div>
                  <textarea
                    id="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleInputChange}
                    onInput={handleMessageInput}
                    className="w-full p-3 bg-gray-200 rounded-lg text-sm sm:text-base text-gray-500 focus:outline-none placeholder-gray-500 focus:bg-gray-100 transition-colors resize-none min-h-[100px] sm:min-h-[120px]"
                    placeholder="Message"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full px-4 py-2 sm:px-5 sm:py-2 text-sm sm:text-base font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>

                {submitStatus && (
                  <p
                    className={`mt-2 text-xs sm:text-sm ${
                      submitStatus.includes("success")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {submitStatus}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}