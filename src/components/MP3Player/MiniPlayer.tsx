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
    const displayPanel = document.querySelector('#display-panel');
    if (!displayPanel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(displayPanel);
    return () => observer.disconnect();
  }, []);

  const handleScrollToTop = () => {
    const panel = document.querySelector('#display-panel');
    const container = getScrollParent(panel);
    const headerOffset = 272;
    if (panel) {
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
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
                src={track.artwork}
                alt={track.title || 'cover'}
                className="w-10 h-10 rounded-md border border-border object-cover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            <div className="text-left overflow-hidden">
              <div className="text-foreground font-semibold text-sm truncate max-w-[180px] md:max-w-[250px]">
                {track?.title || '—'}
              </div>
              <div className="text-muted-foreground text-xs">
                {track?.artist || 'Unknown artist'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground hidden md:block">
              {currentTime} / {duration}
            </div>
            <motion.button
              type="button"
              onClick={onTogglePlay}
              className={`p-2 rounded-full border border-border bg-secondary/10 hover:bg-secondary/20 transition`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-foreground" />
              ) : (
                <Play className="w-4 h-4 text-foreground" />
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
              <ArrowUp className="w-4 h-4 text-foreground" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
