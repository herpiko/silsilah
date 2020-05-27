import React from "react";
function Modal(props) {
  const { handleClose, show, content } = props;
  if (show) {
    return (
      <div className="app-modal">
        <div className="app-modal-content">
          {content}
          <button className="app-modal-close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default Modal;
