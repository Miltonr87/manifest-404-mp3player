import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

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
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto player-panel p-8"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center neon-text mb-2">
              About
            </h2>
            <br />
            <p className="text-muted-foreground">
              A futuristic MP3 player crafted for the digital age, featuring
              real-time audio visualization.
            </p>
            <br />
            <p>
              <b className="text-1xl font-bold neon-text mb-2">Manifest 404</b>{' '}
              is a Punk Rock digital band made with AI which blends the spirit
              of melodic hardcore with cyberpunk aesthetics.
            </p>
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Project Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'React',
                'TypeScript',
                'Framer Motion',
                'Tailwind CSS',
                'Web Audio API',
                'Lucide Icons',
              ].map((tech) => (
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
          <div className="pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
              <a
                href="https://miltonr87.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors font-medium flex items-center gap-1"
              >
                Milton Rodrigues
                <ExternalLink className="w-4 h-4" />
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
