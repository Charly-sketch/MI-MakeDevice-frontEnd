import React, {memo } from 'react';
import * as THREE from "three";
import {useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


/**
 * Renders a module in the scene.
 * Includes both the GLB model and associated STL overlays.
 */
export const ModuleModel = memo(({ glbUrl, stlUrls, loadedStls, position, rotation }) => {
  const gltf = useLoader(GLTFLoader, glbUrl);
  const baseRotation = THREE.MathUtils.degToRad(rotation);

  return (
    <group position={[position.x, position.y, position.z]}>
      <primitive object={gltf.scene.clone()} rotation={[0, 0, baseRotation]} />
      {loadedStls.map((geometry, idx) =>
        stlUrls[idx].visible && geometry ? (
          <mesh
            key={idx}
            geometry={geometry}
            rotation={[-Math.PI/2, -baseRotation, 0]} 
            // HOW STL LOOKS HERE
            material={new THREE.MeshStandardMaterial({
              color: "#FF0000",
              transparent: true,
              opacity: 0.6,
            })}
          />
        ) : null
      )}
    </group>
  );
});