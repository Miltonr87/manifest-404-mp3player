import { useEffect, useRef, useState } from 'react';
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

/**
 * This component becomes visible when the DisplayPanel scrolls out of view.
 */
export const MiniPlayer = ({
  track,
  currentTime,
  duration,
  isPlaying,
  onTogglePlay,
}: MiniPlayerProps) => {
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

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
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={observerRef}
      className={`
        fixed bottom-0 left-0 right-0 z-50 
        bg-black/80 border-t border-primary/30 backdrop-blur-md
        flex items-center justify-between px-4 py-2 md:px-8
        transition-all duration-500 ease-in-out
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
    >
      {/* Left: Track info */}
      <div className="flex items-center gap-3 overflow-hidden">
        <img
          src={track?.artwork}
          alt={track?.title || 'cover'}
          className="w-10 h-10 rounded-md border border-primary/40 object-cover"
        />
        <div className="text-left overflow-hidden">
          <div className="digital-display text-primary font-semibold text-sm truncate max-w-[180px] md:max-w-[250px]">
            {track?.title || '—'}
          </div>
          <div className="text-muted-foreground text-xs">
            {track?.artist || 'Unknown artist'}
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        <div className="digital-display text-xs opacity-70 hidden md:block">
          {currentTime} / {duration}
        </div>

        {/* Play / Pause */}
        <button
          onClick={onTogglePlay}
          className="p-2 rounded-full bg-primary/20 hover:bg-primary/40 transition"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-primary" />
          ) : (
            <Play className="w-4 h-4 text-primary" />
          )}
        </button>

        {/* Scroll to top */}
        <button
          onClick={handleScrollToTop}
          className="p-2 rounded-full bg-primary/20 hover:bg-primary/40 transition"
          title="Back to top"
        >
          <ArrowUp className="w-4 h-4 text-primary" />
        </button>
      </div>
    </div>
  );
};
