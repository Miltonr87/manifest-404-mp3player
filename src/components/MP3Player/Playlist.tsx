import { Play } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  filename: string;
}

interface PlaylistProps {
  tracks: Track[];
  currentTrack: number;
  isPlaying: boolean;
  onTrackSelect: (index: number) => void;
}

export const Playlist = ({
  tracks,
  currentTrack,
  isPlaying,
  onTrackSelect,
}: PlaylistProps) => {
  const formatTime = (seconds: number) => {
    if (!seconds || seconds === 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold neon-text">PLAYLIST</h3>
        <div className="digital-display text-sm">{tracks.length} TRACKS</div>
      </div>

      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            onClick={() => onTrackSelect(index)}
            className={`
              flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200
              ${
                index === currentTrack
                  ? 'bg-primary/10 border border-primary/30 neon-glow'
                  : 'bg-muted/20 hover:bg-muted/40 border border-transparent'
              }
            `}
          >
            <div className="flex-shrink-0">
              {index === currentTrack && isPlaying ? (
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full neon-glow animate-pulse-glow" />
                </div>
              ) : (
                <div
                  className={`
                  w-6 h-6 flex items-center justify-center rounded
                  ${
                    index === currentTrack
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }
                `}
                >
                  <Play className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div
                className={`
                font-medium truncate
                ${
                  index === currentTrack
                    ? 'digital-display text-primary'
                    : 'text-foreground'
                }
              `}
              >
                {track.title}
              </div>
              <div className="text-sm text-muted-foreground">
                {track.artist}
              </div>
            </div>

            <div className="digital-display text-sm text-muted-foreground">
              {formatTime(track.duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
