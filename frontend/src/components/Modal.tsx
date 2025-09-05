import React from 'react';

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  submitText?: string;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, onSubmit, submitText = 'Save', children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded shadow-lg w-full max-w-lg">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="p-4">
          {children}
        </div>
        <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
          {onSubmit && (
            <button onClick={onSubmit} className="px-3 py-1 bg-blue-600 text-white rounded">{submitText}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;


