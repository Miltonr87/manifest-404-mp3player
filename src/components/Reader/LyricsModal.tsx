import { motion } from 'framer-motion';
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
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-[10000] p-4"
      initial={{ opacity: 0, scaleY: 0, transformOrigin: 'center' }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <motion.div
        className="
          relative w-full 
          max-w-4xl sm:max-w-5xl lg:max-w-6xl 
          bg-zinc-900 rounded-2xl shadow-lg border border-purple-600 
          p-6 overflow-y-auto 
          max-h-[70vh] sm:max-h-[80vh] lg:max-h-[85vh]
        "
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white rounded-full p-2 shadow-md"
          whileTap={{ rotate: 90, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <X size={20} />
        </motion.button>
        <h2 className="text-2xl font-bold text-left text-gold-300 mb-9">
          <b>{title}</b>
        </h2>
        <div className="space-y-2 text-sm leading-relaxed">
          {formattedLyrics}
        </div>
      </motion.div>
    </motion.div>
  );
};
