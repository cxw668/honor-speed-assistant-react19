import { useState, useMemo, useRef, useEffect } from 'react';
import { useHeroData } from '../../hooks/useHeroData';

interface HeroSelectProps {
  value: number | string;
  onChange: (heroId: number) => void;
  isStatic?: boolean;
}

export const HeroSelect = ({ value, onChange, isStatic = false }: HeroSelectProps) => {
  const { heroList: allHeroes } = useHeroData();
  const [isOpen, setIsOpen] = useState(isStatic);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isStatic && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isStatic]);

  // 当前选中的英雄
  const selectedHero = useMemo(() => {
    return allHeroes.find(h => h.id === Number(value));
  }, [allHeroes, value]);

  // 模糊搜索过滤
  const filteredHeroes = useMemo(() => {
    if (!searchTerm) return allHeroes;
    const lowerSearch = searchTerm.toLowerCase();
    return allHeroes.filter(hero => 
      hero.heroName.toLowerCase().includes(lowerSearch) ||
      hero.heroTypes.some(type => type.toLowerCase().includes(lowerSearch))
    );
  }, [allHeroes, searchTerm]);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (heroId: number) => {
    onChange(heroId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative w-full ${isStatic ? 'h-full flex flex-col' : ''}`} ref={dropdownRef}>
      {/* 触发按钮/输入框 - Static 模式下隐藏 */}
      {!isStatic && (
        <div 
          className={`
            flex items-center gap-3 bg-bg-card border-2 rounded-2xl px-4 py-3 cursor-pointer transition-all
            ${isOpen ? 'border-primary shadow-lg shadow-primary/10' : 'border-border-light hover:border-primary/50'}
          `}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedHero ? (
            <>
              <img src={selectedHero.heroSrc} alt={selectedHero.heroName} className="w-8 h-8 rounded-lg shadow-sm" />
              <span className="text-text-primary font-bold text-lg flex-1">{selectedHero.heroName}</span>
            </>
          ) : (
            <span className="font-bold text-lg flex-1">请选择英雄</span>
          )}
          <svg 
            className={`text-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      )}

      {/* 下拉面板 */}
      {isOpen && (
        <div className={`
          ${isStatic ? 'relative mt-0 border-0 shadow-none flex-1 flex flex-col min-h-0' : 'absolute top-full left-0 right-0 mt-2 border-2 border-border-light shadow-2xl z-[100]'} 
          bg-bg-card rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200
        `}>
          {/* 搜索框 */}
          <div className="p-3 border-b border-border-light bg-bg-page/50">
            <div className="relative">
              <input
                ref={inputRef}
                autoFocus
                type="text"
                placeholder="搜索英雄名称..."
                className="w-full bg-bg-page border border-border-light rounded-xl px-9 py-2 text-sm focus:outline-none focus:border-primary/50 text-text-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
          </div>

          {/* 列表区 */}
          <div className={`${isStatic ? 'flex-1 overflow-y-auto' : 'max-h-[300px] overflow-y-auto'} scrollbar-hide`}>
            {filteredHeroes.length > 0 ? (
              filteredHeroes.map((hero) => (
                <div
                  key={hero.id}
                  className={`
                    flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
                    ${Number(value) === hero.id ? 'bg-primary/10 text-primary' : 'hover:bg-bg-page text-text-primary'}
                  `}
                  onClick={() => handleSelect(hero.id)}
                >
                  <img src={hero.heroSrc} alt={hero.heroName} className="w-10 h-10 rounded-xl shadow-sm" />
                  <div className="flex flex-col">
                    <span className="font-bold">{hero.heroName}</span>
                    <span className="text-[10px] opacity-60">{hero.heroTypes.join(' / ')}</span>
                  </div>
                  {Number(value) === hero.id && (
                    <svg className="ml-auto" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-text-secondary">
                <p className="text-sm">未找到相关英雄</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

