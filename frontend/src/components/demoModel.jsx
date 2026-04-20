import React from "react";
import "./demoModal.css";

const DemoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <span className="close-btn" onClick={onClose}>
          ×
        </span>

        {/* YouTube Video */}
        <iframe
          width="100%"
          height="400"
          src="https://www.youtube.com/embed/zuwjScQG-zc"
          title="Demo Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default DemoModal;