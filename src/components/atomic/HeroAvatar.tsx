interface HeroAvatarProps {
  src?: string;
  name: string;
  active?: boolean;
  onClick?: () => void;
}

export const HeroAvatar = ({ src, name, active = false, onClick }: HeroAvatarProps) => {
  // 默认头像占位
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF9F00&color=fff&rounded=true`;

  return (
    <div 
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1 cursor-pointer transition-all duration-200
        ${active ? 'scale-110' : 'hover:scale-105'}
      `}
    >
      <div className={`
        w-16 h-16 rounded-lg overflow-hidden border-2
        ${active ? 'border-primary shadow-lg' : 'border-transparent'}
        bg-bg-light flex items-center justify-center
      `}>
        <img 
          src={src || defaultAvatar} 
          alt={name} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultAvatar;
          }}
        />
      </div>
      <span className={`text-[12px] text-center line-clamp-1 ${active ? 'text-primary font-bold' : 'text-white'}`}>
        {name}
      </span>
    </div>
  );
};
