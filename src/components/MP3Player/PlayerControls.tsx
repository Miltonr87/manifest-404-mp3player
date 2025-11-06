import { Play, Pause, Square, SkipBack, SkipForward } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onPrevious: () => void;
  onNext: () => void;
  album?: 'firewall' | 'saints' | 'bonus';
}

export const PlayerControls = ({
  isPlaying,
  onPlay,
  onStop,
  onPrevious,
  onNext,
  album = 'firewall',
}: PlayerControlsProps) => {
  const isBonus = album === 'bonus';
  const iconColor = isBonus ? 'text-pink-400' : 'text-foreground';
  const hoverEffect = isBonus
    ? 'hover:shadow-[0_0_8px_rgba(255,0,150,0.6)] hover:text-pink-400'
    : 'hover:neon-glow';
  const buttonBorder = isBonus
    ? 'border-pink-500/40 bg-pink-500/5'
    : 'border-border bg-secondary/10';

  return (
    <div className="flex items-center justify-center sm:justify-start gap-3 w-full">
      <button
        onClick={onPrevious}
        className={`player-button p-3 border ${buttonBorder} ${hoverEffect} transition-all`}
        aria-label="Previous track"
      >
        <SkipBack className={`w-5 h-5 ${iconColor}`} />
      </button>
      <button
        onClick={onPlay}
        className={`player-button p-4 border ${buttonBorder} ${hoverEffect} transition-all`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className={`w-6 h-6 ${iconColor}`} />
        ) : (
          <Play className={`w-6 h-6 ${iconColor} ml-1`} />
        )}
      </button>
      <button
        onClick={onStop}
        className={`player-button p-3 border ${buttonBorder} ${hoverEffect} transition-all`}
        aria-label="Stop"
      >
        <Square className={`w-5 h-5 ${iconColor}`} />
      </button>
      <button
        onClick={onNext}
        className={`player-button p-3 border ${buttonBorder} ${hoverEffect} transition-all`}
        aria-label="Next track"
      >
        <SkipForward className={`w-5 h-5 ${iconColor}`} />
      </button>
    </div>
  );
};
