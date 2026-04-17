/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Activity, Radio, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 selection:bg-neon-pink selection:text-black">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-blue/20 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      </div>

      {/* Navigation / Header */}
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <div className="flex items-center gap-2">
           <Cpu className="text-neon-pink w-6 h-6" />
           <span className="font-mono text-sm tracking-[0.3em] font-bold">NEON_PULSE v1.0</span>
        </div>
        <div className="flex gap-8 items-center">
          <div className="hidden sm:flex items-center gap-2">
             <Activity className="w-4 h-4 text-neon-green" />
             <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">System Nominal</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
             <Radio className="w-4 h-4 text-neon-blue animate-pulse" />
             <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">Audio Uplink</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side - Music Context & Controls (Hidden/Moved on Mobile) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-4 flex flex-col gap-6"
        >
          <div className="p-8 bg-zinc-900/40 rounded-3xl border border-zinc-800/50 backdrop-blur-md">
            <h1 className="text-5xl font-bold tracking-tighter mb-4 leading-none">
              VIBE <br /> 
              <span className="text-neon-pink neon-text-pink">HARDER</span>
            </h1>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
              Navigate the grid. <br />
              Absorb the data. <br />
              Never stop pulse.
            </p>
          </div>
          <MusicPlayer />
          
          <div className="mt-4 flex flex-col gap-4">
             <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600 uppercase tracking-widest px-4">
                <span>Network Latency</span>
                <span>0.12ms</span>
             </div>
             <div className="h-[1px] w-full bg-zinc-800" />
             <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600 uppercase tracking-widest px-4">
                <span>Secure Sync</span>
                <span className="text-neon-green">Encrypted</span>
             </div>
          </div>
        </motion.div>

        {/* Center - Snake Game */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-8 flex justify-center w-full"
        >
          <SnakeGame />
        </motion.div>
      </main>

      {/* Footer Info */}
      <footer className="fixed bottom-0 left-0 w-full p-6 flex justify-center z-50">
        <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-zinc-600">
           &copy; 2026 SYNTH_SYNDICATE // ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
}

