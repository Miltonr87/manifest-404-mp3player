import { useState, useRef, useEffect } from "react";
import { PlayerControls } from "./PlayerControls";
import { Equalizer } from "./Equalizer";
import { Playlist } from "./Playlist";
import { VolumeControl } from "./VolumeControl";
import { ProgressBar } from "./ProgressBar";
import { DisplayPanel } from "./DisplayPanel";

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  filename: string;
}

const tracks: Track[] = [
  {
    id: 1,
    title: "Algorithmic Tyranny",
    artist: "Manifest 404",
    duration: 0,
    filename: "1_Algorithmic_Tyranny.mp3"
  },
  {
    id: 2,
    title: "Code Revolution",
    artist: "Manifest 404", 
    duration: 0,
    filename: "2_Code_Revolution.mp3"
  }
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
  const [equalizerData, setEqualizerData] = useState<number[]>(new Array(10).fill(0));

  // Initialize Web Audio API
  const initializeAudioContext = async () => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
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

  // Analyze audio frequencies
  const analyzeAudio = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Map frequency data to 10 equalizer bands
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
      const normalized = average / 255; // Normalize to 0-1
      newEqualizerData.push(normalized);
    }

    setEqualizerData(newEqualizerData);

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    }
  };

  // Start/stop audio analysis
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
      // Gradually fade out the equalizer when stopped
      if (!isPlaying) {
        const fadeOut = () => {
          setEqualizerData(prev => prev.map(val => val * 0.9));
        };
        const fadeInterval = setInterval(() => {
          setEqualizerData(prev => {
            const newData = prev.map(val => val * 0.85);
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

  // Update track durations when metadata loads
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

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Initialize audio context on first play (required for Chrome)
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
    
    // Auto-play the next track if currently playing
    if (isPlaying) {
      const playNextTrack = async () => {
        if (audioRef.current) {
          try {
            await audioRef.current.play();
          } catch (error) {
            console.error('Error playing next track:', error);
          }
        }
      };
      // Small delay to ensure audio source is updated
      setTimeout(playNextTrack, 200);
    }
  };

  const handlePrevious = () => {
    const prevTrack = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    setCurrentTrack(prevTrack);
    setCurrentTime(0);
    
    // Auto-play the previous track if currently playing
    if (isPlaying) {
      const playPrevTrack = async () => {
        if (audioRef.current) {
          try {
            await audioRef.current.play();
          } catch (error) {
            console.error('Error playing previous track:', error);
          }
        }
      };
      // Small delay to ensure audio source is updated
      setTimeout(playPrevTrack, 200);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTrackSelect = (trackIndex: number) => {
    const wasPlaying = isPlaying;
    setCurrentTrack(trackIndex);
    setCurrentTime(0);
    
    // Auto-play the selected track if currently playing
    if (wasPlaying) {
      const playSelectedTrack = async () => {
        if (audioRef.current) {
          try {
            await audioRef.current.play();
          } catch (error) {
            console.error('Error playing selected track:', error);
          }
        }
      };
      // Small delay to ensure audio source is updated
      setTimeout(playSelectedTrack, 200);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pt-20 pb-8 px-4 md:px-8 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Player */}
        <div className="player-panel p-6 space-y-6">
          {/* Display Panel */}
          <DisplayPanel 
            track={tracks[currentTrack]}
            currentTime={formatTime(currentTime)}
            duration={formatTime(duration)}
            isPlaying={isPlaying}
          />

          {/* Progress Bar */}
          <ProgressBar 
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-6">
            <PlayerControls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onStop={handleStop}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />

            <VolumeControl 
              volume={volume}
              onVolumeChange={setVolume}
            />
          </div>
        </div>

        {/* Equalizer */}
        <div className="player-panel p-6">
          <Equalizer data={equalizerData} isActive={isPlaying} />
        </div>

        {/* Playlist */}
        <div className="player-panel p-6">
          <Playlist 
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTrackSelect={handleTrackSelect}
          />
        </div>

        {/* Hidden Audio Element */}
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