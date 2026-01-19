import React, { useState, useMemo, useEffect } from 'react';
import { Trophy, Frown, BarChart3, Plus, Minus, Trash2, History } from 'lucide-react';

export const WinRateStats: React.FC = () => {
  // 从 localStorage 初始化，增加持久化体验
  const [history, setHistory] = useState<('win' | 'loss')[]>(() => {
    const saved = localStorage.getItem('fight_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fight_history', JSON.stringify(history));
  }, [history]);

  const stats = useMemo(() => {
    const wins = history.filter(item => item === 'win').length;
    const losses = history.filter(item => item === 'loss').length;
    const total = history.length;
    const winRate = total === 0 ? 0 : Math.round((wins / total) * 100);
    
    return { wins, losses, total, winRate };
  }, [history]);

  const addWin = () => setHistory([...history, 'win']);
  const addLoss = () => setHistory([...history, 'loss']);
  const removeLast = () => setHistory(history.slice(0, -1));
  const clearAll = () => {
    if (window.confirm('确定要清空所有对战记录吗？')) {
      setHistory([]);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 bg-bg-card rounded-[40px] shadow-2xl border-2 border-primary/10 h-full relative overflow-hidden group">
      {/* 装饰背景 */}
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-success/5 rounded-full blur-3xl group-hover:bg-success/10 transition-colors" />

      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-xl font-black text-text-primary flex items-center gap-2">
          <BarChart3 size={20} className="text-primary" />
          胜率统计
        </h3>
        <button 
          onClick={clearAll}
          className="p-2 text-text-secondary hover:text-danger transition-colors rounded-lg hover:bg-danger/5"
          title="清空记录"
        >
          <History size={16} />
        </button>
      </div>

      {/* 核心数据展示 - 战绩卡片风格 */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="relative overflow-hidden bg-success/5 border-2 border-success/10 p-5 rounded-3xl flex flex-col items-center group/card transition-all hover:border-success/30">
          <Trophy size={40} className="absolute -right-2 -top-2 text-success/10 rotate-12 transition-transform group-hover/card:scale-125" />
          <span className="text-success font-black text-[10px] uppercase tracking-widest mb-1">Victory</span>
          <span className="text-4xl font-black text-success tabular-nums">{stats.wins}</span>
          <div className="mt-2 h-1 w-8 bg-success/20 rounded-full" />
        </div>
        
        <div className="relative overflow-hidden bg-danger/5 border-2 border-danger/10 p-5 rounded-3xl flex flex-col items-center group/card transition-all hover:border-danger/30">
          <Frown size={40} className="absolute -right-2 -top-2 text-danger/10 rotate-12 transition-transform group-hover/card:scale-125" />
          <span className="text-danger font-black text-[10px] uppercase tracking-widest mb-1">Defeat</span>
          <span className="text-4xl font-black text-danger tabular-nums">{stats.losses}</span>
          <div className="mt-2 h-1 w-8 bg-danger/20 rounded-full" />
        </div>
      </div>

      {/* 总胜率圆盘/进度展示 */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-4">
        <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
          {/* 背景环 */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%" cy="50%" r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-bg-page"
            />
            {/* 胜率环 */}
            <circle
              cx="50%" cy="50%" r="45%"
              fill="none"
              stroke="url(#winRateGradient)"
              strokeWidth="12"
              strokeDasharray="283"
              strokeDashoffset={283 * (1 - stats.winRate / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="winRateGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="flex flex-col items-center animate-in zoom-in duration-700">
            <div className="text-5xl md:text-6xl font-black text-text-primary flex items-baseline leading-none">
              {stats.winRate}
              <span className="text-xl font-bold ml-1 text-primary">%</span>
            </div>
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mt-2">Win Rate</span>
          </div>
        </div>
        
        <p className="mt-4 px-4 py-1.5 bg-primary/5 rounded-full text-xs font-bold text-primary border border-primary/10">
          TOTAL BATTLES: {stats.total}
        </p>
      </div>

      {/* 控制按钮组 */}
      <div className="flex flex-col gap-3 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={addWin}
            className="group h-14 rounded-2xl bg-success text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-success/20 hover:shadow-success/40 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Plus size={20} className="transition-transform group-hover:rotate-90" />
            胜场
          </button>
          <button
            onClick={addLoss}
            className="group h-14 rounded-2xl bg-danger text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-danger/20 hover:shadow-danger/40 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Minus size={20} className="transition-transform group-hover:scale-125" />
            负场
          </button>
        </div>
        
        <button
          onClick={removeLast}
          disabled={history.length === 0}
          className="h-12 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm bg-bg-page text-text-secondary border-2 border-border-light hover:border-danger/30 hover:text-danger disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Trash2 size={16} />
          撤销最后一条
        </button>
      </div>
    </div>
  );
};
