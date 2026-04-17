import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Cyber City Drift",
    artist: "SynthAI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "var(--color-neon-pink)"
  },
  {
    id: 2,
    title: "Neon Horizon",
    artist: "WavePulse",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "var(--color-neon-blue)"
  },
  {
    id: 3,
    title: "Digital Ghost",
    artist: "GlitchCore",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "var(--color-neon-green)"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback blocked:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      const newTime = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-sm bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-800 p-6 flex flex-col gap-6 relative shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-full h-full rounded-full border-2 border-zinc-700 flex items-center justify-center bg-zinc-800"
            style={{ borderColor: currentTrack.color }}
          >
            <Disc className="w-8 h-8 text-zinc-400" />
          </motion.div>
          {isPlaying && (
             <motion.div 
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ duration: 1, repeat: Infinity }}
               className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon-green shadow-lg shadow-neon-green/50"
             />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate font-sans tracking-tight">{currentTrack.title}</h3>
          <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">{currentTrack.artist}</p>
        </div>
        <Music2 className="text-zinc-700 w-5 h-5" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-neon-blue"
          style={{
            background: `linear-gradient(to right, ${currentTrack.color} ${progress}%, #27272a ${progress}%)`
          }}
        />
      </div>

      <div className="flex items-center justify-between px-4">
        <button onClick={skipBack} className="text-zinc-500 hover:text-white transition-colors">
          <SkipBack className="w-6 h-6 fill-current" />
        </button>
        
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </button>

        <button onClick={skipForward} className="text-zinc-500 hover:text-white transition-colors">
          <SkipForward className="w-6 h-6 fill-current" />
        </button>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Volume2 className="w-4 h-4 text-zinc-500" />
        <div className="flex-1 h-3 bg-zinc-800/50 rounded-full border border-zinc-700 p-[2px] overflow-hidden">
           <motion.div 
             className="h-full bg-zinc-600 rounded-full"
             initial={{ width: "70%" }}
           />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={skipForward}
      />
      
      <div className="mt-4 border-t border-zinc-800 pt-4">
         <p className="text-[10px] text-zinc-600 font-mono text-center uppercase tracking-[0.2em]">
           Operational // Pulse Grid v2.0
         </p>
      </div>
    </div>
  );
}
