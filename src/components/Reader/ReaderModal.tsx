import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { LyricsModal } from './LyricsModal';

const imageData = [
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
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = sessionStorage.getItem('readerIndex');
    return saved ? parseInt(saved) : 0;
  });
  const [isReady, setIsReady] = useState(false);
  const images = useMemo(() => imageData, []);

  // preload neighboring images
  useEffect(() => {
    const preload = (i: number) => {
      if (i >= 0 && i < images.length) {
        const img = new Image();
        img.src = images[i].src;
      }
    };
    preload(currentIndex + 1);
    preload(currentIndex - 1);
  }, [currentIndex, images]);

  const scrollToIndex = (
    index: number,
    behavior: ScrollBehavior = 'smooth'
  ) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const childWidth =
      container.firstElementChild?.getBoundingClientRect().width ?? 0;
    container.scrollTo({ left: index * (childWidth + 32), behavior });
    setCurrentIndex(index);
    sessionStorage.setItem('readerIndex', String(index));
  };

  const openSong = async (item: { title: string; lyricsPath: string }) => {
    try {
      const res = await fetch(item.lyricsPath);
      const text = await res.text();
      setActiveSong({ title: item.title, lyrics: text });
    } catch (err) {
      console.error('Error loading lyrics:', err);
    }
  };

  const scrollLeft = () => currentIndex > 0 && scrollToIndex(currentIndex - 1);
  const scrollRight = () =>
    currentIndex < images.length - 1 && scrollToIndex(currentIndex + 1);

  // Resets properly after remount
  useEffect(() => {
    setTimeout(() => {
      scrollToIndex(currentIndex, 'auto');
      setIsReady(true);
    }, 150);
  }, []);

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
            className="flex-1 overflow-x-hidden snap-x snap-mandatory flex gap-8 p-6 hide-scrollbar"
          >
            {images.map((item, i) => (
              <motion.img
                key={item.src}
                src={item.src}
                alt={item.title}
                loading={i === currentIndex ? 'eager' : 'lazy'}
                decoding="async"
                // @ts-expect-error nonstandard attribute
                fetchpriority={i === currentIndex ? 'high' : 'low'}
                className={`
                  snap-center cursor-pointer rounded-2xl shadow-lg border border-border
                  max-h-[70vh] sm:max-h-[80vh] lg:max-h-[85vh]
                  w-auto max-w-[75vw] sm:max-w-[70vw] lg:max-w-[65vw]
                  ${i === currentIndex ? 'opacity-100' : 'opacity-80'}
                  transition-opacity duration-200 ease-in-out
                `}
                onClick={() => openSong(item)}
              />
            ))}
          </div>
          <div className="relative w-full flex justify-center mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                disabled={!isReady || currentIndex === 0}
                className={`player-button p-3 transition-all ${
                  currentIndex === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:neon-glow'
                }`}
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={scrollRight}
                disabled={!isReady || currentIndex === images.length - 1}
                className={`player-button p-3 transition-all ${
                  currentIndex === images.length - 1
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:neon-glow'
                }`}
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
