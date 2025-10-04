import { memo, useCallback, useMemo, useState } from 'react';
import { Play, ChevronDown, ChevronUp } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  filename: string;
  bonus?: boolean;
}

interface PlaylistProps {
  tracks: Track[];
  currentTrack: number;
  isPlaying: boolean;
  onTrackSelect: (index: number) => void;
}

const formatTime = (seconds: number) => {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

const TrackRow = memo(
  ({
    track,
    isActive,
    isPlaying,
    onClick,
  }: {
    track: Track;
    isActive: boolean;
    isPlaying: boolean;
    onClick: () => void;
  }) => {
    const isBonus = track.bonus;

    return (
      <div
        onClick={onClick}
        className={`
          flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200
          ${
            isActive
              ? isBonus
                ? 'bg-yellow-500/20 border border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.8)]'
                : 'bg-primary/10 border border-primary/30 neon-glow'
              : isBonus
              ? 'bg-muted/20 border border-transparent relative overflow-hidden'
              : 'bg-muted/20 hover:bg-muted/40 border border-transparent'
          }
        `}
      >
        <div className="flex-shrink-0">
          {isActive && isPlaying ? (
            <div className="w-6 h-6 flex items-center justify-center">
              <div
                className={`w-2 h-2 rounded-full ${
                  isBonus
                    ? 'bg-yellow-400 animate-pulse-glow'
                    : 'neon-glow animate-pulse-glow'
                }`}
              />
            </div>
          ) : (
            <div
              className={`w-6 h-6 flex items-center justify-center rounded ${
                isActive
                  ? isBonus
                    ? 'text-yellow-400'
                    : 'text-primary'
                  : 'text-muted-foreground'
              }`}
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
                isActive
                  ? isBonus
                    ? 'text-yellow-400 digital-display'
                    : 'digital-display text-primary'
                  : isBonus
                  ? 'text-yellow-300 animate-wave-text'
                  : 'text-foreground'
              }
            `}
          >
            {track.title}
          </div>
          <div
            className={`text-sm ${
              isBonus ? 'text-yellow-500/80 italic' : 'text-muted-foreground'
            }`}
          >
            {track.artist}
          </div>
        </div>
        <div
          className={`digital-display text-sm ${
            isBonus ? 'text-yellow-400/90' : 'text-muted-foreground'
          }`}
        >
          {formatTime(track.duration)}
        </div>
        {!isActive && isBonus && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-full h-full animate-waveform opacity-20 bg-yellow-400" />
          </div>
        )}
      </div>
    );
  }
);

export const Playlist = memo(
  ({ tracks, currentTrack, isPlaying, onTrackSelect }: PlaylistProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const visibleTracks = useMemo(
      () => (isExpanded ? tracks : [tracks[currentTrack]]),
      [isExpanded, tracks, currentTrack]
    );
    const handleToggle = useCallback(() => setIsExpanded((prev) => !prev), []);
    const handleSelect = useCallback(
      (index: number) => onTrackSelect(isExpanded ? index : currentTrack),
      [isExpanded, currentTrack, onTrackSelect]
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold neon-text">PLAYLIST</h3>
          <div className="flex items-center gap-3">
            <div className="digital-display text-sm">
              {tracks.length} TRACKS
            </div>
            <button
              onClick={handleToggle}
              className="player-button px-3 py-2 hover:neon-glow transition-all flex items-center justify-center"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-foreground" />
              )}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <div className={isExpanded ? 'hide-scrollbar' : ''}>
            {visibleTracks.map((track, index) => (
              <TrackRow
                key={track.id}
                track={track}
                isActive={isExpanded ? index === currentTrack : true}
                isPlaying={isPlaying}
                onClick={() => handleSelect(index)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);
