
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import logo from "../../assets/logo.png"
import SaveModal from "../../components/SaveModal"// Adjust the path based on your file structure

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

  const API_BASE_URL = 'https://paintcompanybackend.onrender.com'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)

      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      if (response.data && response.data.access_token) {
        localStorage.setItem('authToken', response.data.access_token)
        localStorage.setItem(
          "adminAuth",
          JSON.stringify({
            isAuthenticated: true,
            user: { username, role: "admin" },
          })
        )
        setSaveModalTitle("Login Complete")
        setSaveModalMessage("Login successful! Redirecting to dashboard...")
        setSaveModalTimerMessage("Redirecting in")
        setIsSaveModalOpen(true)
        setTimeout(() => {
          navigate("/admin/dashboard")
        }, 1000) // Navigate after SaveModal closes
      } else {
        setError("Invalid response from server")
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid username or password")
        } else {
          setError(`Server error: ${err.response.data.detail || 'Unknown error'}`)
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
      const authToken = localStorage.getItem('authToken')
      
      if (!authToken) {
        setResetError("You must be logged in to reset your password")
        setIsResetLoading(false)
        return
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/admin/password/reset-password`,
        {
          old_password: resetCurrentPassword,
          new_password: resetNewPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        }
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
          superadmin_key: superadminKey
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
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

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )

  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-4 xs:p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6 xs:mb-8">
          <img src={logo || "/placeholder.svg"} alt="Lubro Paints Logo" className="h-16 xs:h-20" />
        </div>

        <h1 className="text-xl xs:text-2xl font-bold text-center text-gray-800 mb-4 xs:mb-6">Admin Login</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm xs:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logoPurple text-sm xs:text-base"
              placeholder="admin"
              required
            />
          </div>

          <div className="mb-4 xs:mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logoPurple text-sm xs:text-base"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-popRed hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex justify-center items-center text-sm xs:text-base"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center space-x-4">
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="text-sm xs:text-base text-logoPurple hover:text-purple-700"
          >
            Reset Password
          </button>
          <button
            onClick={() => setIsForgotModalOpen(true)}
            className="text-sm xs:text-base text-logoPurple hover:text-purple-700"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {isResetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 xs:p-6 max-w-sm w-full">
            <h2 className="text-lg xs:text-xl font-bold text-gray-800 mb-4 text-center">Reset Password</h2>

            {resetError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm xs:text-base">
                {resetError}
              </div>
            )}

            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label htmlFor="current-password" className="block text-gray-700 text-sm font-medium mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showResetCurrentPassword ? "text" : "password"}
                    value={resetCurrentPassword}
                    onChange={(e) => setResetCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logoPurple text-sm xs:text-base"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowResetCurrentPassword(!showResetCurrentPassword)}
                  >
                    {showResetCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="new-password" className="block text-gray-700 text-sm font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showResetNewPassword ? "text" : "password"}
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logoPurple text-sm xs:text-base"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                  >
                    {showResetNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="mb-4 xs:mb-6">
                <label htmlFor="verify-password" className="block text-gray-700 text-sm font-medium mb-2">
                  Verify Password
                </label>
                <div className="relative">
                  <input
                    id="verify-password"
                    type={showResetVerifyPassword ? "text" : "password"}
                    value={resetVerifyPassword}
                    onChange={(e) => setResetVerifyPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logoPurple text-sm xs:text-base"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowResetVerifyPassword(!showResetVerifyPassword)}
                  >
                    {showResetVerifyPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between gap-2 xs:gap-3">
                <button
                  type="button"
                  onClick={closeResetModal}
                  className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300 text-sm xs:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetLoading}
                  className="w-1/2 bg-popRed hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex justify-center items-center text-sm xs:text-base"
                >
                  {isResetLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  {isResetLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 xs:p-6 max-w-sm w-full">
            <h2 className="text-lg xs:text-xl font-bold text-gray-800 mb-4 text-center">Forgot Password</h2>

            {forgotError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm xs:text-base">
                {forgotError}
              </div>
            )}

            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label htmlFor="forgot-username" className="block text-gray-700 text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  id="forgot-username"
                  type="text"
                  value={forgotUsername}
                  onChange={(e) => setForgotUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logoPurple text-sm xs:text-base"
                  placeholder="admin"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="forgot-new-password" className="block text-gray-700 text-sm font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="forgot-new-password"
                    type={showForgotNewPassword ? "text" : "password"}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logoPurple text-sm xs:text-base"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                  >
                    {showForgotNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="forgot-verify-password" className="block text-gray-700 text-sm font-medium mb-2">
                  Verify Password
                </label>
                <div className="relative">
                  <input
                    id="forgot-verify-password"
                    type={showForgotVerifyPassword ? "text" : "password"}
                    value={forgotVerifyPassword}
                    onChange={(e) => setForgotVerifyPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logoPurple text-sm xs:text-base"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowForgotVerifyPassword(!showForgotVerifyPassword)}
                  >
                    {showForgotVerifyPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="mb-4 xs:mb-6">
                <label htmlFor="superadmin-key" className="block text-gray-700 text-sm font-medium mb-2">
                  Superadmin Key
                </label>
                <div className="relative">
                  <input
                    id="superadmin-key"
                    type={showSuperadminKey ? "text" : "password"}
                    value={superadminKey}
                    onChange={(e) => setSuperadminKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logoPurple text-sm xs:text-base"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowSuperadminKey(!showSuperadminKey)}
                  >
                    {showSuperadminKey ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between gap-2 xs:gap-3">
                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300 text-sm xs:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-1/2 bg-popRed hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex justify-center items-center text-sm xs:text-base"
                >
                  {isForgotLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  {isForgotLoading ? "Resetting..." : "Reset Password"}
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
