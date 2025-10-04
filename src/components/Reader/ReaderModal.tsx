import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { LyricsModal } from './LyricsModal';

const images = [
  {
    src: '/assets/1.png',
    title: 'Algorithmic Tyranny',
    lyricsPath: '/lyrics/1.txt',
  },
  {
    src: '/assets/2.png',
    title: 'Code Revolution',
    lyricsPath: '/lyrics/2.txt',
  },
  {
    src: '/assets/3.png',
    title: 'Pixelated Love',
    lyricsPath: '/lyrics/3.txt',
  },
  {
    src: '/assets/4.png',
    title: 'Synthetic Addiction',
    lyricsPath: '/lyrics/4.txt',
  },
  {
    src: '/assets/5.png',
    title: 'Break the Firewall',
    lyricsPath: '/lyrics/5.txt',
  },
  {
    src: '/assets/6.png',
    title: 'Silicon Saints',
    lyricsPath: '/lyrics/6.txt',
  },
];

export const ReaderModal = ({ onClose }: { onClose: () => void }) => {
  const [activeSong, setActiveSong] = useState<{
    title: string;
    lyrics: string;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const openSong = async (item: { title: string; lyricsPath: string }) => {
    try {
      const res = await fetch(item.lyricsPath);
      const text = await res.text();
      setActiveSong({ title: item.title, lyrics: text });
    } catch (err) {
      console.error('Erro ao carregar letra:', err);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const childWidth = container.firstElementChild
        ? (container.firstElementChild as HTMLElement).offsetWidth + 32 // 32px ≈ gap-8
        : 0;

      container.scrollBy({
        left: -childWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const childWidth = container.firstElementChild
        ? (container.firstElementChild as HTMLElement).offsetWidth + 32
        : 0;

      container.scrollBy({
        left: childWidth,
        behavior: 'smooth',
      });
    }
  };

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
          className="relative w-full max-w-6xl max-h-[90vh] player-panel p-6 flex flex-col"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            onClick={onClose}
            className="absolute top-2 right-3 p-2 rounded-lg hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-scroll snap-x snap-mandatory flex gap-8 p-6 hide-scrollbar"
          >
            {images.map((item, i) => (
              <motion.img
                key={i}
                src={item.src}
                alt={item.title}
                className="
        snap-center cursor-pointer rounded-2xl shadow-lg border border-border
        max-h-[70vh] sm:max-h-[80vh] lg:max-h-[85vh]
        w-auto max-w-[75vw] sm:max-w-[70vw] lg:max-w-[65vw]
      "
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 200 }}
                onClick={() => openSong(item)}
              />
            ))}
          </div>
          <div className="relative w-full flex justify-center mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="player-button p-3 hover:neon-glow transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={scrollRight}
                className="player-button p-3 hover:neon-glow transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      {activeSong && (
        <LyricsModal
          title={activeSong.title}
          lyrics={activeSong.lyrics}
          onClose={() => setActiveSong(null)}
        />
      )}
    </AnimatePresence>
  );
};
