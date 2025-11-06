import { motion } from 'framer-motion';

interface EqualizerProps {
  data: number[];
  isActive: boolean;
  album?: 'firewall' | 'saints' | 'bonus';
}

export const Equalizer = ({
  data,
  isActive,
  album = 'firewall',
}: EqualizerProps) => {
  const isBonus = album === 'bonus';

  const barGradient = isBonus
    ? 'linear-gradient(to top, rgba(255,0,150,0.8), rgba(255,100,200,0.9), rgba(255,180,230,1))'
    : 'linear-gradient(to top, hsl(var(--equalizer-bar)), hsl(var(--accent)), hsl(var(--neon-cyan)))';

  const glowShadow = isBonus
    ? [
        '0 0 4px rgba(255,0,150,0.4)',
        '0 0 16px rgba(255,0,150,0.8)',
        '0 0 4px rgba(255,0,150,0.4)',
      ]
    : [
        '0 0 4px hsl(var(--neon-cyan) / 0.5)',
        '0 0 16px hsl(var(--accent) / 0.8)',
        '0 0 4px hsl(var(--neon-cyan) / 0.5)',
      ];

  const topGlow = isBonus
    ? 'radial-gradient(circle at center, rgba(255,0,150,1), transparent)'
    : 'radial-gradient(circle at center, hsl(var(--neon-cyan)), transparent)';

  return (
    <div
      className={`flex items-end justify-between gap-1 h-32 rounded-lg p-3 overflow-hidden`}
    >
      {data.map((value, index) => (
        <motion.div
          key={index}
          className="relative flex-1 mx-[1px] rounded-sm"
          style={{
            background: barGradient,
          }}
          animate={
            isActive
              ? {
                  height: [
                    `${20 + value * 60}%`,
                    `${40 + value * 40}%`,
                    `${15 + value * 70}%`,
                  ],
                  boxShadow: glowShadow,
                }
              : { height: '10%' }
          }
          transition={{
            duration: 0.5 + index * 0.05,
            repeat: isActive ? Infinity : 0,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          {/* Neon glow on top of each bar */}
          {isActive && (
            <motion.div
              className="absolute left-0 right-0 h-2 rounded-sm"
              style={{
                top: 0,
                background: topGlow,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};
