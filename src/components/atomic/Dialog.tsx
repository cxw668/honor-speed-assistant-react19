import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Box, Typography, IconButton,type SxProps, type Theme, alpha } from '@mui/material';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * 弹窗组件
 * @param isOpen 是否打开
 * @param onClose 关闭回调
 * @param title 标题
 * @param children 内容
 * @param sx 自定义样式
 */
export const Dialog = ({ isOpen, onClose, title, children, sx }: DialogProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <Box 
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      {/* Overlay */}
      <Box 
        onClick={onClose}
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease-out',
          '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          }
        }}
      />
      
      {/* Dialog Content */}
      <Box 
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '672px', // max-w-2xl
          maxHeight: '90vh',
          borderRadius: 4, // 16px
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: (theme) => alpha(theme.palette.divider, 0.1),
          animation: 'zoomIn 0.2s ease-out',
          '@keyframes zoomIn': {
            from: { opacity: 0, transform: 'scale(0.95)' },
            to: { opacity: 1, transform: 'scale(1)' },
          },
          ...sx
        }}
      >
        {/* Header */}
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {title}
          </Typography>
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                bgcolor: (theme) => alpha(theme.palette.text.primary, 0.05),
              }
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>

        {/* Body */}
        <Box 
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: (theme) => alpha(theme.palette.text.primary, 0.1),
              borderRadius: '3px',
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>,
    document.body
  );
};
