interface HeroSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const HeroSearch = ({ value, onChange, placeholder = "搜索英雄名称..." }: HeroSearchProps) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-4 py-2 bg-white border border-[#ddd] rounded-lg text-[16px] text-text-main placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-danger cursor-pointer border-none bg-transparent text-[18px]"
        >
          ×
        </button>
      )}
    </div>
  );
};
