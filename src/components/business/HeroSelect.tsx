import { heroList } from '../../mock/hero/index';
import { Select } from '../atomic/Select';

interface HeroSelectProps {
  value: number | string;
  onChange: (heroId: number) => void;
}

export const HeroSelect = ({ value, onChange }: HeroSelectProps) => {
  const options = Object.values(heroList).flatMap(heroes => heroes.map(hero => ({
    value: hero.id,
    label: hero.heroName
  })));

  return (
    <Select
      label="选择英雄"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      options={[{ value: '', label: '请选择英雄' }, ...options]}
      fullWidth
    />
  );
};
