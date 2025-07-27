"use client"

import { useEffect, useState } from "react"
import { CheckCircle, X } from "lucide-react"

function SaveModal({ isOpen, onClose, title = "Success", message = "Operation completed successfully!" }) {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (isOpen) {
      setCountdown(3)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            onClose()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl p-8 z-10 w-96 max-w-md mx-4 shadow-2xl transform transition-all duration-300 scale-100">
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-medium text-gray-900">{title}</h2>
            <p className="text-gray-600 font-light">{message}</p>
          </div>

          <div className="text-sm text-gray-500">
            <p>Closing in {countdown} seconds...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaveModal
