import React from 'react';
function Modal(props) {
  const {handleClose, show, content} = props;
  if (show) {
    return (
      <div className="app-modal">
        <div className="app-modal-content">
          {content}
          <div className="app-modal-close-btn" onClick={handleClose}>
            <span className="close-button" role="img" aria-label="">
              &#10060;{' '}
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default Modal;
