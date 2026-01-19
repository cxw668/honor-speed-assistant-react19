import { CDTimer } from '../components/business/CDTimer';
import { WinRateStats } from '../components/business/WinRateStats';

export default function FightAssistPage() {
  return (
    <div className="h-full flex flex-col bg-bg-page overflow-hidden p-6">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col md:flex-row gap-6">
        {/* 左侧：CD计时器 */}
        <div className="flex-1 min-h-[500px]">
          <CDTimer />
        </div>

        {/* 右侧：胜率统计 */}
        <div className="flex-1 min-h-[500px]">
          <WinRateStats />
        </div>
      </div>
      
      {/* 底部小贴士 */}
      <div className="mt-6 text-center text-text-secondary text-sm animate-in fade-in duration-700">
        <p>💡 提示：计时器倒计时结束时会有电子音提醒。胜率统计实时计算，帮助你掌控对战状态。</p>
      </div>
    </div>
  );
}
