import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

export const Toast = ({ message, duration = 2000, onClose, type = 'info' }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-success',
    error: 'bg-danger',
    info: 'bg-primary'
  };

  return createPortal(
    <div className={`
      fixed top-10 left-1/2 -translate-x-1/2 z-100
      ${isVisible ? 'animate-in fade-in slide-in-from-top-4' : 'animate-out fade-out slide-out-to-top-4'}
      duration-300
    `}>
      <div className={`${bgColors[type]} text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-3`}>
        {type === 'success' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
        {message}
      </div>
    </div>,
    document.body
  );
};

export const showToast = (_message: string, _type: 'success' | 'error' | 'info' = 'info') => {
  // This is a simplified version. For a real app, you might want a more robust toast manager.
  const container = document.getElementById('toast-root') || document.createElement('div');
  if (!container.id) {
    container.id = 'toast-root';
    document.body.appendChild(container);
  }
  // Logic for managing multiple toasts would go here
};
