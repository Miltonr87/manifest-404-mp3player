import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MiniPlayer } from './MiniPlayer';
import breakTheFirewallArt from '@/assets/break_the_firewall.jpg';
import siliconSaintsArt from '@/assets/silicon_saints.jpg';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  filename: string;
  artwork?: string;
}

interface DisplayPanelProps {
  track?: Track;
  currentTime: string;
  duration: string;
  isPlaying: boolean;
  album?: 'firewall' | 'saints';
  onTogglePlay?: () => void;
}

const getArtwork = (album: 'firewall' | 'saints') =>
  album === 'saints' ? siliconSaintsArt : breakTheFirewallArt;

const getTheme = () => ({
  border: 'border-primary/30',
  glow: 'shadow-[0_0_10px_rgba(0,255,200,0.4)]',
  title: 'text-primary no-underline decoration-none',
  artist: 'text-muted-foreground no-underline decoration-none',
  pulse: 'from-primary/20 to-accent/20',
});

export const DisplayPanel = ({
  track,
  currentTime,
  duration,
  isPlaying,
  album = 'firewall',
  onTogglePlay,
}: DisplayPanelProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const theme = getTheme();
  const artwork = getArtwork(album);
  const artworkUrl = track?.artwork ?? artwork;
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!track || !duration || duration === '00:00') {
      setIsLoading(true);
    } else {
      const timer = setTimeout(() => setIsLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [track, duration]);

  useEffect(() => {
    if (titleRef.current) titleRef.current.scrollLeft = 0;
  }, [track?.title]);

  return (
    <div className="relative w-full flex flex-col items-center">
      <div
        id="display-panel"
        className="
          grid grid-cols-1 md:grid-cols-3 gap-6 items-center
          w-full max-w-sm md:max-w-4xl mx-auto
        "
      >
        <div className="space-y-2 text-center md:text-left">
          <div
            ref={titleRef}
            className={`digital-display text-2xl md:text-3xl font-bold break-words ${theme.title}`}
          >
            {track?.title || '—'}
          </div>
          <div className={`${theme.artist}`}>
            {track?.artist || 'No track selected'}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div
            className={`
              relative w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden
              border-2 ${theme.border} ${theme.glow}
            `}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="tuning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,255,200,0.1)_0px,rgba(0,255,200,0.1)_1px,transparent_2px,transparent_4px)]"
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-30 mix-blend-screen"
                    animate={{ opacity: [0.1, 0.4, 0.2, 0.5, 0.3] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute top-1/2 left-0 right-0 h-1 bg-primary/70 blur-sm"
                    animate={{
                      y: ['-40%', '40%', '-30%', '30%', '0%'],
                      opacity: [0.2, 0.8, 0.4, 0.7, 0.2],
                    }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                  <motion.span
                    className="text-primary font-semibold tracking-widest text-sm"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  >
                    LOADING
                  </motion.span>
                </motion.div>
              ) : (
                <motion.img
                  key={artworkUrl}
                  src={artworkUrl}
                  alt={
                    track?.title ? `${track.title} artwork` : 'Album artwork'
                  }
                  initial={{ opacity: 0, scale: 1.2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isPlaying ? 'scale-105' : 'scale-100'
                  } no-underline decoration-none`}
                />
              )}
            </AnimatePresence>
            {!isLoading && (
              <div
                className={`
                  absolute inset-0 bg-gradient-to-br ${theme.pulse}
                  ${isPlaying ? 'animate-pulse' : 'opacity-0'}
                `}
              />
            )}
          </div>
        </div>
        <div className="text-center md:text-right space-y-2">
          <div
            className={`digital-display text-3xl md:text-4xl font-bold ${theme.title}`}
          >
            {currentTime}
          </div>
          <div className="digital-display text-sm opacity-70 no-underline decoration-none">
            {duration}
          </div>
        </div>
      </div>
      <div className="mini-player-wrapper">
        <MiniPlayer
          track={{ ...track, artwork: artworkUrl }}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay ?? (() => {})}
        />
      </div>
    </div>
  );
};
