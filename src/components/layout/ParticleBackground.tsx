
"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  width: string;
  height: string;
  left: string;
  top: string;
  duration: string;
  opacity: number;
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = [...Array(20)].map((_, i) => ({
      id: i,
      width: Math.random() * 4 + 'px',
      height: Math.random() * 4 + 'px',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      duration: `${Math.random() * 10 + 10}s`,
      opacity: Math.random() * 0.5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="particle-bg">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.width,
            height: p.height,
            left: p.left,
            top: p.top,
            animation: `float ${p.duration} linear infinite`,
            opacity: p.opacity
          }}
        />
      ))}
    </div>
  );
}
