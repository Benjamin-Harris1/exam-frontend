import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40 flex justify-center items-center">
      <div
        className="bg-white rounded-lg shadow-xl m-4 sm:m-8"
        style={{ maxWidth: "500px", width: "100%", maxHeight: "90vh" }}
      >
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-auto p-4" style={{ maxHeight: "80vh" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
