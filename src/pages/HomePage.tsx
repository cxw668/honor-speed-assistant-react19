import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container items-center justify-center text-center">
      <div className="card max-w-md p-10">
        <h1 className="timer mb-4">荣耀速通助手</h1>
        <p className="text-main mb-8">
          专为王者荣耀新手设计的速查与辅助工具。<br/>
          快速查询英雄定位、技能解读与核心打法。
        </p>
        <button 
          className="btn-primary w-full"
          onClick={() => navigate('/hero')}
        >
          进入英雄速查
        </button>
      </div>
    </div>
  )
}
export default HomePage