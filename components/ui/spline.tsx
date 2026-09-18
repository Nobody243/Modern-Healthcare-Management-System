'use client';

import React, { Suspense, lazy, useState, useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const splineAppRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);

  // Zero React-rerender motion values for ultra-smooth 60fps 3D parallax tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 24, mass: 0.3 };
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), springConfig);

  const handleLoad = useCallback((splineApp: any) => {
    splineAppRef.current = splineApp;
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });

    try {
      if (splineApp._renderer) {
        splineApp._renderer.powerPreference = 'high-performance';
        splineApp._renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      }
    } catch {
      // Ignore private renderer access
    }
  }, []);

  // Window pointer tracking with rAF throttling (Directly updates MotionValues, 0 React re-renders)
  useEffect(() => {
    let pendingEvent: MouseEvent | null = null;

    const processPointer = () => {
      if (!pendingEvent) {
        rafRef.current = null;
        return;
      }

      const e = pendingEvent;
      pendingEvent = null;

      // Update normalized motion values [-1, 1] without re-rendering React component
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(normX);
      mouseY.set(normY);

      // Forward event to Spline canvas if pointer is outside canvas bounds
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const isDirectlyOver =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

          if (!isDirectlyOver) {
            const syntheticPointer = new PointerEvent('pointermove', {
              clientX: e.clientX,
              clientY: e.clientY,
              screenX: e.screenX,
              screenY: e.screenY,
              bubbles: false,
              cancelable: true,
              pointerId: 1,
              pointerType: 'mouse',
              isPrimary: true,
            });
            canvas.dispatchEvent(syntheticPointer);
          }
        }
      }

      rafRef.current = null;
    };

    const handlePointerMove = (e: MouseEvent) => {
      pendingEvent = e;
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(processPointer);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={containerRef}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1200,
      }}
      className="relative w-full h-full flex items-center justify-center overflow-visible select-none isolate will-change-transform transform-gpu"
    >
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 z-0 select-none pointer-events-none">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] animate-pulse" />
          </div>
          <p className="text-xs font-mono font-medium text-cyan-300/80 tracking-widest uppercase">
            Rendering 3D Interface...
          </p>
        </div>
      )}

      {/* Spline Canvas - pointer-events-none allows native mouse-wheel scrolling without scroll trapping while window pointer tracker handles 3D tracking */}
      <div
        className={`w-full h-full transition-all duration-500 ease-out transform-gpu pointer-events-none ${
          isLoaded
            ? 'opacity-100 scale-100 blur-0'
            : 'opacity-0 scale-95 blur-sm'
        }`}
      >
        <Suspense fallback={null}>
          <Spline
            scene={scene}
            className={`${className || ''} w-full h-full pointer-events-none [touch-action:pan-y]`}
            onLoad={handleLoad}
          />
        </Suspense>
      </div>
    </motion.div>
  );
}
