// NotificationsModal.jsx
import React from "react";

const NotificationsModal = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? "visible" : "hidden"
      }`}
    >
      <div
        className="absolute inset-0 bg-[#0a192f] bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-[#112240] p-6 rounded-lg shadow-lg z-10 text-center w-2/3">
        <p>No news updates yet</p>
        <button
          className="mt-4 px-4 py-1 bg-[#16ec6f6c] text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationsModal;