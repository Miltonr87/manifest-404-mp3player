import { memo, useCallback, useMemo, useState, useEffect } from 'react';
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

const formatTime = (seconds?: number) => {
  if (!seconds || isNaN(seconds)) return '--:--';
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
    return (
      <div
        onClick={onClick}
        className={`
          flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 relative
          ${
            isActive
              ? 'bg-pink-500/10 border border-pink-500/40 shadow-[0_0_12px_rgba(255,0,150,0.6)]'
              : 'border border-transparent'
          }
        `}
      >
        <div className="flex-shrink-0">
          {isActive && isPlaying ? (
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse-glow" />
            </div>
          ) : (
            <div
              className={`w-6 h-6 flex items-center justify-center rounded ${
                isActive ? 'text-pink-400' : 'text-pink-400/70'
              }`}
            >
              <Play className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div
            className={`
              font-medium leading-snug break-words whitespace-normal
              ${
                isActive
                  ? 'text-pink-400 glow-pulse'
                  : 'text-pink-400/80 hover:text-pink-300 transition-colors'
              }
            `}
          >
            {track.title}
          </div>
          <div className="text-sm text-pink-400/50 italic mt-0.5">
            {track.artist}
          </div>
        </div>

        <div
          className={`digital-display text-sm flex-shrink-0 text-right ${
            isActive ? 'text-pink-400' : 'text-pink-400/60'
          }`}
        >
          {formatTime(track.duration)}
        </div>
      </div>
    );
  }
);

export const BonusPlaylist = memo(
  ({ tracks = [], currentTrack, isPlaying, onTrackSelect }: PlaylistProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [durations, setDurations] = useState<Record<number, number>>({});

    useEffect(() => {
      tracks.forEach((track) => {
        if (track.duration === 0 && !durations[track.id]) {
          const audio = new Audio(track.filename);
          audio.addEventListener('loadedmetadata', () => {
            setDurations((prev) => ({
              ...prev,
              [track.id]: audio.duration,
            }));
          });
        }
      });
    }, [tracks, durations]);

    const visibleTracks = useMemo(() => {
      if (isExpanded) return tracks ?? [];
      const safeIndex =
        currentTrack >= 0 && currentTrack < tracks.length ? currentTrack : 0;
      return tracks.length ? [tracks[safeIndex]] : [];
    }, [isExpanded, tracks, currentTrack]);

    const handleToggle = useCallback(() => setIsExpanded((prev) => !prev), []);
    const handleSelect = useCallback(
      (i: number) => {
        if (tracks[i]) onTrackSelect(i);
      },
      [onTrackSelect, tracks]
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-pink-500 tracking-widest animate-glow">
            BONUS TRACKS
          </h3>
          <button
            onClick={handleToggle}
            className="player-button px-3 py-2 hover:bg-pink-500/10 transition-all flex items-center justify-center rounded-md"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-pink-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-pink-500" />
            )}
          </button>
        </div>

        <div className="space-y-2">
          {(visibleTracks ?? []).map((track, index) => {
            const duration = durations[track.id] || track.duration;
            return (
              <TrackRow
                key={track.id ?? `${track.title}-${index}`}
                track={{ ...track, duration }}
                isActive={index === currentTrack}
                isPlaying={isPlaying}
                onClick={() => handleSelect(index)}
              />
            );
          })}
        </div>
      </div>
    );
  }
);
