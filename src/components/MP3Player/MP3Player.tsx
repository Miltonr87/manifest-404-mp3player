import { useState, useRef, useEffect, useCallback } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { PlayerControls } from './PlayerControls';
import { Equalizer } from './Equalizer';
import { FirewallPlaylist } from './playlist/FirewallPlaylist';
import { SaintsPlaylist } from './playlist/SaintsPlaylist';
import { VolumeControl } from './VolumeControl';
import { ProgressBar } from './ProgressBar';
import { DisplayPanel } from './DisplayPanel';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  filename: string;
  artwork?: string;
}

const firewallTracksInit: Track[] = [
  {
    id: 1,
    title: 'Algorithmic Tyranny',
    artist: 'Break The Firewall',
    duration: 0,
    filename: '1_Algorithmic Tyranny.mp3',
  },
  {
    id: 2,
    title: 'Code Revolution',
    artist: 'Break The Firewall',
    duration: 0,
    filename: '2_Code Revolution.mp3',
  },
  {
    id: 3,
    title: 'Pixelated Love',
    artist: 'Break The Firewall',
    duration: 0,
    filename: '3_Pixelated Love.mp3',
  },
  {
    id: 4,
    title: 'Synthetic Addiction',
    artist: 'Break The Firewall',
    duration: 0,
    filename: '4_Synthetic Addiction.mp3',
  },
  {
    id: 5,
    title: 'Break The Firewall',
    artist: 'Break The Firewall',
    duration: 0,
    filename: '5_Break_the_Firewall.mp3',
  },
];

const saintsTracksInit: Track[] = [
  {
    id: 1,
    title: '404 Salvation Road',
    artist: 'Silicon Saints',
    duration: 0,
    filename: '1_Salvation_Road.mp3',
  },
  {
    id: 2,
    title: 'Clean Code, Dirty World',
    artist: 'Silicon Saints',
    duration: 0,
    filename: '2_Clean_Code.mp3',
  },
  {
    id: 3,
    title: 'Crush On Dopamine',
    artist: 'Silicon Saints',
    duration: 0,
    filename: '3_Crush_on_Dopamine.mp3',
  },
  {
    id: 4,
    title: 'The Great Reset',
    artist: 'Silicon Saints',
    duration: 0,
    filename: '4_The_Great_Reset.mp3',
  },
  {
    id: 5,
    title: 'Silicon Saints',
    artist: 'Silicon Saints',
    duration: 0,
    filename: '5_SiliconSaints.mp3',
  },
  {
    id: 6,
    title: 'Digital Harvest',
    artist: 'Silicon Saints',
    duration: 0,
    filename: '6_Digital_Harvest.mp3',
  },
  {
    id: 7,
    title: 'Angels In The Stream',
    artist: 'Silicon Saints',
    duration: 0,
    filename: '7_Angels_Stream.mp3',
  },
  {
    id: 8,
    title: 'Church Of The Machine',
    artist: 'Silicon Saints',
    duration: 0,
    filename: '8_Church_the_Machine.mp3',
  },
  {
    id: 9,
    title: 'Ghost In My Feed',
    artist: 'Silicon Saints',
    duration: 0,
    filename: '9_Ghost_in_My_Feed.mp3',
  },
  {
    id: 10,
    title: 'Soft Reboot',
    artist: 'Silicon Saints',
    duration: 0,
    filename: '10_Soft_Reboot.mp3',
  },
];

export const MP3Player = () => {
  const audioRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [firewallTracks, setFirewallTracks] = useState(firewallTracksInit);
  const [saintsTracks, setSaintsTracks] = useState(saintsTracksInit);

  const [activeTrack, setActiveTrack] = useState<{
    album: 'firewall' | 'saints';
    index: number;
  }>({
    album: 'saints',
    index: 0,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [equalizerData, setEqualizerData] = useState<number[]>(
    new Array(10).fill(0)
  );

  const getTracks = () =>
    activeTrack.album === 'firewall' ? firewallTracks : saintsTracks;
  const currentTrack = getTracks()[activeTrack.index] ?? getTracks()[0];

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
    const buf = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(buf);
    const bands = 10;
    const step = Math.floor(buf.length / bands);
    const out = [];
    for (let i = 0; i < bands; i++) {
      const avg =
        buf.slice(i * step, (i + 1) * step).reduce((a, b) => a + b, 0) / step;
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
    const el = audioRef.current?.audio?.current as HTMLAudioElement | null;
    if (!el) return;
    const dur = el.duration;
    setDuration(dur);
    const updateList = (list: Track[], setList: any) =>
      setList(
        list.map((t, i) =>
          i === activeTrack.index ? { ...t, duration: dur } : t
        )
      );
    activeTrack.album === 'firewall'
      ? updateList(firewallTracks, setFirewallTracks)
      : updateList(saintsTracks, setSaintsTracks);
  }, [activeTrack, firewallTracks, saintsTracks]);

  useEffect(() => {
    const el = audioRef.current?.audio?.current as HTMLAudioElement | null;
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
    const el = audioRef.current?.audio?.current as HTMLAudioElement | null;
    if (el) el.volume = volume;
  }, [volume]);

  const handlePlay = async () => {
    const el = audioRef.current?.audio?.current as HTMLAudioElement | null;
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
    const el = audioRef.current?.audio?.current as HTMLAudioElement | null;
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
      index: (prev.index + 1) % list.length,
    }));
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    const list = getTracks();
    setActiveTrack((prev) => ({
      album: prev.album,
      index: prev.index === 0 ? list.length - 1 : prev.index - 1,
    }));
    setCurrentTime(0);
  };

  const handleSeek = (time: number) => {
    const el = audioRef.current?.audio?.current as HTMLAudioElement | null;
    if (el) {
      el.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTrackSelect = async (
    album: 'firewall' | 'saints',
    index: number
  ) => {
    handleStop();
    const selected =
      album === 'firewall' ? firewallTracks[index] : saintsTracks[index];
    if (!selected) return;
    setActiveTrack({ album, index });
    setTimeout(async () => {
      const el = audioRef.current?.audio?.current as HTMLAudioElement | null;
      if (!el) return;
      el.src = `/audio/${selected.filename}`;
      el.load();
      el.addEventListener('loadedmetadata', () => setDuration(el.duration), {
        once: true,
      });
      await initializeAudioContext();
      try {
        await el.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Playback error:', err);
        setIsPlaying(false);
      }
    }, 150);
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '00:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, '0')}:${sec
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="pt-20 pb-8 px-4 md:px-8 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="player-panel p-8 space-y-8">
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
          />
          <div className="flex items-center justify-between gap-6">
            <PlayerControls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onStop={handleStop}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
            <VolumeControl volume={volume} onVolumeChange={setVolume} />
          </div>
        </div>
        <div className="player-panel p-8">
          <Equalizer data={equalizerData} isActive={isPlaying} />
        </div>
        <div className="player-panel p-8 space-y-8">
          <SaintsPlaylist
            tracks={saintsTracks}
            currentTrack={
              activeTrack.album === 'saints' ? activeTrack.index : -1
            }
            isPlaying={activeTrack.album === 'saints' && isPlaying}
            onTrackSelect={(i) => handleTrackSelect('saints', i)}
          />
        </div>
        <div className="player-panel p-8 space-y-8">
          <FirewallPlaylist
            tracks={firewallTracks}
            currentTrack={
              activeTrack.album === 'firewall' ? activeTrack.index : -1
            }
            isPlaying={activeTrack.album === 'firewall' && isPlaying}
            onTrackSelect={(i) => handleTrackSelect('firewall', i)}
          />
        </div>
        <AudioPlayer
          ref={audioRef}
          src={`/audio/${currentTrack.filename}`}
          autoPlayAfterSrcChange
          showJumpControls={false}
          showSkipControls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onListen={(e) => setCurrentTime(e.target.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
          onClickNext={handleNext}
          onClickPrevious={handlePrevious}
          onEnded={handleNext}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};
