import { Search, X } from 'lucide-react';

interface HeroSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const HeroSearch = ({ value, onChange, placeholder = "搜索英雄名称..." }: HeroSearchProps) => {
  return (
    <div className="relative w-full group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors duration-200">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-11 pr-10 py-2 bg-bg-page/50 border border-border-light rounded-xl text-[15px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-bg-page transition-all duration-300"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all cursor-pointer border-none bg-transparent"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
