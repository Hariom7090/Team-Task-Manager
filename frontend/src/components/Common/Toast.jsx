import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiXCircle } from 'react-icons/fi';

const Toast = ({ type, message, onClose }) => {
  const icons = {
    success: <FiCheckCircle className="text-green-500" size={20} />,
    error: <FiXCircle className="text-red-500" size={20} />,
    warning: <FiAlertCircle className="text-yellow-500" size={20} />,
    info: <FiInfo className="text-blue-500" size={20} />
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3 min-w-[300px]">
        {icons[type]}
        <p className="flex-1 text-gray-800">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FiXCircle size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;