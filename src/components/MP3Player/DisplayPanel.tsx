import { useEffect, useRef } from 'react';
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

const getArtwork = (album: 'firewall' | 'saints') => {
  return album === 'saints' ? siliconSaintsArt : breakTheFirewallArt;
};

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
  const theme = getTheme();
  const artwork = getArtwork(album);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) titleRef.current.scrollLeft = 0;
  }, [track?.title]);

  const artworkUrl = track?.artwork ?? artwork;

  return (
    <>
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
              ${isPlaying ? 'animate-pulse-glow' : ''}
            `}
          >
            <img
              src={artworkUrl}
              alt={track?.title ? `${track.title} artwork` : 'Album artwork'}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isPlaying ? 'scale-105' : 'scale-100'
              } no-underline decoration-none`}
            />
            <div
              className={`
                absolute inset-0 bg-gradient-to-br ${theme.pulse}
                ${isPlaying ? 'animate-pulse' : 'opacity-0'}
              `}
            />
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
      <MiniPlayer
        track={{
          ...track,
          artwork: artworkUrl,
        }}
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay ?? (() => {})}
      />
    </>
  );
};
