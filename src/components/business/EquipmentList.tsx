import { useState } from 'react';
import { EquipmentCard } from '../atomic/EquipmentCard';
import { Dialog } from '../atomic/Dialog';

interface Equipment {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

interface EquipmentListProps {
  list: Equipment[];
  onUpdateList: (newList: Equipment[]) => void;
}

// 模拟备选装备数据
const MOCK_REPLACEMENTS: Equipment[] = [
  { id: 'r1', name: '名刀·司命', icon: 'https://game.gtimg.cn/images/yxzj/img201606/itemimg/1343.jpg', desc: '受到致命伤害时进入无敌状态，保命神器。' },
  { id: 'r2', name: '破军', icon: 'https://game.gtimg.cn/images/yxzj/img201606/itemimg/1132.jpg', desc: '大幅提升物理攻击，对低血量敌人造成额外伤害。' },
  { id: 'r3', name: '纯净苍穹', icon: 'https://game.gtimg.cn/images/yxzj/img201606/itemimg/11311.jpg', desc: '提供免伤效果，主动开启可抵挡大量爆发。' },
  { id: 'r4', name: '极寒风暴', icon: 'https://game.gtimg.cn/images/yxzj/img201606/itemimg/1335.jpg', desc: '提供冷却缩减和法力值，受到高额伤害时触发冰心减速。' }
];

export const EquipmentList = ({ list, onUpdateList }: EquipmentListProps) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemClick = (idx: number) => {
    setSelectedIdx(idx);
    setIsDialogOpen(true);
  };

  const handleReplace = (replacement: Equipment) => {
    if (selectedIdx !== null) {
      const newList = [...list];
      newList[selectedIdx] = replacement;
      onUpdateList(newList);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-5">
        {list.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex flex-col gap-2">
            <EquipmentCard
              name={item.name}
              icon={item.icon}
              desc={item.desc}
              onClick={() => handleItemClick(idx)}
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
              <span className="text-primary font-bold text-xs shrink-0">为什么出</span>
              <p className="text-text-secondary text-xs italic">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="装备替换 (新手首选)"
      >
        <div className="flex flex-col gap-4">
          <p className="text-text-secondary text-sm px-1 mb-2">根据当前局势，你可以选择以下备选装备进行替换：</p>
          {MOCK_REPLACEMENTS.map((item) => (
            <EquipmentCard
              key={item.id}
              name={item.name}
              icon={item.icon}
              desc={item.desc}
              isReplacement
              onClick={() => handleReplace(item)}
            />
          ))}
        </div>
      </Dialog>
    </div>
  );
};
