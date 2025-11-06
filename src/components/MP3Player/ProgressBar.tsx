interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  album?: 'firewall' | 'saints' | 'bonus';
}

export const ProgressBar = ({
  currentTime,
  duration,
  onSeek,
  album = 'firewall',
}: ProgressBarProps) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isBonus = album === 'bonus';

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;
    onSeek(time);
  };

  return (
    <div className="space-y-2">
      <div
        className={`progress-bar h-2 cursor-pointer relative group rounded-full overflow-hidden ${
          isBonus
            ? 'bg-pink-950/30 shadow-[0_0_8px_rgba(255,0,150,0.3)]'
            : 'bg-muted/30 shadow-[0_0_8px_rgba(0,255,200,0.2)]'
        }`}
        onClick={handleClick}
      >
        <div
          className={`progress-fill h-full transition-all duration-200 ${
            isBonus
              ? 'bg-gradient-to-r from-pink-600 to-pink-400 shadow-[0_0_10px_rgba(255,0,150,0.6)]'
              : 'bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_10px_rgba(0,255,200,0.4)]'
          }`}
          style={{ width: `${progress}%` }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-200 ${
            isBonus
              ? 'border-pink-400 bg-pink-900/40 shadow-[0_0_10px_rgba(255,0,150,0.8)]'
              : 'border-primary bg-background shadow-[0_0_10px_rgba(0,255,200,0.6)]'
          } opacity-0 group-hover:opacity-100`}
          style={{
            left: `${progress}%`,
            transform: 'translateX(-50%) translateY(-50%)',
          }}
        />
      </div>

      <div
        className={`flex justify-between text-xs digital-display ${
          isBonus ? 'text-pink-400' : 'text-foreground'
        }`}
      >
        <span>
          {Math.floor(currentTime / 60)
            .toString()
            .padStart(2, '0')}
          :
          {Math.floor(currentTime % 60)
            .toString()
            .padStart(2, '0')}
        </span>
        <span>
          {Math.floor(duration / 60)
            .toString()
            .padStart(2, '0')}
          :
          {Math.floor(duration % 60)
            .toString()
            .padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};
