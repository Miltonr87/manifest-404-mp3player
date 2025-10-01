import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const images = [
  '/assets/1.png',
  '/assets/2.png',
  '/assets/3.png',
  '/assets/4.png',
  '/assets/5.png',
];

export const ReaderModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full h-full max-w-5xl mx-auto flex flex-col">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-50 bg-red-600 text-white p-2 rounded-full hover:bg-red-500 transition-all"
        >
          <X size={20} />
        </button>

        {/* Comic Reader */}
        <div className="flex-1 overflow-x-scroll snap-x snap-mandatory flex gap-8 p-8">
          {images.map((src, i) => (
            <motion.img
              key={i}
              src={src}
              alt={`page-${i}`}
              className="snap-center max-h-[90vh] rounded-2xl shadow-lg border border-purple-600"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
