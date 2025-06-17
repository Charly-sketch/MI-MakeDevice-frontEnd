import {memo} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ModuleModel } from './moduleModel';

/**
 * Main 3D canvas scene.
 * Adds all models, the orbit camera, and the generated case mesh.
 */
export const Scene = memo(({
  models,
  caseMesh,
  lidMesh,
}) => {
  return (
    <Canvas 
      camera={{ position: [0, 0, 200], fov: 50 }} 
      style={{ background: 'white' }}>

      <ambientLight/>

      {models.map((mod, idx) => (
        <ModuleModel
          key={idx}
          glbUrl={mod.glbUrl}
          stlUrls={mod.stlUrls}
          loadedStls={mod._loadedStls}
          position={mod.position}
          rotation={mod.rotation}
        />
      ))}

      
      {caseMesh && <primitive object={caseMesh} />}
      {lidMesh && <primitive object={lidMesh} />}
      <OrbitControls/>
    </Canvas>
  );
});