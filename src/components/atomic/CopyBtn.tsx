import { useState } from 'react';
import { Button } from './Button';
import { Toast } from './Toast';
import Tooltip from '@mui/material/Tooltip';

interface CopyBtnProps {
  text: string;
  label?: string;
  title?: string;
  className?: string;
}

export const CopyBtn = ({ text, label = '复制出装', title, className = 'w-full flex flex-col gap-3' }: CopyBtnProps) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showFallback, setShowFallback] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setToastMsg('出装方案已复制');
        setToastType('success');
        setShowToast(true);
      } else {
        throw new Error('Clipboard API not available');
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
      setShowFallback(true);
      setToastMsg('复制失败，请手动复制');
      setToastType('error');
      setShowToast(true);
    }
  };

  const buttonContent = (
    <Button fullWidth onClick={handleCopy}>
      <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      {label}
    </Button>
  );

  return (
    <div className={className}>
      {title ? (
        <Tooltip 
          title={<div className="whitespace-pre-line text-[11px] leading-relaxed p-1">{title}</div>} 
          arrow 
          placement="top"
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: 'rgba(31, 41, 55, 0.95)',
                backdropFilter: 'blur(4px)',
                color: '#fff',
                borderRadius: '12px',
                padding: '8px 12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxWidth: '300px'
              }
            },
            arrow: {
              sx: {
                color: 'rgba(31, 41, 55, 0.95)'
              }
            }
          }}
        >
          {buttonContent}
        </Tooltip>
      ) : (
        buttonContent
      )}
      
      {showFallback && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <textarea
            readOnly
            value={text}
            className="w-full h-24 p-3 bg-bg-page border-2 border-dashed border-border-light rounded-xl text-sm text-text-secondary focus:outline-none"
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          />
          <p className="text-[12px] text-text-secondary mt-1 text-center">由于系统限制，请长按上方文本框手动全选复制</p>
        </div>
      )}

      {showToast && (
        <Toast 
          message={toastMsg} 
          type={toastType} 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
};
