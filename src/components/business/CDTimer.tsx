import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../atomic/Button';
import SkillsData from '@/mock/equipment/summonerSkills.json';

interface Skill {
  name: string;
  cd: number;
  icon: string;
}

const SKILLS: Skill[] = (SkillsData as any[]).map(item => {
  const cdMatch = item.description.match(/(\d+)秒CD/);
  return {
    name: item.name,
    cd: cdMatch ? parseInt(cdMatch[1]) : 90,
    icon: item.icon
  };
});

export const CDTimer: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<Skill>(SKILLS[0]);
  const [timeLeft, setTimeLeft] = useState<number>(SKILLS[0].cd);
  const [isActive, setIsActive] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // 播放提示音 (使用 Web Audio API 生成简单的电子音，避免依赖外部音频文件)
  const playAlert = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.error('Audio alert failed:', e);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            playAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill);
    setTimeLeft(skill.cd);
    setIsActive(false);
  };

  const handleStart = () => {
    if (timeLeft > 0) setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(selectedSkill.cd);
  };

  return (
    <div className="flex flex-col gap-8 p-8 bg-bg-card rounded-[40px] shadow-lg border-2 border-primary/10 h-full">
      <h3 className="title text-center text-xl">召唤师技能CD计时器</h3>

      {/* 技能选择 */}
      <div className="grid grid-cols-3 gap-4">
        {SKILLS.map((skill) => (
          <button
            key={skill.name}
            onClick={() => handleSkillSelect(skill)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${selectedSkill.name === skill.name
                ? 'border-primary bg-primary/10 shadow-md'
                : 'border-transparent bg-bg-page hover:border-primary/30'
              }`}
          >
            <img src={skill.icon} alt={skill.name} className="w-12 h-12 rounded-xl shadow-sm" />
            <span className={`text-xs font-bold ${selectedSkill.name === skill.name ? 'text-primary' : 'text-text-secondary'}`}>
              {skill.name}
            </span>
          </button>
        ))}
      </div>

      {/* 倒计时展示 */}
      <div className="flex-1 flex flex-col items-center justify-center py-10">
        <div className={`text-7xl md:text-8xl font-black font-mono tracking-tighter transition-colors ${timeLeft === 0 ? 'text-success animate-pulse' : 'text-primary'}`}>
          {timeLeft}
          <span className="text-2xl ml-2 font-bold">s</span>
        </div>
        <p className="text-text-secondary font-medium mt-4">
          {selectedSkill.name} 冷却中
        </p>
      </div>

      {/* 控制按钮 */}
      <div className="grid grid-cols-3 gap-4">
        {!isActive ? (
          <Button variant="primary" onClick={handleStart} className="rounded-2xl h-14 text-lg">开始</Button>
        ) : (
          <Button variant="secondary" onClick={handlePause} className="rounded-2xl h-14 text-lg">暂停</Button>
        )}
        <Button variant="secondary" onClick={handleReset} className="rounded-2xl h-14 text-lg">重置</Button>
      </div>
    </div>
  );
};
