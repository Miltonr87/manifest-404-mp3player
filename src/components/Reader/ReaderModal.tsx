import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { LyricsModal } from './LyricsModal';

const images = [
  {
    src: '/assets/1.png',
    title: 'Algorithmic Tyranny',
    lyricsPath: '/lyrics/1.txt',
  },
  {
    src: '/assets/2.png',
    title: 'Code Revolution',
    lyricsPath: '/lyrics/2.txt',
  },
  {
    src: '/assets/3.png',
    title: 'Pixelated Love',
    lyricsPath: '/lyrics/3.txt',
  },
  {
    src: '/assets/4.png',
    title: 'Synthetic Addiction',
    lyricsPath: '/lyrics/4.txt',
  },
  {
    src: '/assets/5.png',
    title: 'Break the Firewall',
    lyricsPath: '/lyrics/5.txt',
  },
];

export const ReaderModal = ({ onClose }: { onClose: () => void }) => {
  const [activeSong, setActiveSong] = useState<{
    title: string;
    lyrics: string;
  } | null>(null);

  const openSong = async (item: { title: string; lyricsPath: string }) => {
    try {
      const res = await fetch(item.lyricsPath);
      const text = await res.text();
      setActiveSong({ title: item.title, lyrics: text });
    } catch (err) {
      console.error('Erro ao carregar letra:', err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="relative w-full h-full max-w-6xl mx-auto flex flex-col p-6"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            onClick={onClose}
            className="absolute top-5 right-5 z-50 bg-red-600 text-white p-2 rounded-full hover:bg-red-500 transition-all"
            whileTap={{ rotate: 90, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <X size={20} />
          </motion.button>
          <div className="flex-1 overflow-x-scroll snap-x snap-mandatory flex gap-8 p-6">
            {images.map((item, i) => (
              <motion.img
                key={i}
                src={item.src}
                alt={item.title}
                className="
                  snap-center cursor-pointer rounded-2xl shadow-lg border border-purple-600
                  max-h-[70vh] sm:max-h-[80vh] lg:max-h-[85vh]
                  w-auto max-w-[85vw] sm:max-w-[70vw] lg:max-w-[65vw]
                "
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 200 }}
                onClick={() => openSong(item)}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
      {activeSong && (
        <LyricsModal
          title={activeSong.title}
          lyrics={activeSong.lyrics}
          onClose={() => setActiveSong(null)}
        />
      )}
    </AnimatePresence>
  );
};
