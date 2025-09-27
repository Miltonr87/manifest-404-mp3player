import { Play, Pause, Square, SkipBack, SkipForward } from "lucide-react";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const PlayerControls = ({ 
  isPlaying, 
  onPlay, 
  onStop, 
  onPrevious, 
  onNext 
}: PlayerControlsProps) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onPrevious}
        className="player-button p-3 hover:neon-glow transition-all"
        aria-label="Previous track"
      >
        <SkipBack className="w-5 h-5 text-foreground" />
      </button>

      <button
        onClick={onPlay}
        className="player-button p-4 hover:neon-glow transition-all"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-foreground" />
        ) : (
          <Play className="w-6 h-6 text-foreground ml-1" />
        )}
      </button>

      <button
        onClick={onStop}
        className="player-button p-3 hover:neon-glow transition-all"
        aria-label="Stop"
      >
        <Square className="w-5 h-5 text-foreground" />
      </button>

      <button
        onClick={onNext}
        className="player-button p-3 hover:neon-glow transition-all"
        aria-label="Next track"
      >
        <SkipForward className="w-5 h-5 text-foreground" />
      </button>
    </div>
  );
};