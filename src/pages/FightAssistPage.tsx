import { CDTimer } from '../components/business/CDTimer';
import { WinRateStats } from '../components/business/WinRateStats';
import { Shield, Swords, Info } from 'lucide-react';

export default function FightAssistPage() {
  return (
    <div className="min-h-screen bg-bg-page relative overflow-hidden flex flex-col">
      {/* 动态背景装饰 */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-success/5 rounded-full blur-[120px] translate-y-1/2" />

      {/* 顶部标题区 */}
      <div className="relative z-10 pt-8 pb-4 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-md border border-primary/20">
                Assistant Tools
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter flex items-center gap-3">
              对战辅助工具
              <Swords className="text-primary hidden md:block" size={32} />
            </h1>
          </div>
          <div className="flex items-center gap-4 text-text-secondary text-sm font-medium bg-bg-card/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-border-light">
            <div className="flex items-center gap-1.5">
              <Shield size={16} className="text-success" />
              <span>实时监测</span>
            </div>
            <div className="w-px h-4 bg-border-light" />
            <div className="flex items-center gap-1.5">
              <Info size={16} className="text-primary" />
              <span>智能提醒</span>
            </div>
          </div>
        </div>
      </div>

      {/* 主体内容区 - 左右分栏 */}
      <div className="relative z-10 flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* 左侧：CD计时器 */}
        <div className="animate-in fade-in slide-in-from-left-8 duration-700">
          <CDTimer />
        </div>

        {/* 右侧：胜率统计 */}
        <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
          <WinRateStats />
        </div>
      </div>
      
      {/* 底部小贴士 - 更加精致 */}
      <div className="relative z-10 pb-8 px-6">
        <div className="max-w-2xl mx-auto bg-primary/5 backdrop-blur-sm border border-primary/10 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="p-2 bg-primary/10 rounded-xl text-primary mt-0.5">
            <Info size={18} />
          </div>
          <div className="text-sm text-text-secondary leading-relaxed">
            <strong className="text-text-primary block mb-1">使用贴士：</strong>
            计时器倒计时结束时会有电子音提醒。胜率统计实时计算并自动保存至本地，帮助你随时掌控对战状态，复盘每一场对决。
          </div>
        </div>
      </div>
    </div>
  );
}
