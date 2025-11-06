import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  album?: 'firewall' | 'saints' | 'bonus';
  isLightMode?: boolean;
}

export const VolumeControl = ({
  volume,
  onVolumeChange,
  album = 'firewall',
  isLightMode = false,
}: VolumeControlProps) => {
  const isBonus = album === 'bonus';

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const toggleMute = () => {
    onVolumeChange(volume > 0 ? 0 : 0.7);
  };

  const knobColor = isBonus
    ? isLightMode
      ? 'bg-gradient-to-br from-pink-200 to-pink-300 shadow-[0_0_12px_rgba(255,120,200,0.4)]'
      : 'bg-gradient-to-br from-pink-600 to-pink-400 shadow-[0_0_16px_rgba(255,0,150,0.6)]'
    : isLightMode
    ? 'bg-gradient-to-br from-sky-200 to-sky-300 shadow-[0_0_10px_rgba(0,200,255,0.3)]'
    : 'bg-gradient-to-br from-secondary to-muted';

  const textColor = isBonus
    ? isLightMode
      ? 'text-pink-500'
      : 'text-pink-400'
    : isLightMode
    ? 'text-sky-600'
    : 'text-foreground';

  return (
    <div className="hidden sm:flex items-center gap-4">
      <button
        onClick={toggleMute}
        className="player-button p-3 hover:neon-glow transition-all"
        aria-label={volume > 0 ? 'Mute' : 'Unmute'}
      >
        {volume > 0 ? (
          <Volume2 className={`w-5 h-5 ${textColor}`} />
        ) : (
          <VolumeX className={`w-5 h-5 ${textColor}`} />
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
            className={`absolute inset-2 rounded-full ${knobColor}`}
            style={{ transform: `rotate(${volume * 270 - 135}deg)` }}
          />
        </div>

        <div className="space-y-1">
          <div className={`digital-display text-xs ${textColor}`}>VOL</div>
          <div className={`digital-display text-sm font-bold ${textColor}`}>
            {Math.round(volume * 100)}
          </div>
        </div>
      </div>
    </div>
  );
};
