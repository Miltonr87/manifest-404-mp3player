import { motion } from 'framer-motion';

interface EqualizerProps {
  data: number[];
  isActive: boolean;
}

export const Equalizer = ({ data, isActive }: EqualizerProps) => {
  return (
    <div className="flex items-end justify-between gap-1 h-32 bg-muted/10 rounded-lg p-3 overflow-hidden">
      {data.map((value, index) => (
        <motion.div
          key={index}
          className="relative flex-1 mx-[1px] rounded-sm"
          style={{
            background: `linear-gradient(to top,
              hsl(var(--equalizer-bar)),
              hsl(var(--accent)),
              hsl(var(--neon-cyan)))`,
          }}
          animate={
            isActive
              ? {
                  height: [
                    `${20 + value * 60}%`,
                    `${40 + value * 40}%`,
                    `${15 + value * 70}%`,
                  ],
                  boxShadow: [
                    '0 0 4px hsl(var(--neon-cyan) / 0.5)',
                    '0 0 16px hsl(var(--accent) / 0.8)',
                    '0 0 4px hsl(var(--neon-cyan) / 0.5)',
                  ],
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
          {/* Glow no topo da barra */}
          {isActive && (
            <motion.div
              className="absolute left-0 right-0 h-2 rounded-sm"
              style={{
                top: 0,
                background: `radial-gradient(circle at center,
                  hsl(var(--neon-cyan)),
                  transparent)`,
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
