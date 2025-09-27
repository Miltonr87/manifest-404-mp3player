import algorithmicTyrannyArt from '@/assets/algorithmic-tyranny-art.png';
import codeRevolutionArt from '@/assets/code-revolution-art.png';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  filename: string;
  artwork?: string;
}

interface DisplayPanelProps {
  track: Track;
  currentTime: string;
  duration: string;
  isPlaying: boolean;
}

const getArtwork = (trackId: number) => {
  switch (trackId) {
    case 1:
      return algorithmicTyrannyArt;
    case 2:
      return codeRevolutionArt;
    default:
      return algorithmicTyrannyArt;
  }
};

export const DisplayPanel = ({
  track,
  currentTime,
  duration,
  isPlaying,
}: DisplayPanelProps) => {
  return (
    <div
      className="
        grid grid-cols-1 md:grid-cols-3 gap-6 items-center
        w-full max-w-sm md:max-w-4xl mx-auto
      "
    >
      {/* Track Info */}
      <div className="space-y-2 text-center md:text-left">
        <div className="digital-display text-2xl md:text-3xl font-bold truncate">
          {track.title}
        </div>
        <div className="text-muted-foreground">{track.artist}</div>
      </div>

      {/* Album Artwork */}
      <div className="flex items-center justify-center">
        <div
          className={`
            relative w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-primary/30
            ${isPlaying ? 'animate-pulse-glow' : ''}
          `}
        >
          <img
            src={getArtwork(track.id)}
            alt={`${track.title} artwork`}
            className={`
              w-full h-full object-cover transition-transform duration-500
              ${isPlaying ? 'scale-105' : 'scale-100'}
            `}
          />
          <div
            className={`
              absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20
              ${isPlaying ? 'animate-pulse' : 'opacity-0'}
            `}
          />
        </div>
      </div>

      {/* Time Display */}
      <div className="text-center md:text-right space-y-2">
        <div className="digital-display text-3xl md:text-4xl font-bold">
          {currentTime}
        </div>
        <div className="text-muted-foreground">/ {duration}</div>
      </div>
    </div>
  );
};
