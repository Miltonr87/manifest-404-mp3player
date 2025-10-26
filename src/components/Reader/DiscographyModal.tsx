import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReaderModal } from './ReaderModal';

export const DiscographyModal = ({ onClose }: { onClose: () => void }) => {
  const [openReader, setOpenReader] = useState<'firewall' | 'saints' | null>(
    null
  );

  return (
    <AnimatePresence>
      {!openReader && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
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
            className="relative w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] player-panel p-6 sm:p-8 flex flex-col overflow-y-auto sm:overflow-hidden border border-primary/30 bg-secondary/20 rounded-2xl hide-scrollbar"
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
            <motion.h2
              className="text-3xl font-bold text-center neon-text mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              Reader
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-2 sm:mt-4">
              <motion.div
                className="relative bg-secondary/30 border border-primary/30 rounded-xl overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setOpenReader('saints')}
              >
                <img
                  src="/assets/6.png"
                  alt="Silicon Saints"
                  className="w-full h-auto max-h-[70vh] sm:h-72 object-cover transition-all duration-300"
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md p-3 text-center"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-semibold text-primary text-base sm:text-lg">
                    Silicon Saints
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    Meet the prophets of the machine age
                  </p>
                </motion.div>
              </motion.div>
              <motion.div
                className="relative bg-secondary/30 border border-primary/30 rounded-xl overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setOpenReader('firewall')}
              >
                <img
                  src="/assets/5.png"
                  alt="Break the Firewall"
                  className="w-full h-auto max-h-[70vh] sm:h-72 object-cover transition-all duration-300"
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md p-3 text-center"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-semibold text-primary text-base sm:text-lg">
                    Break the Firewall
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    A journey through the Manifest 404 first mission
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
      {openReader && (
        <ReaderModal
          albumType={openReader}
          onClose={() => setOpenReader(null)}
        />
      )}
    </AnimatePresence>
  );
};
