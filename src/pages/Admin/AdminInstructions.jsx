import React from "react";
import {
  Lock,
  KeyRound,
  LayoutDashboard,
  PackageCheck,
  Flame,
  Newspaper,
  Mail,
  X, 
} from "lucide-react";
import { useNavigate } from "react-router-dom"; 

const AdminInstructions = () => {
  const navigate = useNavigate(); 

  const handleClose = () => {
    navigate(-1); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-white text-gray-800 p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 space-y-12 border border-blue-200 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-indigo-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-8 h-8" />
        </button>

        <h1 className="text-5xl font-black text-center text-indigo-600 drop-shadow-sm">
          ✨ Admin Panel Instructions ✨
        </h1>

        <section className="space-y-2 group">
          <h2 className="flex items-center text-2xl font-bold text-indigo-500 gap-3 transition group-hover:text-indigo-600">
            <Lock className="w-6 h-6 group-hover:scale-110 transition-transform" />
            1. Logging In
          </h2>
          <p>
            Use your assigned <strong>username</strong> and{" "}
            <strong>password</strong> to log in. Just enter them on the login
            screen and hit “Login” to access the dashboard.
          </p>
        </section>

        <section className="space-y-2 group">
          <h2 className="flex items-center text-2xl font-bold text-indigo-500 gap-3 transition group-hover:text-indigo-600">
            <KeyRound className="w-6 h-6 group-hover:scale-110 transition-transform" />
            2. Forgot or Reset Password
          </h2>
          <p>
            Click <em>“Forgot Password?”</em> on the login screen. Then provide
            your <strong>username</strong>, <strong>new password</strong>,{" "}
            <strong>confirm password</strong>, and the{" "}
            <strong>SuperAdminKey</strong> to reset your password.
          </p>
        </section>

        <section className="space-y-2 group">
          <h2 className="flex items-center text-2xl font-bold text-indigo-500 gap-3 transition group-hover:text-indigo-600">
            <LayoutDashboard className="w-6 h-6 group-hover:scale-110 transition-transform" />
            3. Dashboard Overview
          </h2>
          <p>
            Once logged in, you’ll land on the dashboard — a central hub to access
            and manage products, news, contacts, and more.
          </p>
        </section>

        <section className="space-y-2 group">
          <h2 className="flex items-center text-2xl font-bold text-indigo-500 gap-3 transition group-hover:text-indigo-600">
            <PackageCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
            4. Products
          </h2>
          <ul className="list-disc list-inside ml-4">
            <li>Navigate to “Products”.</li>
            <li>Add new items by filling out the form and uploading an image.</li>
            <li>Edit or delete entries using the edit and trash icons.</li>
          </ul>
        </section>

        <section className="space-y-2 group">
          <h2 className="flex items-center text-2xl font-bold text-indigo-500 gap-3 transition group-hover:text-indigo-600">
            <PackageCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
            5. Popular Products
          </h2>
          <ul className="list-disc list-inside ml-4">
            <li>Navigate to “Popular Products”.</li>
            <li>Add new items by filling out the form and uploading an image.</li>
            <li>Edit or delete entries using the edit and trash icons.</li>
          </ul>
        </section>

        <section className="space-y-2 group">
          <h2 className="flex items-center text-2xl font-bold text-indigo-500 gap-3 transition group-hover:text-indigo-600">
            <Flame className="w-6 h-6 group-hover:scale-110 transition-transform" />
            6. New Arrivals
          </h2>
          <ul className="list-disc list-inside ml-4">
            <li>Head over to “New Arrivals”.</li>
            <li>Input product details and attach an image.</li>
            <li>Use icons to update or remove listings as needed.</li>
          </ul>
        </section>

        <section className="space-y-2 group">
          <h2 className="flex items-center text-2xl font-bold text-indigo-500 gap-3 transition group-hover:text-indigo-600">
            <Newspaper className="w-6 h-6 group-hover:scale-110 transition-transform" />
            7. News Manager
          </h2>
          <ul className="list-disc list-inside ml-4">
            <li>Access the “News” section.</li>
            <li>Add items by providing title, description, and an image.</li>
            <li>Edit or delete with the respective icons.</li>
          </ul>
        </section>

        <section className="space-y-2 group">
          <h2 className="flex items-center text-2xl font-bold text-indigo-500 gap-3 transition group-hover:text-indigo-600">
            <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
            8. Contact Messages
          </h2>
          <p>
            Visit the “Contact” section to view form submissions. These are
            read-only, great for support or follow-up.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AdminInstructions;