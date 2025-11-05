import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles.module.scss';

const Error: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ lang?: string }>();
  const currentLang = params.lang || 'zh';
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number; speed: number; color: string }>>([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 生成粒子效果
  useEffect(() => {
    // 创建更多样化的粒子
    const colors = ['#ff4a9e', '#ed6495', '#b6599b', '#e74c3c', '#c0392b'];
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.3 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setParticles(newParticles);

    // 光晕强度脉动效果
    const glowInterval = setInterval(() => {
      setGlowIntensity(prev => {
        const newIntensity = prev + (Math.random() * 0.4 - 0.2);
        return Math.max(0.8, Math.min(1.2, newIntensity));
      });
    }, 2000);

    // 动画帧循环
    const animationId = requestAnimationFrame(function animate() {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speed) % 100,
        y: (particle.y + Math.sin(particle.id * 0.1 + Date.now() * 0.001) * 0.3) % 100
      })));
      requestAnimationFrame(animate);
    });

    return () => {
      clearInterval(glowInterval);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // 创建动态网格背景
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(237, 100, 149, 0.1)';
      ctx.lineWidth = 1;
      
      const gridSize = 40;
      const offset = Date.now() * 0.0001 * gridSize % gridSize;
      
      // 绘制水平线条
      for (let y = -offset; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // 绘制垂直线条
      for (let x = -offset; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      requestAnimationFrame(drawGrid);
    };
    
    drawGrid();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleGoHome = () => {
    navigate(`/${currentLang}`);
  };

  const handleRetry = () => {
    setIsRetrying(true);
    
    // 模拟刷新页面，添加延迟以显示重试动画
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleContactSupport = () => {
    // 这里可以添加联系支持的逻辑，比如打开邮箱客户端或支持页面
    alert(currentLang === 'en' ? 'Redirecting to support page...' : 
           currentLang === 'ja' ? 'サポートページにリダイレクト中...' : 
           currentLang === 'ko' ? '지원 페이지로 리디렉션 중...' : 
           '正在跳转到支持页面...');
  };

  return (
    <div className="error-container">
      {/* 动态网格背景 */}
      <canvas ref={canvasRef} className="dynamic-grid"></canvas>
      
      {/* 粒子背景 */}
      <div className="particles-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`
            }}
          />
        ))}
      </div>

      {/* 装饰性光晕 */}
      <div 
        className="decorative-glow"
        style={{
          filter: `blur(${glowIntensity * 80}px)`,
          opacity: glowIntensity * 0.3
        }}
      ></div>

      {/* 错误信息容器 */}
      <div className="error-content-wrapper">
        <div className="error-content">
          {/* 顶部装饰线 */}
          <div className="decorative-line"></div>
          
          <div className="error-code">500</div>
          <div className="error-message">
            {currentLang === 'en' ? 'Internal Server Error' : 
             currentLang === 'ja' ? 'サーバー内部エラー' : 
             currentLang === 'ko' ? '내부 서버 오류' : '服务器内部错误'}
          </div>
          <div className="error-description">
            {currentLang === 'en' ? 'Something went wrong on our server. Please try again later or contact support.' : 
             currentLang === 'ja' ? 'サーバーでエラーが発生しました。後でもう一度お試しいただくか、サポートにお問い合わせください。' : 
             currentLang === 'ko' ? '서버에서 오류가 발생했습니다. 나중에 다시 시도하거나 지원팀에 문의하세요.' : 
             '服务器出现错误，请稍后再试或联系技术支持。'}
          </div>
          <div className="error-actions">
            <button 
              className="primary-button"
              onClick={handleRetry}
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <span className="loading-spinner"></span>
                  {currentLang === 'en' ? 'Retrying...' : 
                   currentLang === 'ja' ? '再試行中...' : 
                   currentLang === 'ko' ? '다시 시도 중...' : '正在重试...'}
                </>
              ) : (
                currentLang === 'en' ? 'Retry' : 
                currentLang === 'ja' ? '再試行' : 
                currentLang === 'ko' ? '다시 시도' : '重试'
              )}
            </button>
            <button 
              className="secondary-button"
              onClick={handleContactSupport}
            >
              {currentLang === 'en' ? 'Contact Support' : 
               currentLang === 'ja' ? 'サポートに問い合わせ' : 
               currentLang === 'ko' ? '지원팀 문의' : '联系支持'}
            </button>
            <button 
              className="tertiary-button"
              onClick={handleGoHome}
            >
              {currentLang === 'en' ? 'Go Home' : 
               currentLang === 'ja' ? 'ホームに戻る' : 
               currentLang === 'ko' ? '홈으로 돌아가기' : '返回首页'}
            </button>
          </div>
          
          {/* 底部装饰线 */}
          <div className="decorative-line"></div>
          
          {/* 错误信息详情 */}
          <div className="error-details">
            <small>
              {currentLang === 'en' ? 'Error code: INTERNAL_SERVER_ERROR' : 
               currentLang === 'ja' ? 'エラーコード: INTERNAL_SERVER_ERROR' : 
               currentLang === 'ko' ? '오류 코드: INTERNAL_SERVER_ERROR' : '错误代码: INTERNAL_SERVER_ERROR'}
            </small>
          </div>
        </div>
      </div>

      {/* 装饰性扫描线 */}
      <div className="scan-line"></div>
    </div>
  );
};

export default Error;
