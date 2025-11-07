import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar/Navbar';
import { MP3Player } from '@/components/MP3Player/MP3Player';
import { IntroPage } from './IntroPage';

const Index = () => {
  const [entered, setEntered] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState<
    'saints' | 'firewall' | 'bonus'
  >('saints');

  return (
    <AnimatePresence mode="wait">
      {!entered ? (
        <IntroPage key="intro" onEnter={() => setEntered(true)} />
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Navbar album={activeAlbum} />
          <MP3Player onAlbumChange={setActiveAlbum} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
