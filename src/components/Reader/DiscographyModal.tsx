import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReaderModal } from './ReaderModal';

export const DiscographyModal = ({ onClose }: { onClose: () => void }) => {
  const [openReader, setOpenReader] = useState<'firewall' | 'saints' | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const albums = [
    {
      id: 'saints',
      title: 'Silicon Saints',
      desc: 'The Machine-age prophecy begins here',
      src: '/albums/SiliconSaints.jpg',
    },
    {
      id: 'firewall',
      title: 'Break the Firewall',
      desc: "Awakening against the system's security",
      src: '/albums/BreakTheFirewall.jpg',
    },
  ];

  useEffect(() => {
    const images = albums.map((a) => a.src);
    let loaded = 0;

    images.forEach((src) => {
      const img = new Image();
      img.src = src;

      if (img.complete) {
        loaded++;
        if (loaded === images.length) setIsLoading(false);
      } else {
        img.onload = img.onerror = () => {
          loaded++;
          if (loaded === images.length) setIsLoading(false);
        };
      }
    });
  }, []);

  const scrollToIndex = (
    index: number,
    behavior: ScrollBehavior = 'smooth'
  ) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const childWidth =
      container.firstElementChild?.getBoundingClientRect().width ?? 0;
    container.scrollTo({ left: index * (childWidth + 32), behavior });
    setCurrentIndex(index);
  };

  const scrollLeft = () => currentIndex > 0 && scrollToIndex(currentIndex - 1);
  const scrollRight = () =>
    currentIndex < albums.length - 1 && scrollToIndex(currentIndex + 1);

  useEffect(() => {
    const timeout = setTimeout(() => scrollToIndex(0, 'auto'), 200);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.body.classList.add('discography-open');
    return () => document.body.classList.remove('discography-open');
  }, []);

  return (
    <AnimatePresence>
      {!openReader && (
        <motion.div
          key="reader-loader"
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
          />
          <AnimatePresence>
            {isLoading && (
              <motion.div
                key="discography-loader"
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="relative w-20 h-20"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                >
                  <div className="absolute inset-0 rounded-full border-4 border-primary/40" />
                  <div className="absolute inset-0 rounded-full border-t-4 border-primary" />
                </motion.div>
                <motion.p
                  className="text-primary text-lg font-semibold tracking-widest neon-text"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Loading Discography...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
          {!isLoading && (
            <motion.div
              className="relative w-full max-w-6xl flex flex-col border border-border bg-secondary/10 rounded-2xl overflow-hidden player-panel"
              style={{ maxHeight: 'calc(90vh - 80px)' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="sticky top-0 z-20 bg-gradient-to-b from-background/95 to-background/60 backdrop-blur-md border-b border-border py-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground tracking-wider">
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
              <div
                ref={scrollRef}
                className="flex-1 overflow-x-auto snap-x snap-mandatory flex gap-8 p-6 hide-scrollbar"
              >
                {albums.map((album, i) => (
                  <motion.div
                    key={`${album.id}-${album.title}-${album.src}`}
                    className={`snap-center relative bg-secondary/20 border border-border rounded-xl
  overflow-hidden cursor-pointer flex-shrink-0
  w-[85vw] sm:w-[420px] md:w-[540px]  /* ✅ Forces 1 item on desktop */
  ${
    i === currentIndex ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
  } transition-all duration-300`}
                    onClick={() =>
                      setOpenReader(album.id as 'firewall' | 'saints')
                    }
                  >
                    <div className="w-[85vw] max-w-[420px] aspect-square mx-auto bg-black/20 rounded-xl flex items-center justify-center">
                      <img
                        src={album.src}
                        alt={album.title}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-background/95 to-background/60 backdrop-blur-md p-3 text-center border-t border-border"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      viewport={{ once: true }}
                    >
                      <h3 className="font-semibold text-foreground text-base sm:text-lg">
                        {album.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">
                        {album.desc}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <div className="relative w-full flex justify-center mt-4 mb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollLeft()}
                    className="player-button p-3 hover:neon-glow transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                  </button>
                  <button
                    onClick={() => scrollRight()}
                    className="player-button p-3 hover:neon-glow transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-foreground" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
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
