interface HeroDetailCardProps {
  hero?: any;
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
    <div className="h-full flex flex-col text-white gap-module animate-in fade-in duration-300 pr-2">
      <div className="bg-white/5 p-4 rounded-xl shrink-0">
        <div className="flex justify-between items-start">
          <h2 className="text-[24px] font-bold text-white mb-2">{hero.heroName}</h2>
          <span className="text-yellow-400 text-[20px] drop-shadow-sm">{renderStars(hero.difficulty)}</span>
        </div>
        <div className="flex gap-2 mt-1">
          {hero.heroTypes?.map((type: string) => (
            <span key={type} className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-[12px] font-bold border border-primary/20">
              {type}
            </span>
          ))}
          {!hero.heroTypes && hero.heroType && (
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-[12px] font-bold border border-primary/20">
              {hero.heroType}
            </span>
          )}
          {hero.isNewbieRecommend && (
            <span className="bg-success/20 text-success px-3 py-1 rounded-lg text-[12px] font-bold border border-success/20">
              新手推荐
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-element-large">
        <div className="bg-white/5 p-4 rounded-xl border-l-4 border-primary">
          <h4 className="text-[14px] font-bold text-primary mb-1">核心定位</h4>
          <p className="text-white/90 text-[15px] leading-relaxed">{hero.corePosition}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-xl border-l-4 border-success">
          <h4 className="text-[14px] font-bold text-success mb-1">战斗特点</h4>
          <p className="text-white/90 text-[15px] leading-relaxed">{hero.combatFeature}</p>
        </div>
      </div>

      <div className="bg-white/5 p-5 rounded-xl border border-white/10">
        <h4 className="text-[#FF7676] font-bold text-[16px] mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF7676]"></span>
          上手建议
        </h4>
          <p className="text-white/80 text-[14px] leading-relaxed italic" style={{ textIndent: '2em'}}>
          {hero.isNewbieRecommend 
            ? "该英雄操作门槛较低，技能逻辑清晰，非常适合新手玩家快速上手，在对局中能通过简单的连招发挥巨大作用。" 
            : "该英雄对操作节奏或意识有一定要求，建议在训练营熟悉技能机制后再进入实战对局。"}
        </p>
      </div>
    </div>
  );
};
