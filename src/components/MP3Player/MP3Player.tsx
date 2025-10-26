import { useState, useRef, useEffect, useCallback } from 'react';
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
    filename: '5_Silicon_Saints.mp3',
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
  const audioRef = useRef<HTMLAudioElement>(null);
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const newSrc = `/audio/${currentTrack.filename}`;
    if (audio.src.endsWith(currentTrack.filename)) return;

    audio.src = newSrc;
    audio.load();
    setCurrentTime(0);

    const handleCanPlayThrough = async () => {
      if (isPlaying) {
        try {
          await initializeAudioContext();
          if (audioContextRef.current?.state === 'suspended')
            await audioContextRef.current.resume();
          await audio.play();
        } catch (err: any) {
          if (err.name !== 'AbortError') console.error('Playback error:', err);
        }
      }
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    return () =>
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
  }, [activeTrack]);

  const initializeAudioContext = async () => {
    if (!audioRef.current || audioContextRef.current) return;
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
    } catch (err) {
      console.error('Failed to initialize audio context:', err);
    }
  };

  const analyzeAudio = () => {
    if (!analyserRef.current) return;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    const bands = 10;
    const bandSize = Math.floor(bufferLength / bands);
    const newEqualizerData: number[] = [];

    for (let i = 0; i < bands; i++) {
      const start = i * bandSize;
      const avg =
        dataArray.slice(start, start + bandSize).reduce((a, b) => a + b, 0) /
        bandSize;
      newEqualizerData.push(avg / 255);
    }

    setEqualizerData(newEqualizerData);
    if (isPlaying)
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  useEffect(() => {
    if (isPlaying && analyserRef.current) {
      if (audioContextRef.current?.state === 'suspended')
        audioContextRef.current.resume();
      analyzeAudio();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isPlaying]);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const dur = audio.duration;
    setDuration(dur);

    if (activeTrack.album === 'firewall') {
      setFirewallTracks((prev) =>
        prev.map((t, i) =>
          i === activeTrack.index ? { ...t, duration: dur } : t
        )
      );
    } else {
      setSaintsTracks((prev) =>
        prev.map((t, i) =>
          i === activeTrack.index ? { ...t, duration: dur } : t
        )
      );
    }
  }, [activeTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => handleNext();

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [handleLoadedMetadata, activeTrack]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handlePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await initializeAudioContext();
      if (audioContextRef.current?.state === 'suspended')
        await audioContextRef.current.resume();
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err: any) {
        if (err.name !== 'AbortError') console.error('Playback error:', err);
      }
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleNext = () => {
    const playlist = getTracks();
    setActiveTrack((prev) => ({
      album: prev.album,
      index: (prev.index + 1) % playlist.length,
    }));
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    const playlist = getTracks();
    setActiveTrack((prev) => ({
      album: prev.album,
      index: prev.index === 0 ? playlist.length - 1 : prev.index - 1,
    }));
    setCurrentTime(0);
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTrackSelect = async (
    album: 'firewall' | 'saints',
    index: number
  ) => {
    handleStop();
    const selectedTracks = album === 'firewall' ? firewallTracks : saintsTracks;
    const selectedTrack = selectedTracks[index];
    if (!selectedTrack) return;

    setActiveTrack({ album, index });

    setTimeout(async () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.src = `/audio/${selectedTrack.filename}`;
      audio.load();
      audio.addEventListener(
        'loadedmetadata',
        () => setDuration(audio.duration),
        { once: true }
      );
      await initializeAudioContext();
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Playback error:', err);
        setIsPlaying(false);
      }
    }, 150);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs
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
        <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />
      </div>
    </div>
  );
};
