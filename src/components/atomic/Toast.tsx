import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Box, alpha, useTheme } from '@mui/material';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

export const Toast = ({ message, duration = 2000, onClose, type = 'info' }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    info: theme.palette.primary.main
  };

  return createPortal(
    <Box className={`
      fixed top-10 left-1/2 -translate-x-1/2 z-1500
      w-max max-w-[90vw]
      ${isVisible ? 'animate-in fade-in slide-in-from-top-4' : 'animate-out fade-out slide-out-to-top-4'}
      duration-300
    `}>
      <Box 
        sx={{
          bgcolor: alpha(colors[type], 0.85),
          backdropFilter: 'blur(12px)',
          color: 'white',
          px: 3,
          py: 1.5,
          borderRadius: '9999px',
          boxShadow: `0 8px 32px ${alpha(colors[type], 0.3)}`,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          border: '1px solid',
          borderColor: alpha('#fff', 0.2),
          whiteSpace: 'pre-line',
          textAlign: 'center'
        }}
      >
        {type === 'success' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
        {message}
      </Box>
    </Box>,
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
