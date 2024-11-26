import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const FloatingPlatform = () => {
  // Create a flat circular platform
  const geometry = new THREE.CylinderGeometry(60, 60, 0.5, 64);
  const material = new THREE.MeshPhongMaterial({
    color: '#e0e0e0',
    transparent: true,
    opacity: 0.6,
    shininess: 80,
    specular: new THREE.Color('#ffffff'),
    side: THREE.DoubleSide
  });

  return (
    <mesh 
      position={[0, -35, -2]} 
      rotation={[0, 0, 0]}
      receiveShadow
    >
      <primitive object={geometry} />
      <primitive object={material} />
      
      {/* Add a subtle glow effect */}
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#4fc3dc" />
    </mesh>
  );
};

const Base3D = ({ children, showControls = false }) => {
  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        camera={{
          position: [0, 0, 100],
          fov: 35,
          near: 1,
          far: 1000,
          zoom: 0.8,
        }}
        className="rounded-3xl"
      >
        {/* Environment Setup */}
        <color attach="background" args={["#f8fafc"]} />
        <fog attach="fog" args={['#f8fafc', 100, 400]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          color="#ffffff"
          castShadow
        />
        <directionalLight
          position={[-10, -10, -5]}
          intensity={0.4}
          color="#ffeedd"
        />
        
        {/* Floating Platform */}
        <FloatingPlatform />
        
        {/* 3D Model and other children */}
        <group position={[0, 0, 0]}>
          {children}
        </group>

        {/* Camera Controls */}
        {showControls && (
          <OrbitControls
            enableRotate={true}
            enablePan={false}
            minDistance={60}
            maxDistance={140}
            target={[0, 0, 0]}
            zoomSpeed={0.8}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
            minAzimuthAngle={-Math.PI / 6}
            maxAzimuthAngle={Math.PI / 6}
            enableDamping={true}
            dampingFactor={0.05}
          />
        )}
      </Canvas>
    </div>
  );
};

export default Base3D;
