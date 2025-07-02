import { X } from "lucide-react";

function ConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onCancel}></div>
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 w-80">
        <div className="flex justify-center mb-4">
          <svg
            className="h-10 w-10 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l2 2 4-4" />
          </svg>
        </div>
        <div className="flex justify-center mb-2">
          <p className="text-gray-700 text-center">Are you sure you want to save this product?</p>
        </div>
        <div className="flex justify-center mb-4">
          <p className="text-gray-500 text-sm text-center">Please confirm to proceed.</p>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;