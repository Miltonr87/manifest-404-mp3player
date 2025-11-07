import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { LyricsModal } from './LyricsModal';

const firewallData = [
  {
    src: '/assets/1.jpg',
    title: 'Algorithmic Tyranny',
    lyricsPath: '/lyrics/1.txt',
  },
  {
    src: '/assets/2.jpg',
    title: 'Code Revolution',
    lyricsPath: '/lyrics/2.txt',
  },
  {
    src: '/assets/3.jpg',
    title: 'Pixelated Love',
    lyricsPath: '/lyrics/3.txt',
  },
  {
    src: '/assets/4.jpg',
    title: 'Synthetic Addiction',
    lyricsPath: '/lyrics/4.txt',
  },
  {
    src: '/assets/5.jpg',
    title: 'Break the Firewall',
    lyricsPath: '/lyrics/5.txt',
  },
];

const saintsData = [
  {
    src: '/assets/siliconSaints/1.jpg',
    title: '404 Salvation Road',
    lyricsPath: '/lyrics/siliconSaints/1.txt',
  },
  {
    src: '/assets/siliconSaints/2.jpg',
    title: 'Clean Code, Dirty World',
    lyricsPath: '/lyrics/siliconSaints/2.txt',
  },
  {
    src: '/assets/siliconSaints/3.jpg',
    title: 'Crush on Dopamine',
    lyricsPath: '/lyrics/siliconSaints/3.txt',
  },
  {
    src: '/assets/siliconSaints/4.jpg',
    title: 'The Great Reset',
    lyricsPath: '/lyrics/siliconSaints/4.txt',
  },
  {
    src: '/assets/siliconSaints/5.jpg',
    title: 'Silicon Saints',
    lyricsPath: '/lyrics/siliconSaints/5.txt',
  },
  {
    src: '/assets/siliconSaints/6.jpg',
    title: 'Digital Harvest',
    lyricsPath: '/lyrics/siliconSaints/6.txt',
  },
  {
    src: '/assets/siliconSaints/7.jpg',
    title: 'Church Of The Machine',
    lyricsPath: '/lyrics/siliconSaints/7.txt',
  },
  {
    src: '/assets/siliconSaints/8.jpg',
    title: 'Angels In The Stream',
    lyricsPath: '/lyrics/siliconSaints/8.txt',
  },
  {
    src: '/assets/siliconSaints/9.jpg',
    title: 'Digital Chains',
    lyricsPath: '/lyrics/siliconSaints/9.txt',
  },
  {
    src: '/assets/siliconSaints/10.jpg',
    title: 'Ghost In My Feed',
    lyricsPath: '/lyrics/siliconSaints/10.txt',
  },
  {
    src: '/assets/siliconSaints/11.jpg',
    title: 'Soft Reboot',
    lyricsPath: '/lyrics/siliconSaints/11.txt',
  },
];

type Item = { src: string; title: string; lyricsPath: string };

export const ReaderModal = ({
  onClose,
  albumType = 'firewall',
}: {
  onClose: () => void;
  albumType?: 'firewall' | 'saints';
}) => {
  const images = useMemo<Item[]>(
    () => (albumType === 'firewall' ? firewallData : saintsData),
    [albumType]
  );

  const [activeSong, setActiveSong] = useState<{
    title: string;
    lyrics: string;
  } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLImageElement[]>([]);
  const singleImage = images.length === 1;

  useEffect(() => {
    setCurrentIndex(0);
    setIsReady(false);
  }, [albumType]);

  useEffect(() => {
    let loaded = 0;
    const done = () => {
      loaded++;
      if (loaded === images.length) setIsLoading(false);
    };
    images.forEach((it) => {
      const img = new Image();
      img.src = it.src;
      if (img.complete) done();
      else {
        img.onload = done;
        img.onerror = done;
      }
    });
  }, [images]);

  const scrollToIndex = (
    index: number,
    behavior: ScrollBehavior = 'smooth'
  ) => {
    const container = scrollRef.current;
    const target = itemRefs.current[index];
    if (!container || !target) return;
    const left =
      target.offsetLeft - (container.clientWidth - target.clientWidth) / 2;
    container.scrollTo({ left, behavior });
    setCurrentIndex(index);
  };

  const openSong = async (item: { title: string; lyricsPath: string }) => {
    try {
      const res = await fetch(item.lyricsPath);
      const text = await res.text();
      setActiveSong({ title: item.title, lyrics: text });
    } catch (e) {
      console.error('Error loading lyrics:', e);
    }
  };

  const scrollLeft = () => currentIndex > 0 && scrollToIndex(currentIndex - 1);
  const scrollRight = () =>
    currentIndex < images.length - 1 && scrollToIndex(currentIndex + 1);

  useEffect(() => {
    const t = setTimeout(() => {
      scrollToIndex(0, 'auto');
      setIsReady(true);
    }, 120);
    return () => clearTimeout(t);
  }, [images]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        {!isLoading && (
          <motion.div
            className={`relative w-full ${
              singleImage
                ? 'max-w-3xl md:flex md:items-center md:justify-center'
                : 'max-w-6xl'
            } player-panel p-6 flex flex-col`}
            style={{ maxHeight: 'calc(95vh - 80px)', paddingBottom: '30px' }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              onClick={onClose}
              className="absolute top-2 right-3 p-2 rounded-lg hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
            {singleImage ? (
              <motion.img
                key={`${albumType}-${images[0].title}-${images[0].src}`}
                src={images[0].src}
                alt={images[0].title}
                loading="eager"
                decoding="async"
                className="rounded-2xl shadow-lg border border-border max-h-[85vh] w-auto cursor-pointer mx-auto"
                onClick={() => openSong(images[0])}
              />
            ) : (
              <>
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-x-auto snap-x snap-mandatory flex gap-8 p-6 hide-scrollbar"
                >
                  {images.map((item, i) => (
                    <motion.img
                      key={`${albumType}-${item.title}-${i}`}
                      ref={(el) => el && (itemRefs.current[i] = el)}
                      src={item.src}
                      alt={item.title}
                      loading={i === currentIndex ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={i === currentIndex ? 'high' : 'low'}
                      className={`snap-center cursor-pointer rounded-2xl shadow-lg border border-border
                        max-h-[70vh] sm:max-h-[80vh] lg:max-h-[85vh]
                        w-auto max-w-[75vw] sm:max-w-[70vw] lg:max-w-[65vw]
                        ${
                          i === currentIndex
                            ? 'opacity-100 scale-100'
                            : 'opacity-70 scale-95'
                        }
                        transition-all duration-300 ease-in-out
                        ${i === images.length - 1 ? 'mr-[120vw] sm:mr-0' : ''}
                      `}
                      onClick={() => openSong(item)}
                      style={{
                        willChange: 'transform, opacity',
                        contain: 'layout paint',
                      }}
                    />
                  ))}
                </div>
                {images.length > 1 && (
                  <div className="relative w-full flex justify-center mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={scrollLeft}
                        disabled={!isReady || currentIndex === 0}
                        className={`player-button p-3 transition-all ${
                          currentIndex === 0
                            ? 'opacity-30 cursor-not-allowed'
                            : 'hover:neon-glow'
                        }`}
                      >
                        <ChevronLeft className="w-5 h-5 text-foreground" />
                      </button>
                      <button
                        onClick={scrollRight}
                        disabled={
                          !isReady || currentIndex === images.length - 1
                        }
                        className={`player-button p-3 transition-all ${
                          currentIndex === images.length - 1
                            ? 'opacity-30 cursor-not-allowed'
                            : 'hover:neon-glow'
                        }`}
                      >
                        <ChevronRight className="w-5 h-5 text-foreground" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
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
