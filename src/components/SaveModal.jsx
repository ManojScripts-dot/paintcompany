
import { useEffect, useState } from "react";

function SaveModal({
  isOpen,
  onClose,
  title = "Success",
  message = "Products Added successfully.✅",

}) {
  const [countdown, setCountdown] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setCountdown(1); 
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer); 
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-500 opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 z-10 w-96 text-center">
        <div className="flex justify-center mb-4">
          <svg
            className="h-12 w-12 text-green-500"
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600">{message}</p>
        <p className="text-sm text-gray-500 mt-2">
          
        </p>
      </div>
    </div>
  );
}

export default SaveModal;