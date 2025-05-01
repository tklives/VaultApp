interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }
  
  export default function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative animate-fadeIn scale-95 transition-transform duration-300">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  }
  