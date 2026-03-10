'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial, OrbitControls, Environment, Box } from '@react-three/drei';
import * as THREE from 'three';

// Data shapes
interface EmissionData {
  trafficLevel: number; // 0-100 indicating congestion
  infrastructureScore: number; // 0-100 indicating AQI/pollution
}

// Inner animated mesh component
function EmissionBars({ data }: { data: EmissionData }) {
  const trafficRef = useRef<THREE.Mesh>(null);
  const infraRef = useRef<THREE.Mesh>(null);
  
  // Normalize sizes for the bar heights (Y-axis scale)
  const trafficHeight = Math.max(0.5, (data.trafficLevel / 100) * 5);
  const infraHeight = Math.max(0.5, (data.infrastructureScore / 100) * 5);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Create a smooth floating/pulsing effect by modifying the Y position
    if (trafficRef.current) {
        trafficRef.current.position.y = Math.sin(time * 2) * 0.1 + (trafficHeight / 2);
    }
    if (infraRef.current) {
        infraRef.current.position.y = Math.sin(time * 2 + Math.PI) * 0.1 + (infraHeight / 2);
    }
  });

  return (
    <group position={[0, -2, 0]}>
      {/* Traffic Bar - Red/Alert colored */}
      <group position={[-2, 0, 0]}>
        <Box ref={trafficRef} args={[1, trafficHeight, 1]}>
          <MeshDistortMaterial 
            color="#FF0000" 
            emissive="#FF0000" 
            emissiveIntensity={0.6} 
            envMapIntensity={1}
            distort={0.15} 
            speed={2} 
            roughness={0.2}
            metalness={0.8}
            wireframe={false}
          />
        </Box>
        {/* Base shadow anchor */}
        <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
           <planeGeometry args={[1.5, 1.5]} />
           <meshBasicMaterial color="#FF0000" transparent opacity={0.2} />
        </mesh>
        <Text position={[0, -0.5, 0]} fontSize={0.35} color="#ffffff" anchorX="center" anchorY="middle">
          Traffic: {Math.round(data.trafficLevel)}
        </Text>
      </group>

      {/* Infrastructure Bar - Purple/Warn/Success colored depending on scale */}
      <group position={[2, 0, 0]}>
        <Box ref={infraRef} args={[1, infraHeight, 1]}>
          <MeshDistortMaterial 
            color={data.infrastructureScore > 60 ? "#FF0000" : (data.infrastructureScore > 30 ? "#FFD700" : "#7B3FE4")} 
            emissive={data.infrastructureScore > 60 ? "#FF0000" : (data.infrastructureScore > 30 ? "#FFD700" : "#7B3FE4")} 
            emissiveIntensity={0.6} 
            envMapIntensity={1}
            distort={0.15} 
            speed={2} 
            roughness={0.2}
            metalness={0.8}
          />
        </Box>
        <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
           <planeGeometry args={[1.5, 1.5]} />
           <meshBasicMaterial color={data.infrastructureScore > 60 ? "#FF0000" : (data.infrastructureScore > 30 ? "#FFD700" : "#7B3FE4")} transparent opacity={0.2} />
        </mesh>
        <Text position={[0, -0.5, 0]} fontSize={0.35} color="#ffffff" anchorX="center" anchorY="middle">
          Infra AQI: {Math.round(data.infrastructureScore)}
        </Text>
      </group>
    </group>
  );
}

export default function CityEmission3DChart({ data }: { data: EmissionData }) {
  return (
    <div className="w-full h-full min-h-[400px] relative rounded-2xl overflow-hidden glass-panel border border-[#ffffff10] bg-carbon-900/40">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00E5FF" />
        
        <Environment preset="city" />
        
        <EmissionBars data={data} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      
      {/* Overlay UI elements for context */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <h3 className="text-white font-bold text-lg tracking-wide">Emission Source Comparison</h3>
        <p className="text-white/60 text-sm">Interactive 3D representation based on real-time TomTom & OpenAQ telemetry</p>
      </div>
    </div>
  );
}
