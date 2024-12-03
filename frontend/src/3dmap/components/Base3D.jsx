import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const FloatingPlatform = React.memo(() => {
  const geometry = useMemo(() => new THREE.CylinderGeometry(60, 60, 0.5, 64), []);
  const material = useMemo(() => new THREE.MeshPhongMaterial({
    color: '#e0e0e0',
    transparent: true,
    opacity: 0.6,
    shininess: 80,
    specular: new THREE.Color('#ffffff'),
    side: THREE.DoubleSide
  }), []);

  return (
    <mesh position={[0, -35, -2]} rotation={[0, 0, 0]} receiveShadow>
      <primitive object={geometry} />
      <primitive object={material} />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#4fc3dc" />
    </mesh>
  );
});

const Base3D = React.memo(({ children, showControls = false }) => {
  const cameraSettings = useMemo(() => ({
    position: [0, 0, 100],
    fov: 35,
    near: 1,
    far: 1000,
    zoom: 0.8,
  }), []);

  const controlsSettings = useMemo(() => ({
    enableRotate: true,
    enablePan: false,
    minDistance: 60,
    maxDistance: 140,
    target: [0, 0, 0],
    zoomSpeed: 0.8,
    minPolarAngle: Math.PI / 3,
    maxPolarAngle: Math.PI / 2,
    minAzimuthAngle: -Math.PI / 6,
    maxAzimuthAngle: Math.PI / 6,
    enableDamping: true,
    dampingFactor: 0.05
  }), []);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={cameraSettings}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={["#f8fafc"]} />
        <fog attach="fog" args={['#f8fafc', 100, 400]} />
        
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight
          position={[-10, -10, -5]}
          intensity={0.4}
          color="#ffeedd"
        />
        
        <FloatingPlatform />
        
        <group position={[0, 0, 0]}>
          {children}
        </group>

        {showControls && <OrbitControls {...controlsSettings} />}
      </Canvas>
    </div>
  );
});

export default Base3D;