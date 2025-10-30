import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar/Navbar';
import { MP3Player } from '@/components/MP3Player/MP3Player';
import { IntroPage } from './IntroPage';

const Index = () => {
  const [entered, setEntered] = useState(false);

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
          <Navbar />
          <MP3Player />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
