import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { IntroPage } from './pages/introPage';
import { motion, AnimatePresence } from 'framer-motion';

const queryClient = new QueryClient();

const App = () => {
  const [entered, setEntered] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-dvh overflow-y-auto overflow-x-hidden mobile-hide-scrollbar">
        <TooltipProvider>
          <Toaster />
          <Sonner />

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
                <BrowserRouter
                  future={{
                    v7_relativeSplatPath: true,
                    v7_startTransition: true,
                  }}
                >
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </motion.div>
            )}
          </AnimatePresence>
        </TooltipProvider>
      </div>
    </QueryClientProvider>
  );
};

export default App;
