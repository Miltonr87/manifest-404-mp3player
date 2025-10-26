import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReaderModal } from './ReaderModal';

export const DiscographyModal = ({ onClose }: { onClose: () => void }) => {
  const [openReader, setOpenReader] = useState<'firewall' | 'saints' | null>(
    null
  );
  const [viewportHeight, setViewportHeight] = useState('90vh');

  useEffect(() => {
    const updateHeight = () => {
      const miniPlayerHeight = 80;
      const vh = window.innerHeight;
      setViewportHeight(`${vh - miniPlayerHeight - 16}px`);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    const audioCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  }, []);

  return (
    <AnimatePresence>
      {!openReader && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
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
            className="relative w-full max-w-5xl flex flex-col border border-primary/30 bg-secondary/20 rounded-2xl overflow-y-auto hide-scrollbar player-panel"
            style={{ maxHeight: viewportHeight }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="sticky top-0 z-20 bg-gradient-to-b from-background/95 to-background/60 backdrop-blur-md border-b border-primary/30 py-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center neon-text tracking-wider">
                Discography
              </h2>
              <motion.button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 rounded-lg hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>
            <br />
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 px-4 pb-8 sm:px-8">
              <motion.div
                className="relative bg-secondary/30 border border-primary/30 rounded-xl overflow-hidden cursor-pointer"
                initial={{ opacity: 0, rotateY: -10, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                whileHover={{ rotateY: 4, scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setOpenReader('saints')}
              >
                <img
                  src="/assets/6.jpg"
                  alt="Silicon Saints"
                  className="w-full h-auto object-cover max-h-[65vh] transition-all duration-300"
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md p-3 text-center border-t border-primary/30"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
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
                initial={{ opacity: 0, rotateY: 10, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                whileHover={{ rotateY: -4, scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setOpenReader('firewall')}
              >
                <img
                  src="/assets/5.jpg"
                  alt="Break the Firewall"
                  className="w-full h-auto object-cover max-h-[65vh] transition-all duration-300"
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md p-3 text-center border-t border-primary/30"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-semibold text-primary text-base sm:text-lg">
                    Break the Firewall
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    A journey through the 404 first discoveries
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
