import { useState } from "react";
import { Download, Info } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "../MP3Player/ThemeToggle";
import { AboutModal } from "./AboutModal";
import logoImage from "@/assets/manifest-404-ios-logo.png";

export const Navbar = () => {
  const [showAbout, setShowAbout] = useState(false);

  const handleDownload = () => {
    // Create a simple download for the current page as HTML
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manifest 404 - MP3 Player</title>
</head>
<body>
    <h1>Manifest 404 - Futuristic MP3 Player</h1>
    <p>Thank you for downloading Manifest 404!</p>
    <p>This is a modern, futuristic MP3 player with live equalizer effects.</p>
    <p>Visit the live version at: ${window.location.href}</p>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest-404-player.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and App Name */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={logoImage} 
                  alt="Manifest 404 Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold neon-text">MANIFEST 404</h1>
                <p className="text-xs text-muted-foreground">Futuristic MP3 Player</p>
              </div>
            </motion.div>

            {/* Navigation Items */}
            <div className="flex items-center gap-4">
              {/* About Button */}
              <motion.button
                onClick={() => setShowAbout(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Info className="w-4 h-4" />
                About
              </motion.button>

              {/* Download Button */}
              <motion.button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                Download
              </motion.button>

              {/* Theme Toggle */}
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