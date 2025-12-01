import React, { useEffect, useRef, useState } from 'react';

interface Props {
  isActive: boolean;
  isListening: boolean;
}

const AssistantPanel: React.FC<Props> = ({ isActive, isListening }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple visualizer
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let t = 0;

    const draw = () => {
      if (!ctx || !canvasRef.current) return;
      const w = canvasRef.current.width;
      const h = canvasRef.current.height;
      
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = isListening ? '#ef4444' : '#3b82f6'; // Red for alert, Blue for standby
      
      const bars = 5;
      const spacing = 10;
      const barW = (w - (bars - 1) * spacing) / bars;

      for (let i = 0; i < bars; i++) {
        const height = 10 + Math.sin(t + i) * (isListening ? 15 : 5);
        const x = i * (barW + spacing);
        const y = (h - height) / 2;
        
        // Rounded rect
        ctx.beginPath();
        ctx.roundRect(x, y, barW, height, 4);
        ctx.fill();
      }

      t += 0.2;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, isListening]);

  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-300 ${isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
      <div className={`p-2 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-slate-200'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
        </svg>
      </div>
      
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-wider mb-1">
            {isActive ? 'SAVEPLACE VOICE GUARD' : 'Monitoramento de Voz'}
        </p>
        <p className="text-sm font-medium">
            {isActive ? 'Conectado. Fale com a IA.' : 'Standby'}
        </p>
      </div>

      <div className="w-20 h-10">
        <canvas ref={canvasRef} width={80} height={40} />
      </div>
    </div>
  );
};

export default AssistantPanel;
