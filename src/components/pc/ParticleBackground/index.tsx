import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  particleCount?: number;
  particleSize?: number;
  particleColor?: string;
  particleSpeed?: number;
  lineColor?: string;
  lineDistance?: number;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 100,
  particleSize = 1.5,
  particleColor = '#00bcd4',
  particleSpeed = 0.5,
  lineColor = 'rgba(0, 188, 212, 0.2)',
  lineDistance = 150,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 粒子类
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.size = Math.random() * particleSize + 0.5;
        this.speedX = (Math.random() - 0.5) * particleSpeed;
        this.speedY = (Math.random() - 0.5) * particleSpeed;
        this.color = particleColor;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // 边界检测
        const canvasWidth = canvas?.width || window.innerWidth;
        const canvasHeight = canvas?.height || window.innerHeight;
        
        if (this.x > canvasWidth) this.x = 0;
        else if (this.x < 0) this.x = canvasWidth;
        if (this.y > canvasHeight) this.y = 0;
        else if (this.y < 0) this.y = canvasHeight;
      }

      draw() {
        if (!ctx) return;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // 创建粒子数组
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // 连接距离相近的粒子
    const connectParticles = () => {
      if (!ctx) return;
      
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < lineDistance) {
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    };

    animate();

    // 清理
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [particleCount, particleSize, particleColor, particleSpeed, lineColor, lineDistance]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ParticleBackground;