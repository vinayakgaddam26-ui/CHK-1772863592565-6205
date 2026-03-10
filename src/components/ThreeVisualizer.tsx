'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';

function DataCore({ totalEmissions }: { totalEmissions: number }) {
  const meshRef = useRef<any>(null);
  
  // High emissions = faster pulsing, more distortion
  const intensity = Math.min(Math.max((totalEmissions - 800) / 1000, 0.2), 1.0);
  const color = intensity > 0.6 ? "#FF2A5F" : "#00E5FF";

  useFrame((state) => {
    if(meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5 + (intensity * 0.5)}>
        <MeshDistortMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={1.5}
          distort={0.4 + (intensity * 0.4)} 
          speed={2 + (intensity * 3)} 
          roughness={0.2}
          wireframe={true}
        />
      </Sphere>
      <pointLight color={color} intensity={5} distance={10} />
    </Float>
  );
}

export default function ThreeVisualizer({ data }: { data: any[] }) {
  const total = data.reduce((acc, curr) => acc + curr.totalEmissions, 0);

  return (
    <div className="w-full h-full absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <DataCore totalEmissions={total} />
      </Canvas>
    </div>
  );
}
