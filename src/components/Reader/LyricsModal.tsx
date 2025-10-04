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
    // blocked mouse highlight text
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
    if (line.match(/\[Chorus\]/i)) {
      return (
        <motion.p
          key={idx}
          className="text-white font-bold text-lg neon-text drop-shadow-[0_0_8px_rgba(255,0,255,0.9)] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 1.5,
          }}
        >
          {line}
        </motion.p>
      );
    } else if (line.match(/\[.*\]/)) {
      return (
        <p
          key={idx}
          className="text-purple-400 font-semibold mt-4 drop-shadow-[0_0_4px_rgba(180,100,255,0.7)] text-center"
        >
          {line}
        </p>
      );
    }
    return (
      <p
        key={idx}
        className="text-purple drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] text-center"
      >
        {line}
      </p>
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
          className="relative w-full max-w-4xl max-h-[75vh] player-panel p-4 sm:p-6 overflow-y-auto hide-scrollbar rounded-2xl cursor-grab active:cursor-grabbing"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
        >
          <motion.button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-lg hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
          <h2 className="text-xl sm:text-2xl font-bold neon-text mb-4 sm:mb-6 text-center">
            {title}
          </h2>
          <div className="space-y-2 text-sm sm:text-base leading-relaxed">
            {formattedLyrics}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
