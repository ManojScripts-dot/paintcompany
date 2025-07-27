"use client"

import { CheckCircle, X } from "lucide-react"

function ConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel}></div>
      <div className="bg-white rounded-2xl p-8 z-10 w-96 max-w-md mx-4 shadow-2xl">
        <div className="flex justify-end mb-2">
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-medium text-gray-900">Confirm Action</h2>
            <p className="text-gray-600 font-light">Are you sure you want to save this product?</p>
            <p className="text-sm text-gray-500 font-light">Please confirm to proceed.</p>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors duration-200"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
