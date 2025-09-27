import { motion } from "framer-motion";

interface EqualizerProps {
  data: number[];
  isActive: boolean;
}

export const Equalizer = ({ data, isActive }: EqualizerProps) => {
  const bands = ['60', '170', '310', '600', '1K', '3K', '6K', '12K', '14K', '16K'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold neon-text">LIVE EQUALIZER</h3>
        <div className="flex items-center gap-2">
          <motion.div 
            className={`w-3 h-3 rounded-full ${isActive ? 'neon-glow' : 'bg-muted'}`}
            animate={isActive ? {
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7],
              boxShadow: [
                "0 0 0px hsl(var(--glow) / 0.5)",
                "0 0 15px hsl(var(--glow) / 0.8)",
                "0 0 0px hsl(var(--glow) / 0.5)"
              ]
            } : {}}
            transition={{
              duration: 0.8,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          <span className="digital-display text-sm">
            {isActive ? 'LIVE' : 'OFF'}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-1 h-32 bg-muted/20 rounded-lg p-4 overflow-hidden">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div className="flex-1 flex items-end justify-center w-full relative">
              {/* Main animated bar with vertical wave */}
              <motion.div 
                className="w-full max-w-[16px] min-h-[8px] rounded-sm relative overflow-hidden"
                style={{ 
                  background: isActive 
                    ? `linear-gradient(to top, 
                        hsl(var(--equalizer-bar)), 
                        hsl(var(--accent)), 
                        hsl(var(--neon-cyan)))`
                    : 'hsl(var(--muted))',
                  boxShadow: isActive 
                    ? `0 0 ${8 + value * 20}px hsl(var(--equalizer-bar) / ${0.7 + value * 0.3}),
                       0 0 ${15 + value * 25}px hsl(var(--accent) / ${0.4 + value * 0.4})`
                    : 'none'
                }}
                animate={{
                  height: [
                    `${Math.max(value * 70 + Math.sin(index * 0.8) * 15, 12)}%`,
                    `${Math.max(value * 110 + Math.sin(index * 0.8 + Math.PI) * 20, 15)}%`,
                    `${Math.max(value * 85 + Math.sin(index * 0.8 + Math.PI/2) * 18, 12)}%`
                  ],
                  background: isActive ? [
                    `linear-gradient(${180 + index * 20}deg, 
                      hsl(var(--equalizer-bar)), 
                      hsl(var(--accent)), 
                      hsl(var(--neon-cyan)))`,
                    `linear-gradient(${200 + index * 25}deg, 
                      hsl(var(--accent)), 
                      hsl(var(--neon-cyan)), 
                      hsl(var(--equalizer-bar)))`,
                    `linear-gradient(${160 + index * 15}deg, 
                      hsl(var(--neon-cyan)), 
                      hsl(var(--equalizer-bar)), 
                      hsl(var(--accent)))`
                  ] : undefined
                }}
                transition={{
                  height: { 
                    duration: 0.4 + (index * 0.08), 
                    ease: "easeInOut",
                    repeat: isActive ? Infinity : 0,
                    repeatType: "reverse"
                  },
                  background: {
                    duration: 1.5 + (index * 0.1),
                    repeat: isActive ? Infinity : 0,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px hsl(var(--accent) / 0.9)"
                }}
              >
                {/* Vertical wave overlay */}
                <motion.div
                  className="absolute inset-0 rounded-sm"
                  style={{
                    background: `linear-gradient(to top, 
                      transparent 0%, 
                      hsl(var(--accent) / 0.4) 30%, 
                      hsl(var(--neon-cyan) / 0.6) 60%,
                      hsl(var(--equalizer-bar) / 0.8) 100%)`
                  }}
                  animate={isActive ? {
                    backgroundPosition: [
                      "0% 0%",
                      "0% 100%", 
                      "0% 0%"
                    ],
                    opacity: [0.4, 0.8, 0.4]
                  } : {}}
                  transition={{
                    duration: 0.8 + (index * 0.15),
                    repeat: isActive ? Infinity : 0,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
                
                {/* Top glow that moves vertically */}
                <motion.div
                  className="absolute left-0 right-0 h-3 rounded-sm"
                  style={{
                    background: `radial-gradient(ellipse at center, 
                      hsl(var(--neon-cyan) / 0.9), 
                      hsl(var(--accent) / 0.6), 
                      transparent)`,
                    boxShadow: "0 0 15px hsl(var(--neon-cyan) / 0.8)"
                  }}
                  animate={isActive ? {
                    top: [
                      `${20 + value * 60}%`,
                      `${5 + value * 20}%`,
                      `${30 + value * 50}%`
                    ],
                    opacity: [0.3, 1, 0.3],
                    scaleY: [0.8, 1.5, 0.8]
                  } : {}}
                  transition={{
                    duration: 0.6 + (index * 0.1),
                    repeat: isActive ? Infinity : 0,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />

                {/* Vertical pulse lines */}
                <motion.div
                  className="absolute left-1/2 w-0.5 rounded-full"
                  style={{
                    background: "hsl(var(--accent))",
                    boxShadow: "0 0 8px hsl(var(--accent))",
                    transform: "translateX(-50%)"
                  }}
                  animate={isActive ? {
                    height: [
                      `${value * 100}%`,
                      `${value * 120 + 10}%`,
                      `${value * 80}%`
                    ],
                    opacity: [0.5, 1, 0.5]
                  } : {}}
                  transition={{
                    duration: 0.3 + (index * 0.05),
                    repeat: isActive ? Infinity : 0,
                    repeatType: "reverse",
                    ease: "easeOut"
                  }}
                />
              </motion.div>
              
              {/* Floating peak indicator with vertical movement */}
              {isActive && value > 0.6 && (
                <motion.div
                  className="absolute w-full max-w-[20px] h-1 rounded-full"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(var(--neon-cyan)), 
                      hsl(var(--accent)))`,
                    boxShadow: "0 0 12px hsl(var(--neon-cyan) / 0.9)"
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    top: [
                      `${Math.max((1 - value) * 80, 5)}%`,
                      `${Math.max((1 - value) * 60, 2)}%`,
                      `${Math.max((1 - value) * 90, 8)}%`
                    ],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.3, 0.5],
                    scaleY: [1, 2, 1]
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut"
                  }}
                />
              )}
              
              {/* Vertical particle trail for high frequencies */}
              {isActive && value > 0.7 && index > 5 && (
                <motion.div
                  className="absolute w-1 h-1 rounded-full left-1/2"
                  style={{
                    background: "hsl(var(--neon-cyan))",
                    boxShadow: "0 0 6px hsl(var(--neon-cyan))",
                    transform: "translateX(-50%)"
                  }}
                  initial={{ opacity: 0, scale: 0, top: "90%" }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    top: ["90%", "10%", "-10%"]
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeOut"
                  }}
                />
              )}
              
              {/* Enhanced reflection with vertical wave */}
              <motion.div
                className="absolute bottom-0 w-full max-w-[16px] rounded-sm"
                style={{
                  background: `linear-gradient(to top, 
                    hsl(var(--equalizer-bar) / 0.3), 
                    hsl(var(--accent) / 0.2),
                    transparent)`,
                  transform: "scaleY(-1)"
                }}
                animate={{
                  height: `${Math.max(value * 35, 6)}%`,
                  opacity: isActive ? [0.2, 0.5, 0.2] : 0.1
                }}
                transition={{
                  height: { duration: 0.25, ease: "easeOut" },
                  opacity: { 
                    duration: 0.8 + (index * 0.1), 
                    repeat: isActive ? Infinity : 0,
                    repeatType: "reverse" 
                  }
                }}
              />
            </div>
            
            <motion.span 
              className="digital-display text-xs opacity-70"
              animate={isActive && value > 0.4 ? {
                color: [
                  "hsl(var(--muted-foreground))", 
                  "hsl(var(--accent))", 
                  "hsl(var(--neon-cyan))",
                  "hsl(var(--equalizer-bar))",
                  "hsl(var(--muted-foreground))"
                ],
                textShadow: [
                  "0 0 0px hsl(var(--glow) / 0)",
                  "0 0 8px hsl(var(--accent) / 0.8)",
                  "0 0 0px hsl(var(--glow) / 0)"
                ]
              } : {}}
              transition={{
                duration: 1.2 + (index * 0.1),
                ease: "easeInOut"
              }}
            >
              {bands[index]}
            </motion.span>
          </div>
        ))}
      </div>
      
      {/* Enhanced frequency spectrum visualization */}
      <motion.div 
        className="h-2 bg-muted/20 rounded-full overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(to right, 
              hsl(var(--equalizer-bar)), 
              hsl(var(--accent)), 
              hsl(var(--neon-cyan)))`,
            width: `${Math.max(...data) * 100}%`
          }}
          animate={{
            width: `${Math.max(...data) * 100}%`,
            boxShadow: [
              "0 0 5px hsl(var(--equalizer-bar) / 0.5)",
              "0 0 15px hsl(var(--accent) / 0.8)",
              "0 0 5px hsl(var(--equalizer-bar) / 0.5)"
            ]
          }}
          transition={{
            width: { duration: 0.2, ease: "easeOut" },
            boxShadow: { 
              duration: 1.5, 
              repeat: isActive ? Infinity : 0,
              repeatType: "reverse" 
            }
          }}
        />
        
        {/* Spectrum pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, 
              transparent, 
              hsl(var(--accent) / 0.4), 
              transparent)`
          }}
          animate={isActive ? {
            x: ["-100%", "200%"]
          } : {}}
          transition={{
            duration: 2.5,
            repeat: isActive ? Infinity : 0,
            ease: "linear"
          }}
        />
      </motion.div>
    </div>
  );
};