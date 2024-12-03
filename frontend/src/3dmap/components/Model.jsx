import React, { useRef, useState, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import StatePopup from './StatePopup';
import { useStateData } from '../context/StateDataContext';

function Model({ isExploreMode, ...props }) {
  const { nodes, materials } = useGLTF("/india.glb");
  const [hoveredState, setHoveredState] = useState(null);
  const [clickedState, setClickedState] = useState(null);
  const groupRef = useRef();
  const meshRefs = useRef({});
  const { stateData, isLoading } = useStateData();

  // Memoize original materials
  const originalMaterials = useMemo(() => {
    const materials = {};
    Object.entries(nodes).forEach(([name, node]) => {
      if (name.startsWith('model_')) {
        materials[name] = node.material;
      }
    });
    return materials;
  }, [nodes]);

  // Optimize animation frame
  useFrame(() => {
    if (!isExploreMode) return;
    
    Object.entries(meshRefs.current).forEach(([name, mesh]) => {
      if (mesh && (name === hoveredState || name === clickedState)) {
        mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, 2, 0.1);
      } else if (mesh && mesh.position.z !== 0) {
        mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, 0, 0.1);
      }
    });
  });

  // Memoize state geometries
  const stateGeometries = useMemo(() => {
    return Object.entries(nodes)
      .filter(([name]) => name.startsWith('model_'))
      .map(([name, node]) => ({
        name,
        geometry: node.geometry,
        position: node.position,
      }));
  }, [nodes]);

  // If data is not loaded yet, render a simple mesh
  if (!stateData || isLoading) {
    return (
      <group ref={groupRef} {...props}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#cccccc" />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {stateGeometries.map(({ name, geometry, position }) => {
        const isActive = isExploreMode && (hoveredState === name || clickedState === name);
        const stateInfo = stateData[name];
        
        return (
          <group key={name}>
            <mesh
              name={name}
              ref={ref => meshRefs.current[name] = ref}
              castShadow
              receiveShadow
              geometry={geometry}
              material={originalMaterials[name]}
              position={[position.x, position.y, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[0.113, 1, 0.113]}
              onPointerEnter={(e) => {
                if (!isExploreMode) return;
                e.stopPropagation();
                setHoveredState(name);
                document.body.style.cursor = 'pointer';
              }}
              onPointerLeave={(e) => {
                setHoveredState(null);
                document.body.style.cursor = 'default';
              }}
              onClick={(e) => {
                if (!isExploreMode) return;
                e.stopPropagation();
                setClickedState(name === clickedState ? null : name);
              }}
            />
            {isExploreMode && (hoveredState === name || clickedState === name) && stateInfo && (
              <StatePopup 
                stateName={name}
                visible={true}
                isClicked={clickedState === name}
                data={{
                  ...stateInfo,
                  modelId: name
                }}
                position={[position.x, position.y + 10, position.z + 10]}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}

// Preload and cache the 3D model
useGLTF.preload("/india.glb");

export default React.memo(Model);