import { Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const VolumeControl = ({
  volume,
  onVolumeChange,
}: VolumeControlProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const toggleMute = () => {
    onVolumeChange(volume > 0 ? 0 : 0.7);
  };

  return (
    <div className="hidden sm:flex items-center gap-4">
      <button
        onClick={toggleMute}
        className="player-button p-3 hover:neon-glow transition-all"
        aria-label={volume > 0 ? 'Mute' : 'Unmute'}
      >
        {volume > 0 ? (
          <Volume2 className="w-5 h-5 text-foreground" />
        ) : (
          <VolumeX className="w-5 h-5 text-foreground" />
        )}
      </button>

      <div className="flex items-center gap-3">
        <div className="volume-knob w-16 h-16 cursor-pointer relative">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            style={{ transform: `rotate(${volume * 270 - 135}deg)` }}
          />
          <div
            className="absolute inset-2 rounded-full bg-gradient-to-br from-secondary to-muted"
            style={{ transform: `rotate(${volume * 270 - 135}deg)` }}
          />
        </div>

        <div className="space-y-1">
          <div className="digital-display text-xs">VOL</div>
          <div className="digital-display text-sm font-bold">
            {Math.round(volume * 100)}
          </div>
        </div>
      </div>
    </div>
  );
};
