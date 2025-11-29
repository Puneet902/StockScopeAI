import { useEffect, useRef, useState } from 'react';

export function AnalysisBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const gridSize = 50;
    const lightRadius = 300; // Radius of the spotlight effect

    // Animation loop
    const animate = () => {
      // Clear background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines that light up near cursor
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        const distanceFromCursor = Math.abs(x - mousePos.x);
        const opacity = Math.max(0, 1 - distanceFromCursor / lightRadius) * 0.3;

        if (opacity > 0.01) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        const distanceFromCursor = Math.abs(y - mousePos.y);
        const opacity = Math.max(0, 1 - distanceFromCursor / lightRadius) * 0.3;

        if (opacity > 0.01) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      // Draw spotlight glow at cursor
      const gradient = ctx.createRadialGradient(
        mousePos.x,
        mousePos.y,
        0,
        mousePos.x,
        mousePos.y,
        lightRadius
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, lightRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw bright dots at grid intersections near cursor
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const distance = Math.sqrt(
            Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2)
          );

          if (distance < lightRadius) {
            const opacity = (1 - distance / lightRadius) * 0.4;
            
            if (opacity > 0.05) {
              ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: '#0a0a0a' }}
    />
  );
}
