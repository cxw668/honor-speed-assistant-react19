import type { HeroItem } from '../../types';

interface HeroDetailCardProps {
  hero?: HeroItem;
}

export const HeroDetailCard = ({ hero }: HeroDetailCardProps) => {
  if (!hero) {
    return (
      <div className="flex-1 flex justify-center items-center card border-dashed border-2 border-[#ddd]">
        <div className="text-desc text-[16px]"> ⬆️点击英雄查看详情</div>
      </div>
    );
  }

  const renderStars = (count: number) => {
    return '★'.repeat(count);
  };

  return (
    <div className="h-full flex flex-col gap-module animate-in fade-in duration-300 pr-2">
      <div className="card shrink-0">
        <div className="flex justify-between items-start">
          <h2 className="title text-[24px]">{hero.heroName}</h2>
          <span className="timer text-[20px]">{renderStars(hero.difficulty)}</span>
        </div>
        <div className="flex gap-2">
          {hero.heroType && 
            <span key={hero.heroType} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[12px] font-bold">
              {hero.heroType}
            </span>
          }
          {hero.isNewbieRecommend && (
            <span className="bg-success/10 text-success px-2 py-0.5 rounded text-[12px] font-bold">
              新手推荐
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-element-large">
        <div className="card border-l-4 border-primary">
          <h4 className="text-desc font-bold text-primary">核心定位</h4>
          <p className="text-main mt-1">{hero.corePosition}</p>
        </div>
        <div className="card border-l-4 border-success">
          <h4 className="text-desc font-bold text-success">战斗特点</h4>
          <p className="text-main mt-1">{hero.combatFeature}</p>
        </div>
      </div>

      <div className="card">
        <h4 className="title">上手建议</h4>
        <p className="text-main mt-2">
          {hero.isNewbieRecommend 
            ? "该英雄操作门槛较低，技能逻辑清晰，非常适合新手玩家快速上手，在对局中能通过简单的连招发挥巨大作用。" 
            : "该英雄对操作节奏或意识有一定要求，建议在训练营熟悉技能机制后再进入实战对局。"}
        </p>
      </div>
    </div>
  );
};
