import React from "react";

const ResumeModal = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center">
      <div className="relative bg-white p-4 rounded-xl shadow-2xl">
        <button className="absolute -top-3 -right-3 text-2xl text-rose-600" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <img src={imageUrl} alt="resume" className="max-w-[90vw] max-h-[80vh] h-auto rounded-md" />
      </div>
    </div>
  );
};

export default ResumeModal;
