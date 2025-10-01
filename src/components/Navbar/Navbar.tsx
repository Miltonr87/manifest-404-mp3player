import { useState } from 'react';
import { Download, Info, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../MP3Player/ThemeToggle';
import { AboutModal } from './AboutModal';
import { ReaderModal } from '../Reader/ReaderModal'; // novo import

export const Navbar = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showReader, setShowReader] = useState(false);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href =
      'https://github.com/Miltonr87/Manifest-404/archive/refs/heads/main.zip';
    a.download = 'Manifest-404.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-xl font-bold neon-text">Manifest 404</h1>
            </motion.div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* About */}
              <motion.button
                onClick={() => setShowAbout(true)}
                className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors shadow-md"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 15px hsl(var(--secondary) / 0.5)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
              </motion.button>

              {/* Reader */}
              <motion.button
                onClick={() => setShowReader(true)}
                className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-lg text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors shadow-lg"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 20px hsl(var(--accent) / 0.5)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Reader</span>
              </motion.button>

              {/* Download */}
              <motion.button
                onClick={handleDownload}
                className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 20px hsl(var(--primary) / 0.5)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </motion.button>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* About Modal */}
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />

      {/* Reader Modal */}
      {showReader && <ReaderModal onClose={() => setShowReader(false)} />}
    </>
  );
};
