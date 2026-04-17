import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RefreshCcw, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const TILE_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 10 });
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(false);
    setSpeed(INITIAL_SPEED);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        setDirection(prev => prev.y === 1 ? prev : { x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        setDirection(prev => prev.y === -1 ? prev : { x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        setDirection(prev => prev.x === 1 ? prev : { x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        setDirection(prev => prev.x === -1 ? prev : { x: 1, y: 0 });
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const update = useCallback((time: number) => {
    if (!isPlaying || isGameOver) return;

    if (time - lastUpdateRef.current < speed) {
      gameLoopRef.current = requestAnimationFrame(update);
      return;
    }
    lastUpdateRef.current = time;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      // Collision check
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        setIsPlaying(false);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food check
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(50, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });

    gameLoopRef.current = requestAnimationFrame(update);
  }, [isPlaying, isGameOver, direction, food, speed, score, highScore, generateFood]);

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameLoopRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, isGameOver, update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#09090b'; // zinc-950
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#27272a'; // zinc-800
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * TILE_SIZE, 0);
      ctx.lineTo(i * TILE_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * TILE_SIZE);
      ctx.lineTo(canvas.width, i * TILE_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#39ff14' : '#22c55e'; // neon green or green-500
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = '#39ff14';
      
      // Rounded snake segments
      const x = segment.x * TILE_SIZE + 2;
      const y = segment.y * TILE_SIZE + 2;
      const size = TILE_SIZE - 4;
      const radius = isHead ? 6 : 4;
      
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, radius);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw food
    ctx.fillStyle = '#ff00ff'; // neon pink
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * TILE_SIZE + TILE_SIZE / 2,
      food.y * TILE_SIZE + TILE_SIZE / 2,
      TILE_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-zinc-900/50 rounded-3xl border border-zinc-800 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-green opacity-50" />
      
      <div className="flex justify-between w-full items-center mb-2 px-2">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Current Score</span>
          <span className="text-4xl font-mono font-bold text-neon-green neon-text-green">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Best Session</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-orange-400" />
            <span className="text-2xl font-mono font-bold text-zinc-300">{highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * TILE_SIZE}
          height={GRID_SIZE * TILE_SIZE}
          className="rounded-lg border-2 border-zinc-800 bg-zinc-950 neon-border-blue transition-all duration-500"
        />

        <AnimatePresence>
          {(!isPlaying || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg sm:p-0 p-4"
            >
              {isGameOver ? (
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold text-neon-pink neon-text-pink mb-2">GAME OVER</h2>
                  <p className="text-zinc-400 font-mono uppercase tracking-tighter">Your snake hit a wall or itself.</p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-neon-pink text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-transform"
                  >
                    <RefreshCcw className="w-5 h-5" /> REBOOT SYSTEM
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="bg-neon-blue/10 p-4 rounded-2xl border border-neon-blue/20">
                    <p className="text-neon-blue font-mono text-sm leading-relaxed max-w-xs">
                      USE [WASD] OR [ARROW KEYS]<br />
                      TO CONTROL THE NEON PULSE.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="flex items-center gap-2 px-8 py-4 bg-neon-blue text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-transform neon-border-blue"
                  >
                    <Play className="w-6 h-6 fill-current" /> INITIALIZE
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 w-full justify-center">
        {isPlaying && !isGameOver && (
          <button
            onClick={() => setIsPlaying(false)}
            className="p-3 bg-zinc-800 text-zinc-300 rounded-full hover:bg-zinc-700 transition-colors"
          >
            <Pause className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
