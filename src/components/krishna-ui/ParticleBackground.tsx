'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';

// Particle field for divine atmosphere - optimized for performance
function ParticleField({ count = 300, intensity = 1 }: { count?: number; intensity?: number }) {
  const points = useRef<THREE.Points>(null!);
  const mousePosition = useRef({ x: 0, y: 0 });
  const { size } = useThree();
  
  // Track mouse position within the canvas
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // Normalize mouse position to be between -1 and 1
      mousePosition.current.x = (e.clientX / size.width) * 2 - 1;
      mousePosition.current.y = -((e.clientY / size.height) * 2 - 1);
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [size]);

  // Create particles with random positions and velocities - optimized count
  const [particlesData, particlesPosition] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const particleData = Array(count).fill(0).map(() => ({
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005
      ),
      initialPosition: new THREE.Vector3()
    }));
    
    for (let i = 0; i < count; i++) {
      // Create a sphere of particles
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = Math.random() * 2 + 0.5;
      
      const x = Math.sin(phi) * Math.cos(theta) * radius;
      const y = Math.sin(phi) * Math.sin(theta) * radius;
      const z = Math.cos(phi) * radius;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      particleData[i].initialPosition.set(x, y, z);
    }
    
    return [particleData, positions];
  }, [count]);
  
  // Animate the particles with cursor interaction - optimized for performance
  useFrame((state) => {
    const { clock } = state;
    if (points.current) {
      // Base rotation for ambient movement - slowed down for smoother motion
      points.current.rotation.x = Math.sin(clock.getElapsedTime() / 15) * 0.1; // Reduced amplitude and frequency
      points.current.rotation.y = Math.cos(clock.getElapsedTime() / 12) * 0.05; // Reduced amplitude and frequency
      
      // Cursor-based movement - reduced influence
      const cursorInfluence = 0.08; // Reduced cursor influence for smoother feel
      points.current.rotation.x += mousePosition.current.y * cursorInfluence;
      points.current.rotation.y += mousePosition.current.x * cursorInfluence;
      
      // Create depth movement to enhance 3D feeling - optimized for performance
      const positions = points.current.geometry.attributes.position.array as Float32Array;
      
      // Update only a portion of particles each frame for better performance
      const updateCount = Math.min(count, 60); // Limit updates per frame
      const startIdx = Math.floor(clock.getElapsedTime() * 30) % (count - updateCount);
      
      for (let i = startIdx; i < startIdx + updateCount; i++) {
        const i3 = i * 3;
        
        const x = positions[i3];
        const y = positions[i3 + 1];
        
        // Apply cursor-influenced movement with reduced calculation
        const distanceFromCursor = Math.sqrt(
          Math.pow(x - mousePosition.current.x, 2) + 
          Math.pow(y - mousePosition.current.y, 2)
        ) * 0.5; // Scaled for better performance
        
        const time = clock.getElapsedTime() * 0.5; // Slowed down time factor
        const offset = i * 0.005; // Reduced offset increment
        
        // Apply more subtle wave movement
        const dynamicOffset = Math.sin(time + offset) * 0.007; // Reduced amplitude
        const mouseEffect = Math.max(0, (1 - Math.min(distanceFromCursor, 1))) * 0.03; // Reduced effect
        
        // Apply smoother, less dramatic individual particle movement
        positions[i3] = particlesData[i].initialPosition.x + 
                        dynamicOffset + 
                        mousePosition.current.x * mouseEffect;
                        
        positions[i3 + 1] = particlesData[i].initialPosition.y + 
                            dynamicOffset + 
                            mousePosition.current.y * mouseEffect;
                            
        positions[i3 + 2] = particlesData[i].initialPosition.z + 
                            Math.sin(time * 0.3 + offset * 3) * 0.03; // Reduced amplitude and frequency
      }
      
      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <group>
      <Points ref={points} positions={particlesPosition} stride={3}>
        <PointMaterial 
          transparent
          color="#FFD700" 
          size={0.02} 
          sizeAttenuation={true} 
          depthWrite={false} 
          opacity={0.3 * intensity}
        />
      </Points>
    </group>
  );
}

interface ParticleBackgroundProps {
  intensity?: number;
  className?: string;
}

export default function ParticleBackground({ intensity = 1, className }: ParticleBackgroundProps) {
  return (
    <div className={`fixed inset-0 z-0 ${className}`}>
      <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <ParticleField count={300} intensity={intensity} />
      </Canvas>
    </div>
  );
}