interface TagProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Tag = ({ children, active = false, onClick, className = "" }: TagProps) => {
  return (
    <span
      onClick={onClick}
      className={`
        px-3 py-1 rounded-full text-[14px] cursor-pointer transition-all duration-200
        ${active 
          ? 'bg-primary text-white' 
          : 'bg-bg-light text-text-secondary hover:bg-[#EEEEEE]'}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
