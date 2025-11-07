import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { PlayerControls } from './PlayerControls';
import { Equalizer } from './Equalizer';
import { FirewallPlaylist } from './playlist/FirewallPlaylist';
import { SaintsPlaylist } from './playlist/SaintsPlaylist';
import { BonusPlaylist } from './playlist/BonusPlaylist';
import { VolumeControl } from './VolumeControl';
import { ProgressBar } from './ProgressBar';
import { DisplayPanel } from './DisplayPanel';
import {
  firewallTracksInit,
  saintsTracksInit,
  bonusTracksInit,
  Track,
} from '../../data/manifest404Tracks';
import { motion, AnimatePresence } from 'framer-motion';

interface MP3PlayerProps {
  onAlbumChange?: (album: 'saints' | 'firewall' | 'bonus') => void;
}

export const MP3Player = ({ onAlbumChange }: MP3PlayerProps) => {
  const audioRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [firewallTracks, setFirewallTracks] = useState(firewallTracksInit);
  const [saintsTracks, setSaintsTracks] = useState(saintsTracksInit);
  const [bonusTracks] = useState(bonusTracksInit);
  const [visibleAlbum, setVisibleAlbum] = useState<
    'saints' | 'firewall' | 'bonus'
  >('saints');
  const [activeTrack, setActiveTrack] = useState({
    album: 'saints' as const,
    index: 0,
  });
  const [isBonusActive, setIsBonusActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [equalizerData, setEqualizerData] = useState<number[]>(
    new Array(10).fill(0)
  );

  useEffect(() => {
    onAlbumChange?.(visibleAlbum);
  }, [visibleAlbum, onAlbumChange]);

  useEffect(() => {
    setIsBonusActive(activeTrack.album === 'bonus');
  }, [activeTrack.album]);

  const getTracks = useCallback(() => {
    if (activeTrack.album === 'firewall') return firewallTracks;
    if (activeTrack.album === 'saints') return saintsTracks;
    return bonusTracks;
  }, [activeTrack.album, firewallTracks, saintsTracks, bonusTracks]);

  const currentTrack = useMemo(
    () => getTracks()[activeTrack.index] ?? getTracks()[0],
    [getTracks, activeTrack.index]
  );

  const initializeAudioContext = useCallback(async () => {
    const el = audioRef.current?.audio?.current;
    if (!el || audioContextRef.current) return;
    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      ctx
        .createMediaElementSource(el)
        .connect(analyser)
        .connect(ctx.destination);
      audioContextRef.current = ctx;
      analyserRef.current = analyser;
    } catch {}
  }, []);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;
    const buffer = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(buffer);
    const bands = 10;
    const step = Math.floor(buffer.length / bands);
    const values = Array.from({ length: bands }, (_, i) => {
      const segment = buffer.slice(i * step, (i + 1) * step);
      const avg = segment.reduce((a, b) => a + b, 0) / step;
      return avg / 255;
    });
    setEqualizerData(values);
    if (isPlaying)
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying && analyserRef.current) {
      audioContextRef.current?.resume();
      analyzeAudio();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isPlaying, analyzeAudio]);

  const updateDurationInList = (dur: number) => {
    const update = (tracks: Track[], setTracks: any) =>
      setTracks(
        tracks.map((t, i) =>
          i === activeTrack.index ? { ...t, duration: dur } : t
        )
      );
    if (activeTrack.album === 'firewall')
      update(firewallTracks, setFirewallTracks);
    if (activeTrack.album === 'saints') update(saintsTracks, setSaintsTracks);
  };

  const loadAndPlay = async (src: string) => {
    const el = audioRef.current?.audio?.current;
    if (!el) return;
    el.src = src;
    el.load();
    await initializeAudioContext();
    audioContextRef.current?.resume();
    try {
      await el.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const changeTrack = async (
    album: 'firewall' | 'saints' | 'bonus',
    index: number
  ) => {
    const list =
      album === 'firewall'
        ? firewallTracks
        : album === 'saints'
        ? saintsTracks
        : bonusTracks;
    const track = list[index];
    if (!track) return;
    setActiveTrack({ album, index });
    setCurrentTime(0);
    await loadAndPlay(track.filename);
  };

  const handlePlay = async () => {
    const el = audioRef.current?.audio?.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      await initializeAudioContext();
      audioContextRef.current?.resume();
      try {
        await el.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  const handleStop = () => {
    const el = audioRef.current?.audio?.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleNext = () => {
    const list = getTracks();
    const next = list.length ? (activeTrack.index + 1) % list.length : 0;
    changeTrack(activeTrack.album, next);
  };

  const handlePrevious = () => {
    const list = getTracks();
    const prev = list.length
      ? activeTrack.index === 0
        ? list.length - 1
        : activeTrack.index - 1
      : 0;
    changeTrack(activeTrack.album, prev);
  };

  const handleSeek = (time: number) => {
    const el = audioRef.current?.audio?.current;
    if (!el) return;
    el.currentTime = time;
    setCurrentTime(time);
  };

  const handleTrackSelect = async (
    album: 'firewall' | 'saints' | 'bonus',
    index: number
  ) => {
    handleStop();
    await changeTrack(album, index);
  };

  useEffect(() => {
    const el = audioRef.current?.audio?.current;
    if (!el) return;
    const onMeta = () => {
      setDuration(el.duration);
      updateDurationInList(el.duration);
    };
    const onTime = () => setCurrentTime(el.currentTime);
    const onEnded = () => handleNext();
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnded);
    };
  }, [activeTrack]);

  useEffect(() => {
    const el = audioRef.current?.audio?.current;
    if (el) el.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (activeTrack.album === visibleAlbum) return;
    const list =
      visibleAlbum === 'firewall'
        ? firewallTracks
        : visibleAlbum === 'saints'
        ? saintsTracks
        : bonusTracks;
    if (list[0]) changeTrack(visibleAlbum, 0);
  }, [visibleAlbum]);

  useEffect(() => {
    const autoplay = async () => {
      const el = audioRef.current?.audio?.current;
      if (!el) return;
      try {
        await initializeAudioContext();
        audioContextRef.current?.resume();
        el.volume = volume;
        await el.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };
    autoplay();
  }, []);

  const formatTime = (s: number) =>
    !s || isNaN(s)
      ? '00:00'
      : `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(
          Math.floor(s % 60)
        ).padStart(2, '0')}`;

  return (
    <div
      className={`pt-20 pb-8 px-4 md:px-8 min-h-screen bg-background ${
        isBonusActive ? 'shadow-[0_0_16px_rgba(255,0,150,0.3)]' : ''
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div
          className={`player-panel p-8 space-y-8 ${
            isBonusActive
              ? 'border-pink-500/40 shadow-[0_0_20px_rgba(255,0,150,0.3)]'
              : ''
          }`}
        >
          <DisplayPanel
            track={currentTrack}
            currentTime={formatTime(currentTime)}
            duration={formatTime(duration)}
            isPlaying={isPlaying}
            album={activeTrack.album}
            onTogglePlay={handlePlay}
          />
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            album={activeTrack.album}
          />
          <div className="flex items-center justify-between gap-6">
            <PlayerControls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onStop={handleStop}
              onPrevious={handlePrevious}
              onNext={handleNext}
              album={activeTrack.album}
            />
            <VolumeControl
              volume={volume}
              album={activeTrack.album}
              onVolumeChange={setVolume}
            />
          </div>
        </div>
        <div className="player-panel p-8">
          <Equalizer
            data={equalizerData}
            album={activeTrack.album}
            isActive={isPlaying}
          />
        </div>
        <div className="flex justify-center items-center gap-0 bg-secondary border border-border rounded-md w-fit mx-auto ">
          <button
            onClick={() => setVisibleAlbum('saints')}
            className={`px-6 py-2 text-sm font-semibold rounded-md transition-all
    ${
      visibleAlbum === 'saints'
        ? 'text-primary bg-player-panel-dark border border-primary'
        : 'text-gray-400 hover:text-primary hover:border hover:border-primary'
    }
  `}
          >
            Silicon Saints
          </button>
          <div className="h-6 w-px bg-border" />
          <button
            onClick={() => setVisibleAlbum('firewall')}
            className={`px-6 py-2 text-sm font-semibold rounded-md transition-all
    ${
      visibleAlbum === 'firewall'
        ? 'text-primary bg-player-panel-dark border border-primary'
        : 'text-gray-400 hover:text-primary hover:border hover:border-primary'
    }
  `}
          >
            Break The Firewall
          </button>

          <div className="h-6 w-px bg-border" />
          <button
            onClick={() => setVisibleAlbum('bonus')}
            className={`px-6 py-2 text-sm font-semibold rounded-md transition-all
    ${
      visibleAlbum === 'bonus'
        ? 'text-pink-400 bg-player-panel-dark border border-pink-500'
        : 'text-gray-400 hover:text-pink-400 hover:border hover:border-pink-500'
    }
  `}
          >
            Bonus Track
          </button>
        </div>
        <AnimatePresence mode="wait">
          <div className="pb-12">
            {visibleAlbum === 'saints' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="player-panel p-8 space-y-8"
              >
                <SaintsPlaylist
                  tracks={saintsTracks}
                  currentTrack={
                    activeTrack.album === 'saints' ? activeTrack.index : -1
                  }
                  isPlaying={activeTrack.album === 'saints' && isPlaying}
                  onTrackSelect={(i) => handleTrackSelect('saints', i)}
                />
              </motion.div>
            )}
            {visibleAlbum === 'firewall' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="player-panel p-8 space-y-8"
              >
                <FirewallPlaylist
                  tracks={firewallTracks}
                  currentTrack={
                    activeTrack.album === 'firewall' ? activeTrack.index : -1
                  }
                  isPlaying={activeTrack.album === 'firewall' && isPlaying}
                  onTrackSelect={(i) => handleTrackSelect('firewall', i)}
                />
              </motion.div>
            )}
            {visibleAlbum === 'bonus' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="player-panel p-8 space-y-8"
              >
                <BonusPlaylist
                  tracks={bonusTracks}
                  currentTrack={
                    activeTrack.album === 'bonus' ? activeTrack.index : -1
                  }
                  isPlaying={activeTrack.album === 'bonus' && isPlaying}
                  onTrackSelect={(i) => handleTrackSelect('bonus', i)}
                />
              </motion.div>
            )}
          </div>
        </AnimatePresence>
        <AudioPlayer
          ref={audioRef}
          src={currentTrack?.filename}
          preload="none"
          crossOrigin="anonymous"
          autoPlayAfterSrcChange
          showJumpControls={false}
          showSkipControls={false}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};
