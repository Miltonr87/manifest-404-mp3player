import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LyricsModalProps {
  title: string;
  lyrics: string;
  onClose: () => void;
}

export const LyricsModal = ({ title, lyrics, onClose }: LyricsModalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollStart = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startY.current = e.pageY - scrollRef.current.offsetTop;
    scrollStart.current = scrollRef.current.scrollTop;
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const y = e.pageY - scrollRef.current.offsetTop;
    const walk = (y - startY.current) * 1.5;
    scrollRef.current.scrollTop = scrollStart.current - walk;
  };

  const stopDragging = () => {
    isDragging.current = false;
    document.body.style.userSelect = '';
  };

  const formattedLyrics = lyrics.split('\n').map((line, idx) => {
    const baseDelay = idx * 0.05;
    const safeKey = `${title}-line-${idx}-${line}`;

    if (/\[Chorus\]/i.test(line)) {
      return (
        <motion.p
          key={safeKey}
          className="text-center font-bold text-lg neon-text drop-shadow-[0_0_8px_rgba(0,255,255,0.9)] mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: baseDelay }}
        >
          {line}
        </motion.p>
      );
    }

    if (/\[.*\]/.test(line)) {
      return (
        <motion.p
          key={safeKey}
          className="text-accent font-semibold text-center mt-4 uppercase tracking-widest"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: baseDelay }}
        >
          {line}
        </motion.p>
      );
    }

    return (
      <motion.p
        key={safeKey}
        className="text-center text-muted-foreground tracking-wide"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: baseDelay }}
      >
        {line}
      </motion.p>
    );
  });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          className="relative w-full max-w-4xl max-h-[80vh] p-6 md:p-8 overflow-y-auto hide-scrollbar rounded-2xl cursor-grab active:cursor-grabbing border border-border bg-secondary/10 player-panel bg-gradient-to-b from-secondary/40 to-background/60 comic-panel"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
        >
          <motion.button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-lg hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>

          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center neon-text mb-6 uppercase tracking-widest"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>

          <motion.div
            className="space-y-2 text-base leading-relaxed px-4"
            initial="hidden"
            animate="visible"
          >
            {formattedLyrics}
          </motion.div>

          <motion.div
            className="mt-6 w-full h-[2px] bg-primary/50"
            animate={{ opacity: [0.2, 1, 0.4, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
