// components/CyberBackground.tsx
import React, { useEffect, useRef } from 'react';

interface CyberBackgroundProps {
  active: boolean;
}

export const CyberBackground: React.FC<CyberBackgroundProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    let animationFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class NeuralNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = 2 + Math.random() * 3;
        this.color = `hsl(${200 + Math.random() * 60}, 70%, 60%)`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Soft boundary
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Inner glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.restore();
      }
    }

    const nodes: NeuralNode[] = Array.from({ length: 25 }, () => new NeuralNode());

    function draw() {
      // Clear with subtle fade
      ctx.fillStyle = 'rgba(6, 12, 18, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // Update and draw nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      // Draw connections with intelligence
      nodes.forEach((node, i) => {
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              const pulse = (Math.sin(time * 2 + i + j) + 1) * 0.5;
              const alpha = 0.1 * (1 - distance / 150) * pulse;

              ctx.save();
              ctx.globalAlpha = alpha;
              ctx.strokeStyle = `hsl(${200 + pulse * 60}, 70%, 60%)`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        });
      });

      // Draw data pulses
      if (time % 2 < 0.1) {
        const startNode = nodes[Math.floor(Math.random() * nodes.length)];
        const endNode = nodes[Math.floor(Math.random() * nodes.length)];
        
        const progress = (time % 2) / 0.1;
        const pulseX = startNode.x + (endNode.x - startNode.x) * progress;
        const pulseY = startNode.y + (endNode.y - startNode.y) * progress;

        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#00f5ff';
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrame = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
};