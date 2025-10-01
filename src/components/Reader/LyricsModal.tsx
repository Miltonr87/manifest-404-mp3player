import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LyricsModalProps {
  title: string;
  lyrics: string;
  onClose: () => void;
}

export const LyricsModal = ({ title, lyrics, onClose }: LyricsModalProps) => {
  const formattedLyrics = lyrics.split('\n').map((line, idx) => {
    if (line.match(/\[Chorus\]/i)) {
      return (
        <motion.p
          key={idx}
          className="text-pink-400 font-bold text-lg drop-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 1.5,
          }}
        >
          {line}
        </motion.p>
      );
    } else if (line.match(/\[.*\]/)) {
      return (
        <p key={idx} className="text-purple-400 font-semibold mt-4">
          {line}
        </p>
      );
    }
    return (
      <p key={idx} className="text-gray-200">
        {line}
      </p>
    );
  });

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
          className="relative w-full max-w-4xl max-h-[85vh] player-panel p-6 overflow-y-auto"
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
          <h2 className="text-2xl font-bold neon-text mb-6">{title}</h2>
          <div className="space-y-2 text-sm leading-relaxed">
            {formattedLyrics}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
