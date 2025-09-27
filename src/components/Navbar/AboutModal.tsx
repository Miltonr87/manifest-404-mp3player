import { motion, AnimatePresence } from "framer-motion";
import { X, Music, Zap, Palette, Smartphone } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal Content */}
        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto player-panel p-8"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold neon-text mb-2">About Manifest 404</h2>
            <p className="text-muted-foreground">
              A futuristic MP3 player experience with real-time audio visualization
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              className="flex items-start gap-4 p-4 rounded-lg bg-secondary/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-2 rounded-lg bg-primary/20">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Live Audio Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time frequency analysis using Web Audio API for authentic equalizer visualization
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-4 p-4 rounded-lg bg-secondary/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-2 rounded-lg bg-accent/20">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Stunning Animations</h3>
                <p className="text-sm text-muted-foreground">
                  Smooth framer-motion animations with vertical wave effects and color transitions
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-4 p-4 rounded-lg bg-secondary/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-2 rounded-lg bg-neon-cyan/20">
                <Palette className="w-6 h-6" style={{ color: "hsl(var(--neon-cyan))" }} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Dual Theme Support</h3>
                <p className="text-sm text-muted-foreground">
                  Beautiful dark and light themes with smooth transitions and neon accents
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-4 p-4 rounded-lg bg-secondary/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-2 rounded-lg bg-primary/20">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Responsive Design</h3>
                <p className="text-sm text-muted-foreground">
                  Fully responsive interface that works perfectly on desktop and mobile devices
                </p>
              </div>
            </motion.div>
          </div>

          {/* Technology Stack */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Built With</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Web Audio API', 'Lucide Icons'].map((tech) => (
                <motion.span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Created with 💚 • Experience the future of music visualization
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};