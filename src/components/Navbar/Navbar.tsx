import { useState } from 'react';
import { Download, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../MP3Player/ThemeToggle';
import { AboutModal } from './AboutModal';
// import logoImage from '@/assets/manifest-404-ios-logo.png';

export const Navbar = () => {
  const [showAbout, setShowAbout] = useState(false);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href =
      'https://github.com/Miltonr87/Manifest-404/archive/refs/heads/main.zip';
    a.download = 'Manifest-404-main.zip'; // nome sugerido para salvar
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
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.button
                onClick={() => setShowAbout(true)}
                className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
              </motion.button>
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
    </>
  );
};
