import { HeroAvatar } from '../atomic/HeroAvatar';

interface HeroListProps {
  heroes: any[];
  selectedHeroId?: number;
  onHeroSelect: (id: number) => void;
}

export const HeroList = ({ heroes, selectedHeroId, onHeroSelect }: HeroListProps) => {
  if (heroes.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 card">
        <p className="text-desc">暂无匹配英雄</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-6 p-inner card overflow-y-auto flex-1 scrollbar-beauty">
      {heroes.map(hero => (
        <HeroAvatar
          key={hero.id}
          src={hero.heroSrc || hero.avatar}
          name={hero.heroName}
          active={selectedHeroId === hero.id}
          onClick={() => onHeroSelect(hero.id)}
        />
      ))}
    </div>
  );
};
