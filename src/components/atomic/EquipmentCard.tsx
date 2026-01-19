interface EquipmentCardProps {
  name: string;
  icon: string;
  desc?: string;
  onClick?: () => void;
  isReplacement?: boolean;
}

export const EquipmentCard = ({ name, icon, desc, onClick, isReplacement = false }: EquipmentCardProps) => {
  return (
    <div 
      onClick={onClick}
      className={`
        group flex items-center gap-4 p-4 bg-bg-card rounded-2xl border-2 border-transparent 
        hover:border-primary/30 transition-all cursor-pointer active:scale-[0.98]
        ${isReplacement ? 'shadow-sm' : 'shadow-md'}
      `}
    >
      <div className="relative shrink-0">
        <img 
          src={icon} 
          alt={name} 
          className="w-14 h-14 rounded-xl object-cover border border-border-light group-hover:border-primary/50 transition-colors"
        />
        {isReplacement && (
          <div className="absolute -top-2 -right-2 bg-success text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
            新手首选
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-text-primary text-lg truncate">{name}</h4>
        {desc && <p className="text-text-secondary text-sm line-clamp-2 mt-0.5">{desc}</p>}
      </div>

      {!isReplacement && (
        <div className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity pr-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      )}
    </div>
  );
};
