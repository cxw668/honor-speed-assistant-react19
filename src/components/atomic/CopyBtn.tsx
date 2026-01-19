import { useState } from 'react';
import { Button } from './Button';
import { Toast } from './Toast';

interface CopyBtnProps {
  text: string;
  label?: string;
}

export const CopyBtn = ({ text, label = '一键复制出装' }: CopyBtnProps) => {
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

  return (
    <div className="w-full flex flex-col gap-3">
      <Button fullWidth onClick={handleCopy}>
        <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        {label}
      </Button>

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
