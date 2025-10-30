import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const IntroPage = ({ onEnter }: { onEnter: () => void }) => {
  const [ready, setReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 🧬 Matrix rain background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chars = '01$#¥ØΞΛ╬☰Ξ01'.split('');
    let fontSize = 16;
    let columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = canvas.width / fontSize;
      drops.length = Math.floor(columns);
      drops.fill(1);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff99';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
          drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Small delay before showing box (smooth)
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/90 text-foreground font-mono">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40"
      />
      <AnimatePresence>
        {ready && (
          <motion.div
            key="intro-box"
            className="relative z-10 w-[90%] sm:w-full max-w-md rounded-2xl overflow-hidden border border-border bg-secondary/10 player-panel shadow-[0_0_16px_rgba(0,255,153,0.2)] p-6 sm:p-8 text-center backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"
              animate={{ opacity: 0.25 }}
            />

            <motion.img
              src="/banner/manifest_404.png"
              alt="Manifest 404"
              className="relative w-full max-w-[320px] sm:max-w-[380px] mx-auto mb-6 rounded-lg border border-border shadow-[0_0_8px_rgba(0,255,153,0.25)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            />

            <motion.button
              onClick={onEnter}
              className="relative px-8 py-3 border border-border text-primary font-semibold tracking-widest uppercase rounded-md bg-background/40 transition-all duration-300 hover:text-primary/90 hover:shadow-[0_0_15px_rgba(0,255,153,0.4)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              >
                Enter Here
              </motion.span>
            </motion.button>

            <motion.p
              className="mt-4 text-[11px] sm:text-xs text-muted-foreground uppercase tracking-widest"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              v1.404 — Cybernetic Boot Protocol
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
