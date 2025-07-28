"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import axios from "axios"
import SaveModal from "../../components/SaveModal"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [resetCurrentPassword, setResetCurrentPassword] = useState("")
  const [resetNewPassword, setResetNewPassword] = useState("")
  const [resetVerifyPassword, setResetVerifyPassword] = useState("")
  const [resetError, setResetError] = useState("")
  const [isResetLoading, setIsResetLoading] = useState(false)
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false)
  const [forgotUsername, setForgotUsername] = useState("")
  const [forgotNewPassword, setForgotNewPassword] = useState("")
  const [forgotVerifyPassword, setForgotVerifyPassword] = useState("")
  const [superadminKey, setSuperadminKey] = useState("")
  const [forgotError, setForgotError] = useState("")
  const [isForgotLoading, setIsForgotLoading] = useState(false)

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false)
  const [showResetCurrentPassword, setShowResetCurrentPassword] = useState(false)
  const [showResetNewPassword, setShowResetNewPassword] = useState(false)
  const [showResetVerifyPassword, setShowResetVerifyPassword] = useState(false)
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false)
  const [showForgotVerifyPassword, setShowForgotVerifyPassword] = useState(false)
  const [showSuperadminKey, setShowSuperadminKey] = useState(false)

  // State for SaveModal
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [saveModalTitle, setSaveModalTitle] = useState("")
  const [saveModalMessage, setSaveModalMessage] = useState("")
  const [saveModalTimerMessage, setSaveModalTimerMessage] = useState("")

  const navigate = useNavigate()

  const API_BASE_URL = "https://paintcompanybackend.onrender.com"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("username", username)
      formData.append("password", password)

      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })

      if (response.data && response.data.access_token) {
        localStorage.setItem("authToken", response.data.access_token)
        localStorage.setItem(
          "adminAuth",
          JSON.stringify({
            isAuthenticated: true,
            user: { username, role: "admin" },
          }),
        )
        setSaveModalTitle("Login Complete")
        setSaveModalMessage("Login successful! Redirecting to dashboard...")
        setSaveModalTimerMessage("Redirecting in")
        setIsSaveModalOpen(true)
        setTimeout(() => {
          navigate("/admin/dashboard")
        }, 1000)
      } else {
        setError("Invalid response from server")
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid username or password")
        } else {
          setError(`Server error: ${err.response.data.detail || "Unknown error"}`)
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.")
      } else {
        setError("An error occurred. Please try again.")
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setResetError("")
    setIsResetLoading(true)

    if (resetNewPassword !== resetVerifyPassword) {
      setResetError("New password and verify password do not match")
      setIsResetLoading(false)
      return
    }

    if (resetNewPassword.length < 8) {
      setResetError("Password must be at least 8 characters long")
      setIsResetLoading(false)
      return
    }

    try {
      const authToken = localStorage.getItem("authToken")

      if (!authToken) {
        setResetError("You must be logged in to reset your password")
        setIsResetLoading(false)
        return
      }

      const response = await axios.post(
        `${API_BASE_URL}/admin/password/reset-password`,
        {
          old_password: resetCurrentPassword,
          new_password: resetNewPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      if (response.status === 200) {
        setIsResetModalOpen(false)
        setResetCurrentPassword("")
        setResetNewPassword("")
        setResetVerifyPassword("")
        setSaveModalTitle("Password Updated")
        setSaveModalMessage("Password reset successfully!")
        setSaveModalTimerMessage("Closing in")
        setIsSaveModalOpen(true)
      } else {
        setResetError("Failed to reset password")
      }
    } catch (err) {
      if (err.response) {
        setResetError(err.response.data.detail || "Failed to reset password")
      } else if (err.request) {
        setResetError("No response from server. Please check your connection.")
      } else {
        setResetError("An error occurred. Please try again.")
      }
      console.error(err)
    } finally {
      setIsResetLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setForgotError("")
    setIsForgotLoading(true)

    if (forgotNewPassword !== forgotVerifyPassword) {
      setForgotError("New password and verify password do not match")
      setIsForgotLoading(false)
      return
    }

    if (forgotNewPassword.length < 8) {
      setForgotError("Password must be at least 8 characters long")
      setIsForgotLoading(false)
      return
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/password/admin-reset`,
        {
          admin_username: forgotUsername,
          new_password: forgotNewPassword,
          superadmin_key: superadminKey,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (response.status === 200) {
        setIsForgotModalOpen(false)
        setForgotUsername("")
        setForgotNewPassword("")
        setForgotVerifyPassword("")
        setSuperadminKey("")
        setSaveModalTitle("Password Recovered")
        setSaveModalMessage("Password reset successfully!")
        setSaveModalTimerMessage("Closing in")
        setIsSaveModalOpen(true)
      } else {
        setForgotError("Failed to reset password")
      }
    } catch (err) {
      if (err.response) {
        setForgotError(err.response.data.detail || "Failed to reset password")
      } else if (err.request) {
        setForgotError("No response from server. Please check your connection.")
      } else {
        setForgotError("An error occurred. Please try again.")
      }
      console.error(err)
    } finally {
      setIsForgotLoading(false)
    }
  }

  const closeResetModal = () => {
    setIsResetModalOpen(false)
    setResetCurrentPassword("")
    setResetNewPassword("")
    setResetVerifyPassword("")
    setResetError("")
    setShowResetCurrentPassword(false)
    setShowResetNewPassword(false)
    setShowResetVerifyPassword(false)
  }

  const closeForgotModal = () => {
    setIsForgotModalOpen(false)
    setForgotUsername("")
    setForgotNewPassword("")
    setSuperadminKey("")
    setForgotVerifyPassword("")
    setForgotError("")
    setShowForgotNewPassword(false)
    setShowForgotVerifyPassword(false)
    setShowSuperadminKey(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Sign in to your admin account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="text-sm text-red-600 hover:text-red-700 transition-colors block"
            >
              Reset Password
            </button>
            <button
              onClick={() => setIsForgotModalOpen(true)}
              className="text-sm text-red-600 hover:text-red-700 transition-colors block"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Reset Password</h2>

            {resetError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {resetError}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showResetCurrentPassword ? "text" : "password"}
                    value={resetCurrentPassword}
                    onChange={(e) => setResetCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowResetCurrentPassword(!showResetCurrentPassword)}
                  >
                    {showResetCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showResetNewPassword ? "text" : "password"}
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                  >
                    {showResetNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verify Password</label>
                <div className="relative">
                  <input
                    type={showResetVerifyPassword ? "text" : "password"}
                    value={resetVerifyPassword}
                    onChange={(e) => setResetVerifyPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Verify new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowResetVerifyPassword(!showResetVerifyPassword)}
                  >
                    {showResetVerifyPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeResetModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
                >
                  {isResetLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Forgot Password</h2>

            {forgotError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {forgotError}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={forgotUsername}
                  onChange={(e) => setForgotUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showForgotNewPassword ? "text" : "password"}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                  >
                    {showForgotNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verify Password</label>
                <div className="relative">
                  <input
                    type={showForgotVerifyPassword ? "text" : "password"}
                    value={forgotVerifyPassword}
                    onChange={(e) => setForgotVerifyPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Verify new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowForgotVerifyPassword(!showForgotVerifyPassword)}
                  >
                    {showForgotVerifyPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Superadmin Key</label>
                <div className="relative">
                  <input
                    type={showSuperadminKey ? "text" : "password"}
                    value={superadminKey}
                    onChange={(e) => setSuperadminKey(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Enter superadmin key"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowSuperadminKey(!showSuperadminKey)}
                  >
                    {showSuperadminKey ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
                >
                  {isForgotLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title={saveModalTitle}
        message={saveModalMessage}
        timerMessage={saveModalTimerMessage}
      />
    </div>
  )
}
