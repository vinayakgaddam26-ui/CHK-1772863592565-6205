'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial, OrbitControls, Environment, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Data shapes
interface EmissionData {
  trafficLevel: number; // 0-100 indicating congestion
  infrastructureScore: number; // 0-100 indicating AQI/pollution
}

// Inner animated mesh component
function EmissionSpheres({ data }: { data: EmissionData }) {
  const trafficRef = useRef<THREE.Mesh>(null);
  const infraRef = useRef<THREE.Mesh>(null);
  
  // Normalize sizes (minimum size 1)
  const trafficSize = Math.max(1, (data.trafficLevel / 100) * 3);
  const infraSize = Math.max(1, (data.infrastructureScore / 100) * 3);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (trafficRef.current) {
      trafficRef.current.rotation.x = time * 0.2;
      trafficRef.current.rotation.y = time * 0.3;
    }
    if (infraRef.current) {
      infraRef.current.rotation.x = time * -0.1;
      infraRef.current.rotation.y = time * -0.2;
    }
  });

  return (
    <group>
      {/* Traffic Sphere - Red/Alert colored */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={[-2, 0, 0]}>
        <Sphere ref={trafficRef} args={[trafficSize, 64, 64]}>
          <MeshDistortMaterial 
            color="#FF2A5F" 
            emissive="#FF2A5F" 
            emissiveIntensity={0.5} 
            envMapIntensity={1}
            distort={data.trafficLevel > 50 ? 0.4 : 0.2} 
            speed={data.trafficLevel > 50 ? 4 : 2} 
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
        <Text position={[0, -trafficSize - 0.5, 0]} fontSize={0.4} color="#ffffff" anchorX="center" anchorY="middle">
          Traffic: {Math.round(data.trafficLevel)}
        </Text>
      </Float>

      {/* Infrastructure Sphere - Green/Success colored or Yellow based on severity */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1} position={[2, 0, 0]}>
        <Sphere ref={infraRef} args={[infraSize, 64, 64]}>
          <MeshDistortMaterial 
            color={data.infrastructureScore > 70 ? "#00E5FF" : (data.infrastructureScore > 40 ? "#FFD600" : "#00E676")} 
            emissive={data.infrastructureScore > 70 ? "#00E5FF" : (data.infrastructureScore > 40 ? "#FFD600" : "#00E676")} 
            emissiveIntensity={0.5} 
            envMapIntensity={1}
            distort={0.3} 
            speed={3} 
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
        <Text position={[0, -infraSize - 0.5, 0]} fontSize={0.4} color="#ffffff" anchorX="center" anchorY="middle">
          Infra AQI: {Math.round(data.infrastructureScore)}
        </Text>
      </Float>
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
        
        <EmissionSpheres data={data} />
        
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
