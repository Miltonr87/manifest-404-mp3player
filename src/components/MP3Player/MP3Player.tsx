import { useState, useRef, useEffect } from 'react';
import { PlayerControls } from './PlayerControls';
import { Equalizer } from './Equalizer';
import { Playlist } from './Playlist';
import { VolumeControl } from './VolumeControl';
import { ProgressBar } from './ProgressBar';
import { DisplayPanel } from './DisplayPanel';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  filename: string;
  bonus?: boolean;
}

const tracks: Track[] = [
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
  {
    id: 6,
    title: 'Silicon Saints',
    artist: 'Bonus Track',
    duration: 0,
    filename: 'Silicon Saints.mp3',
    bonus: true,
  },
];

export const MP3Player = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [equalizerData, setEqualizerData] = useState<number[]>(
    new Array(10).fill(0)
  );

  // Initialize Web Audio API
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
      sourceRef.current = source;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
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
      const end = start + bandSize;
      let sum = 0;

      for (let j = start; j < end; j++) {
        sum += dataArray[j];
      }

      const average = sum / bandSize;
      const normalized = average / 255;
      newEqualizerData.push(normalized);
    }

    setEqualizerData(newEqualizerData);

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    }
  };

  useEffect(() => {
    if (isPlaying && analyserRef.current) {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      analyzeAudio();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (!isPlaying) {
        const fadeInterval = setInterval(() => {
          setEqualizerData((prev) => {
            const newData = prev.map((val) => val * 0.85);
            if (Math.max(...newData) < 0.01) {
              clearInterval(fadeInterval);
              return new Array(10).fill(0);
            }
            return newData;
          });
        }, 50);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      tracks[currentTrack].duration = audio.duration;
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      handleNext();
    };

    const handleCanPlay = () => {
      if (!audioContextRef.current) {
        initializeAudioContext();
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((err) => console.error('Error autoplaying track:', err));
      }
    }
  }, [currentTrack, isPlaying]);

  const handlePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        if (!audioContextRef.current) {
          await initializeAudioContext();
        }
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleNext = () => {
    const nextTrack = (currentTrack + 1) % tracks.length;
    setCurrentTrack(nextTrack);
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    const prevTrack = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    setCurrentTrack(prevTrack);
    setCurrentTime(0);
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTrackSelect = (trackIndex: number) => {
    setCurrentTrack(trackIndex);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="pt-20 pb-8 px-4 md:px-8 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="player-panel p-6 space-y-6">
          <DisplayPanel
            track={tracks[currentTrack]}
            currentTime={formatTime(currentTime)}
            duration={formatTime(duration)}
            isPlaying={isPlaying}
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
        <div className="player-panel p-6">
          <Equalizer data={equalizerData} isActive={isPlaying} />
        </div>
        <div className="player-panel p-6">
          <Playlist
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTrackSelect={handleTrackSelect}
          />
        </div>
        <audio
          ref={audioRef}
          src={`/audio/${tracks[currentTrack].filename}`}
          preload="metadata"
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
};
