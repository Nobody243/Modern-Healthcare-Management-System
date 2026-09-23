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
  const [canRender, setCanRender] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const splineAppRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);

  // Zero React-rerender motion values for ultra-smooth 60fps 3D parallax tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 24, mass: 0.3 };
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), springConfig);

  // Strict viewport & non-zero dimension verification before WebGPU texture allocation
  useEffect(() => {
    if (!containerRef.current) return;

    const checkSize = () => {
      if (
        containerRef.current &&
        containerRef.current.offsetWidth >= 100 &&
        containerRef.current.offsetHeight >= 100
      ) {
        setCanRender(true);
      } else {
        setCanRender(false);
      }
    };

    checkSize();

    const resizeObserver = new ResizeObserver(() => {
      checkSize();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleLoad = useCallback((splineApp: any) => {
    splineAppRef.current = splineApp;
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });

    try {
      if (splineApp && splineApp._renderer) {
        splineApp._renderer.powerPreference = 'high-performance';
        if (typeof window !== 'undefined') {
          splineApp._renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        }
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

      // Update normalized motion values [-1, 1] for smooth GPU 3D perspective tilt
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(normX);
      mouseY.set(normY);

      // Forward pointer position to Spline canvas so the 3D robot tracks the cursor smoothly
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          const syntheticPointer = new PointerEvent('pointermove', {
            clientX: e.clientX,
            clientY: e.clientY,
            screenX: e.screenX,
            screenY: e.screenY,
            bubbles: true,
            cancelable: true,
            pointerId: 1,
            pointerType: 'mouse',
            isPrimary: true,
          });
          canvas.dispatchEvent(syntheticPointer);

          const syntheticMouse = new MouseEvent('mousemove', {
            clientX: e.clientX,
            clientY: e.clientY,
            screenX: e.screenX,
            screenY: e.screenY,
            bubbles: true,
            cancelable: true,
          });
          canvas.dispatchEvent(syntheticMouse);
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
      className="relative w-full h-[520px] min-h-[520px] flex items-center justify-center overflow-visible select-none isolate will-change-transform transform-gpu"
    >
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-0 select-none pointer-events-none">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/50 animate-pulse" />
          </div>
          <p className="text-[11px] font-mono font-medium text-primary/80 tracking-widest uppercase">
            Rendering 3D Scene...
          </p>
        </div>
      )}

      {/* Spline Canvas Container */}
      <div
        className={`w-full h-full min-h-[520px] transition-all duration-500 ease-out transform-gpu pointer-events-auto ${
          isLoaded
            ? 'opacity-100 scale-100 blur-0'
            : 'opacity-0 scale-95 blur-sm'
        }`}
      >
        {canRender && (
          <Suspense fallback={null}>
            <Spline
              scene={scene}
              className={`${className || ''} w-full h-full pointer-events-auto [touch-action:pan-y]`}
              onLoad={handleLoad}
            />
          </Suspense>
        )}
      </div>
    </motion.div>
  );
}
