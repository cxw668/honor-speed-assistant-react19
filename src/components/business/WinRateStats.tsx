import React, { useState, useMemo } from 'react';
import { Button } from '../atomic/Button';

export const WinRateStats: React.FC = () => {
  const [history, setHistory] = useState<('win' | 'loss')[]>([]);

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

  return (
    <div className="flex flex-col gap-8 p-8 bg-bg-card rounded-[40px] shadow-lg border-2 border-primary/10 h-full">
      <h3 className="title text-center text-xl">对战胜率统计</h3>

      {/* 核心数据展示 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-success/5 border border-success/10 p-6 rounded-3xl flex flex-col items-center justify-center">
          <span className="text-success font-bold text-sm mb-1">胜场</span>
          <span className="text-4xl font-black text-success">{stats.wins}</span>
        </div>
        <div className="bg-danger/5 border border-danger/10 p-6 rounded-3xl flex flex-col items-center justify-center">
          <span className="text-danger font-bold text-sm mb-1">负场</span>
          <span className="text-4xl font-black text-danger">{stats.losses}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-10 bg-primary/5 rounded-[40px] border border-primary/10">
        <div className="text-6xl md:text-7xl font-black text-primary flex items-baseline gap-2">
          {stats.winRate}
          <span className="text-3xl font-bold">%</span>
        </div>
        <p className="text-text-secondary font-medium mt-4">
          总局数: {stats.total} 场
        </p>
      </div>

      {/* 控制按钮 */}
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="primary" onClick={addWin} className="rounded-2xl h-14 bg-success border-success hover:bg-success/90">添加胜场</Button>
          <Button variant="secondary" onClick={addLoss} className="rounded-2xl h-14 text-danger border-danger hover:bg-danger/5">添加负场</Button>
        </div>
        <Button 
          variant="secondary" 
          onClick={removeLast} 
          disabled={history.length === 0}
          className="rounded-2xl h-12 text-text-secondary border-border-light text-sm"
        >
          删除最后一条
        </Button>
      </div>
    </div>
  );
};
