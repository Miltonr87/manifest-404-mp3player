import algorithmicTyrannyArt from '@/assets/algorithmic-tyranny-art.png';
import codeRevolutionArt from '@/assets/code-revolution-art.png';
import siliconSaintsArt from '@/assets/silicon-saints-art.png';

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
}

// 🎨 Return artwork depending on album + track ID
const getArtwork = (album: 'firewall' | 'saints', trackId?: number) => {
  if (album === 'saints') return siliconSaintsArt;

  switch (trackId) {
    case 1:
      return algorithmicTyrannyArt;
    case 2:
      return codeRevolutionArt;
    default:
      return algorithmicTyrannyArt;
  }
};

// 💡 Unified green theme for both albums
const getTheme = () => ({
  border: 'border-primary/30',
  glow: 'shadow-[0_0_10px_rgba(0,255,200,0.4)]',
  title: 'text-primary',
  artist: 'text-muted-foreground',
  pulse: 'from-primary/20 to-accent/20',
});

export const DisplayPanel = ({
  track,
  currentTime,
  duration,
  isPlaying,
  album = 'firewall',
}: DisplayPanelProps) => {
  const theme = getTheme();
  const artwork = getArtwork(album, track?.id);

  return (
    <div
      className="
        grid grid-cols-1 md:grid-cols-3 gap-6 items-center
        w-full max-w-sm md:max-w-4xl mx-auto
      "
    >
      {/* Left: Track info */}
      <div className="space-y-2 text-center md:text-left">
        <div
          className={`digital-display text-2xl md:text-3xl font-bold truncate ${theme.title}`}
        >
          {track?.title || '—'}
        </div>
        <div className={`${theme.artist}`}>
          {track?.artist || 'No track selected'}
        </div>
      </div>

      {/* Center: Artwork */}
      <div className="flex items-center justify-center">
        <div
          className={`
            relative w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden
            border-2 ${theme.border} ${theme.glow}
            ${isPlaying ? 'animate-pulse-glow' : ''}
          `}
        >
          <img
            src={artwork}
            alt={track?.title ? `${track.title} artwork` : 'Album artwork'}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isPlaying ? 'scale-105' : 'scale-100'
            }`}
          />
          <div
            className={`
              absolute inset-0 bg-gradient-to-br ${theme.pulse}
              ${isPlaying ? 'animate-pulse' : 'opacity-0'}
            `}
          />
        </div>
      </div>

      {/* Right: Timer */}
      <div className="text-center md:text-right space-y-2">
        <div
          className={`digital-display text-3xl md:text-4xl font-bold ${theme.title}`}
        >
          {currentTime}
        </div>
        <div className="digital-display text-sm opacity-70">{duration}</div>
      </div>
    </div>
  );
};
