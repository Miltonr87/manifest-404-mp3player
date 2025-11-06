import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowUp } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  filename: string;
  artwork?: string;
}

interface MiniPlayerProps {
  track?: Track;
  currentTime: string;
  duration: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

function isScrollable(el: Element) {
  const style = getComputedStyle(el);
  const overflowY = style.overflowY;
  const overflow = style.overflow;
  const canScroll =
    (overflowY === 'auto' ||
      overflowY === 'scroll' ||
      overflow === 'auto' ||
      overflow === 'scroll') &&
    (el as HTMLElement).scrollHeight > (el as HTMLElement).clientHeight;
  return canScroll;
}

function getScrollParent(el: Element | null): Element | Window {
  let node: Element | null = el?.parentElement ?? null;
  while (node) {
    if (isScrollable(node)) return node;
    node = node.parentElement;
  }
  return window;
}

export const MiniPlayer = ({
  track,
  currentTime,
  duration,
  isPlaying,
  onTogglePlay,
}: MiniPlayerProps) => {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = document.querySelector('#display-panel');
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleScrollToTop = () => {
    const panel = document.querySelector('#display-panel');
    if (!panel) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const container = getScrollParent(panel);
    const headerOffset = 272;
    const rect = panel.getBoundingClientRect();
    const absoluteTop =
      rect.top +
      (container === window
        ? window.scrollY
        : (container as HTMLElement).scrollTop);
    const targetTop = Math.max(absoluteTop - headerOffset, 0);
    if (container === window) {
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    } else {
      (container as HTMLElement).scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    }
  };

  const isBonus = track?.artist?.toLowerCase().includes('bonus');

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={barRef}
          className="fixed bottom-0 left-0 right-0 z-50 
            bg-background/80 border-t border-border backdrop-blur-md
            flex items-center justify-between px-4 py-2 md:px-8"
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {track?.artwork && (
              <motion.img
                key={track.artwork}
                src={track.artwork}
                alt={track.title || 'cover'}
                className={`w-10 h-10 rounded-md object-cover border ${
                  isBonus
                    ? 'border-pink-500/60 shadow-[0_0_8px_rgba(255,0,150,0.5)]'
                    : 'border-border'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            <div className="text-left overflow-hidden">
              <div
                className={`font-semibold text-sm truncate max-w-[180px] md:max-w-[250px] ${
                  isBonus ? 'text-pink-400' : 'text-foreground'
                }`}
              >
                {track?.title || '—'}
              </div>
              <div
                className={`text-xs ${
                  isBonus ? 'text-pink-400/70 italic' : 'text-muted-foreground'
                }`}
              >
                {track?.artist || 'Unknown artist'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`text-xs hidden md:block ${
                isBonus ? 'text-pink-400/70' : 'text-muted-foreground'
              }`}
            >
              {currentTime} / {duration}
            </div>
            <motion.button
              type="button"
              onClick={onTogglePlay}
              className="p-2 rounded-full border border-border bg-secondary/10 hover:bg-secondary/20 transition"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? (
                <Pause
                  className={`w-4 h-4 ${
                    isBonus ? 'text-pink-400' : 'text-foreground'
                  }`}
                />
              ) : (
                <Play
                  className={`w-4 h-4 ${
                    isBonus ? 'text-pink-400' : 'text-foreground'
                  }`}
                />
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={handleScrollToTop}
              className="p-2 rounded-full border border-border bg-secondary/10 hover:bg-secondary/20 transition"
              title="Back to top"
              aria-label="Back to top"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
            >
              <ArrowUp
                className={`w-4 h-4 ${
                  isBonus ? 'text-pink-400' : 'text-foreground'
                }`}
              />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
