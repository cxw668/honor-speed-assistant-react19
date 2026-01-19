import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, BellRing } from 'lucide-react';
import SkillsData from '../../mock/equipment/summonerSkills.json';

interface Skill {
  name: string;
  cd: number;
  icon: string;
}

// 仅展示 6 个常用技能
const ALLOWED_SKILLS = ['闪现', '治疗术', '惩击', '净化', '眩晕', '弱化'];

const SKILLS: Skill[] = (SkillsData as any[])
  .filter(item => ALLOWED_SKILLS.includes(item.name))
  .map(item => {
    const cdMatch = item.description.match(/(\d+)秒CD/);
    return {
      name: item.name === '治疗术' ? '治疗' : (item.name === '惩击' ? '惩戒' : item.name),
      cd: cdMatch ? parseInt(cdMatch[1]) : 90,
      icon: item.icon
    };
  });

export const CDTimer: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<Skill>(SKILLS[0]);
  const [timeLeft, setTimeLeft] = useState<number>(SKILLS[0].cd);
  const [isActive, setIsActive] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化音频
  useEffect(() => {
    // 预留本地音频文件接口，若无文件则使用 Web Audio API 降级
    audioRef.current = new Audio('/audio/alert.mp3');
    audioRef.current.volume = 0.5;
  }, []);

  const playAlert = () => {
    // 优先尝试播放本地文件
    if (audioRef.current && audioRef.current.readyState >= 2) {
      audioRef.current.play().catch(() => playFallbackTone());
    } else {
      playFallbackTone();
    }
  };

  // Web Audio API 降级方案
  const playFallbackTone = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.error('Audio alert failed:', e);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
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

  const handleToggle = () => {
    if (timeLeft > 0) setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(selectedSkill.cd);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 bg-bg-card rounded-[40px] shadow-2xl border-2 border-primary/10 h-full relative overflow-hidden group">
      {/* 装饰背景 */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-xl font-black text-text-primary flex items-center gap-2">
          <Zap size={20} className="text-primary fill-primary/20" />
          CD 计时器
        </h3>
        {isActive && (
          <div className="flex items-center gap-1 text-primary animate-pulse">
            <BellRing size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Timing...</span>
          </div>
        )}
      </div>

      {/* 技能选择 - 更加紧凑且精致 */}
      <div className="grid grid-cols-3 gap-3 relative z-10">
        {SKILLS.map((skill) => (
          <button
            key={skill.name}
            onClick={() => handleSkillSelect(skill)}
            className={`
              relative flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300
              ${selectedSkill.name === skill.name
                ? 'bg-primary shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)] ring-2 ring-primary ring-offset-2 ring-offset-bg-card'
                : 'bg-bg-page hover:bg-primary/5 border border-border-light'
              }
            `}
          >
            <div className="relative">
              <img 
                src={skill.icon} 
                alt={skill.name} 
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg transition-transform ${selectedSkill.name === skill.name ? 'scale-110' : 'grayscale-[0.5]'}`} 
              />
              {selectedSkill.name === skill.name && isActive && (
                <svg className="absolute -inset-1 w-12 h-12 md:w-14 md:h-14 -rotate-90">
                  <circle
                    cx="24" cy="24" r="22"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="138"
                    strokeDashoffset={138 * (1 - timeLeft / selectedSkill.cd)}
                    className="transition-all duration-1000 linear"
                    style={{ cx: '50%', cy: '50%', r: '45%' }}
                  />
                </svg>
              )}
            </div>
            <span className={`text-[10px] md:text-xs font-black uppercase tracking-wider ${selectedSkill.name === skill.name ? 'text-white' : 'text-text-secondary'}`}>
              {skill.name}
            </span>
          </button>
        ))}
      </div>

      {/* 倒计时核心区域 */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-4">
        <div className="relative">
          {/* 外环装饰 */}
          <div className={`absolute inset-0 rounded-full border-4 border-primary/5 scale-150 ${isActive ? 'animate-ping opacity-20' : ''}`} />
          
          <div className={`
            text-[80px] md:text-[100px] font-black font-mono leading-none tracking-tighter transition-all duration-500
            ${timeLeft === 0 
              ? 'text-success drop-shadow-[0_0_15px_rgba(var(--color-success-rgb),0.5)]' 
              : timeLeft < 10 && isActive
                ? 'text-danger animate-pulse'
                : 'text-primary'
            }
          `}>
            {timeLeft.toString().padStart(2, '0')}
            <span className="text-2xl md:text-3xl ml-1 opacity-50 font-sans italic">S</span>
          </div>
        </div>
        
        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="h-1 w-12 bg-primary/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000 linear" 
              style={{ width: `${(timeLeft / selectedSkill.cd) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-2">
            {selectedSkill.name} 剩余冷却
          </span>
        </div>
      </div>

      {/* 控制中心 */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        <button
          onClick={handleToggle}
          disabled={timeLeft === 0}
          className={`
            h-14 md:h-16 rounded-3xl flex items-center justify-center gap-2 font-black text-lg transition-all active:scale-95
            ${isActive 
              ? 'bg-bg-page text-text-primary border-2 border-border-light hover:bg-bg-card' 
              : 'bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5'
            }
            ${timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isActive ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
          {isActive ? '暂停' : '开始'}
        </button>
        
        <button
          onClick={handleReset}
          className="h-14 md:h-16 rounded-3xl flex items-center justify-center gap-2 font-black text-lg bg-bg-page text-text-secondary border-2 border-border-light hover:border-primary/30 hover:text-primary transition-all active:scale-95"
        >
          <RotateCcw size={20} />
          重置
        </button>
      </div>
    </div>
  );
};
