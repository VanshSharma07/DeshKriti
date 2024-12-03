import { Text } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

const Title3D = (props) => {
  const shape = new THREE.Shape();
  const width = 24;
  const height = 6;
  const radius = 1;

  // Draw rounded rectangle shape
  shape.moveTo(-width/2 + radius, -height/2);
  shape.lineTo(width/2 - radius, -height/2);
  shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius);
  shape.lineTo(width/2, height/2 - radius);
  shape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2);
  shape.lineTo(-width/2 + radius, height/2);
  shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius);
  shape.lineTo(-width/2, -height/2 + radius);
  shape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2);

  const extrudeSettings = {
    steps: 1,
    depth: 0.4,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.2,
    bevelSegments: 5
  };

  return (
    <group {...props}>
      <motion.mesh
        initial={{ scale: 0 }}
        animate={{ scale: 1.5 }}
        transition={{ duration: 0.5 }}
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshPhongMaterial 
          color="#f8fafc"
          transparent
          opacity={0.95}
          roughness={0.1}
          metalness={0.2}
          shininess={30}
        />
      </motion.mesh>

      <mesh position={[0, 3, 1]}>
        <Text
          fontSize={2}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
          fontWeight={700}
        >
          Explore India
        </Text>
      </mesh>
      
      <mesh position={[0, -1.2, 1]}>
        <Text
          fontSize={1.4}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#1e293b"
          fontWeight={700}
          maxWidth={20}
          textAlign="center"
        >
          Hover over the states to explore the beauty of India
        </Text>
      </mesh>
    </group>
  );
};

export default Title3D;