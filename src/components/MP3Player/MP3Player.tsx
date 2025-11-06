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

export const MP3Player = () => {
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

  const [activeTrack, setActiveTrack] = useState<{
    album: 'firewall' | 'saints' | 'bonus';
    index: number;
  }>({ album: 'saints', index: 0 });

  const [isBonusActive, setIsBonusActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [equalizerData, setEqualizerData] = useState<number[]>(
    new Array(10).fill(0)
  );

  useEffect(() => {
    setIsBonusActive(activeTrack.album === 'bonus');
  }, [activeTrack.album]);

  const getTracks = useCallback(() => {
    if (activeTrack.album === 'firewall') return firewallTracks;
    if (activeTrack.album === 'saints') return saintsTracks;
    if (activeTrack.album === 'bonus') return bonusTracks;
    return [];
  }, [activeTrack.album, firewallTracks, saintsTracks, bonusTracks]);

  const currentTrack = useMemo(
    () => getTracks()[activeTrack.index] ?? getTracks()[0],
    [getTracks, activeTrack.index]
  );

  const initializeAudioContext = useCallback(async () => {
    const el = audioRef.current?.audio?.current as HTMLAudioElement | null;
    if (!el || audioContextRef.current) return;
    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      const src = ctx.createMediaElementSource(el);
      src.connect(analyser);
      analyser.connect(ctx.destination);
      audioContextRef.current = ctx;
      analyserRef.current = analyser;
    } catch (err) {
      console.error('Failed to init audio context:', err);
    }
  }, []);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;
    const buffer = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(buffer);
    const bands = 10;
    const step = Math.floor(buffer.length / bands);
    const out: number[] = [];
    for (let i = 0; i < bands; i++) {
      const avg =
        buffer.slice(i * step, (i + 1) * step).reduce((a, b) => a + b, 0) /
        step;
      out.push(avg / 255);
    }
    setEqualizerData(out);
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

  const handleLoadedMetadata = useCallback(() => {
    const el = audioRef.current?.audio?.current;
    if (!el) return;
    const dur = el.duration;
    setDuration(dur);

    const updateList = (list: Track[], setList: any) =>
      setList(
        list.map((t, i) =>
          i === activeTrack.index ? { ...t, duration: dur } : t
        )
      );

    if (activeTrack.album === 'firewall')
      updateList(firewallTracks, setFirewallTracks);
    if (activeTrack.album === 'saints')
      updateList(saintsTracks, setSaintsTracks);
  }, [activeTrack, firewallTracks, saintsTracks]);

  useEffect(() => {
    const el = audioRef.current?.audio?.current;
    if (!el) return;

    const handleTimeUpdate = () => setCurrentTime(el.currentTime);
    const handleEnded = () => handleNext();

    el.addEventListener('loadedmetadata', handleLoadedMetadata);
    el.addEventListener('timeupdate', handleTimeUpdate);
    el.addEventListener('ended', handleEnded);

    return () => {
      el.removeEventListener('loadedmetadata', handleLoadedMetadata);
      el.removeEventListener('timeupdate', handleTimeUpdate);
      el.removeEventListener('ended', handleEnded);
    };
  }, [handleLoadedMetadata, activeTrack]);

  useEffect(() => {
    const el = audioRef.current?.audio?.current;
    if (el) el.volume = volume;
  }, [volume]);

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
      } catch (err: any) {
        if (err.name !== 'AbortError') console.error('Playback error:', err);
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
    setActiveTrack((prev) => ({
      album: prev.album,
      index: list.length ? (prev.index + 1) % list.length : 0,
    }));
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    const list = getTracks();
    setActiveTrack((prev) => ({
      album: prev.album,
      index: list.length
        ? prev.index === 0
          ? list.length - 1
          : prev.index - 1
        : 0,
    }));
    setCurrentTime(0);
  };

  const handleSeek = (time: number) => {
    const el = audioRef.current?.audio?.current;
    if (el) {
      el.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTrackSelect = async (
    album: 'firewall' | 'saints' | 'bonus',
    index: number
  ) => {
    handleStop();
    const selected = getTracks()[index];
    if (!selected) return;

    setActiveTrack({ album, index });

    setTimeout(async () => {
      const el = audioRef.current?.audio?.current;
      if (!el) return;
      el.src = selected.filename;
      el.load();
      el.addEventListener('loadedmetadata', () => setDuration(el.duration), {
        once: true,
      });

      await initializeAudioContext();
      try {
        await el.play();
        setIsPlaying(true);
      } catch (err: any) {
        if (err.name !== 'AbortError') console.error('Playback error:', err);
        setIsPlaying(false);
      }
    }, 150);
  };

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
        <div className="flex justify-center items-center gap-0 bg-secondary border border-border rounded-md shadow-[0_0_8px_hsl(var(--glow)/0.2)] w-fit mx-auto overflow-hidden">
          <button
            onClick={() => setVisibleAlbum('saints')}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold tracking-wide transition-all duration-300
              ${
                visibleAlbum === 'saints'
                  ? 'text-primary bg-player-panel-dark shadow-[inset_0_0_12px_hsl(var(--glow)/0.6)] border border-primary'
                  : 'text-gray-400 hover:text-primary'
              }`}
          >
            Silicon Saints
          </button>
          <div className="h-6 w-px bg-border" />
          <button
            onClick={() => setVisibleAlbum('firewall')}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold tracking-wide transition-all duration-300
              ${
                visibleAlbum === 'firewall'
                  ? 'text-primary bg-player-panel-dark shadow-[inset_0_0_12px_hsl(var(--glow)/0.6)] border border-primary'
                  : 'text-gray-400 hover:text-primary'
              }`}
          >
            Break The Firewall
          </button>
          <div className="h-6 w-px bg-border" />
          <button
            onClick={() => setVisibleAlbum('bonus')}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold tracking-wide transition-all duration-300
              ${
                visibleAlbum === 'bonus'
                  ? 'text-pink-400 bg-player-panel-dark border border-pink-500 shadow-[inset_0_0_16px_rgba(255,0,150,0.5),0_0_12px_rgba(255,0,150,0.5)]'
                  : 'text-gray-400 hover:text-pink-400 hover:drop-shadow-[0_0_8px_rgba(255,0,150,0.6)]'
              }`}
          >
            Bonus Tracks
          </button>
        </div>

        <AnimatePresence mode="wait">
          <div className="pb-12">
            {visibleAlbum === 'saints' && (
              <motion.div
                key="album-saints"
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
                key="album-firewall"
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
                key="album-bonus"
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
