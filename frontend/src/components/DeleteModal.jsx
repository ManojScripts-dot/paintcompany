import { X } from "lucide-react"; // Add the missing import

function DeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onCancel}></div>
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 w-80">
      <div className="flex justify-center mb-4">
      <svg
              className="text-popRed h-10 w-10"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
        </div>
        <div className="flex items-center">
          <p className="text-gray-700">Are you sure you want to delete?</p>
        </div>
        <div className="flex items-center mb-4">
          <p className="text-gray-500">(This can't be undone!!)</p>
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
            className="px-3 py-1 bg-popRed text-white rounded hover:bg-red-700"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;