import React, { useRef, useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import StatePopup from './StatePopup';
import { stateData } from '../data/stateData';

function Model({ isExploreMode, ...props }) {
  const { nodes, materials } = useGLTF("/india.glb");
  const [hoveredState, setHoveredState] = useState(null);
  const [clickedState, setClickedState] = useState(null);
  const groupRef = useRef();
  const meshRefs = useRef({});

  // Debug state names on mount
  useEffect(() => {
    const stateNames = Object.keys(nodes).filter(name => name.startsWith('model_'));
    console.log('Available state names:', stateNames);
  }, [nodes]);
  
  // Store original materials
  const originalMaterials = useRef({});
  Object.entries(nodes).forEach(([name, node]) => {
    if (name.startsWith('model_')) {
      originalMaterials.current[name] = materials[node.material?.name];
    }
  });

  // Default material for non-active states
  const defaultMaterial = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    metalness: 0.1,
    roughness: 0.8
  });

  // Animation frame for state elevation
  useFrame(() => {
    Object.entries(meshRefs.current).forEach(([name, mesh]) => {
      if (mesh) {
        const targetZ = (name === hoveredState || name === clickedState) ? 2 : 0;
        mesh.position.z = THREE.MathUtils.lerp(
          mesh.position.z,
          targetZ,
          0.1
        );
      }
    });
  });

  // Get state data with proper ID and validation
  const getStateData = (modelId) => {
    // Try different ID formats
    const possibleIds = [
      modelId,                                    // Original ID
      modelId.replace(/^model_0+/, 'model_'),    // Remove leading zeros
      `model_${modelId.split('_')[1].replace(/^0+/, '')}` // Remove all leading zeros after model_
    ];

    let stateInfo = null;
    for (const id of possibleIds) {
      if (stateData[id]) {
        stateInfo = stateData[id];
        break;
      }
    }

    if (!stateInfo) {
      console.warn(`No data found for state with ID: ${modelId} (tried: ${possibleIds.join(', ')})`);
      return null;
    }

    return {
      ...stateInfo,
      modelId: modelId // Keep original modelId for reference
    };
  };

  // Event Handlers
  const handlePointerEnter = (e, name) => {
    if (!isExploreMode) return;
    e.stopPropagation();
    setHoveredState(name);
    if (clickedState && name !== clickedState) {
      setClickedState(null);
    }
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = (e) => {
    if (!isExploreMode) return;
    e.stopPropagation();
    setHoveredState(null);
    document.body.style.cursor = 'default';
  };

  const handleClick = (e, name) => {
    if (!isExploreMode) return;
    e.stopPropagation();
    const stateInfo = getStateData(name);
    if (stateInfo) {
      setClickedState(name === clickedState ? null : name);
      console.log('Clicked state data:', stateInfo);
    } else {
      console.warn(`No data available for state: ${name}`);
    }
  };

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {Object.entries(nodes).map(([name, node]) => {
        if (!name.startsWith('model_')) return null;
        
        const isActive = isExploreMode && (hoveredState === name || clickedState === name);
        const stateInfo = getStateData(name);
        
        return (
          <group key={name}>
            <mesh
              name={name}
              ref={ref => meshRefs.current[name] = ref}
              castShadow
              receiveShadow
              geometry={node.geometry}
              material={isActive ? originalMaterials.current[name] : defaultMaterial}
              position={[node.position.x, node.position.y, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[0.113, 1, 0.113]}
              onPointerEnter={(e) => handlePointerEnter(e, name)}
              onPointerLeave={handlePointerLeave}
              onClick={(e) => handleClick(e, name)}
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
                position={[
                  node.position.x,
                  node.position.y + 10,
                  node.position.z + 10
                ]}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}

// Preload the 3D model
useGLTF.preload("/india.glb");

export default Model;