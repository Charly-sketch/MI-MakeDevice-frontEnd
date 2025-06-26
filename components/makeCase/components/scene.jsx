import { memo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ModuleModel } from "./moduleModel";

/**
 * Main 3D canvas scene.
 * Adds all models, the orbit camera, and the generated case mesh.
 */
export const Scene = memo(
  ({ models, caseMesh, lidMesh, mountingPlateMesh }) => {
    return (
      <Canvas
        camera={{ position: [0, 0, 200], fov: 50 }}
        style={{ background: "white" }}
      >
        <ambientLight />
        <directionalLight position={[0, 10, 5]} intensity={1} />

        {mountingPlateMesh && <primitive object={mountingPlateMesh} />}

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
        <OrbitControls />
      </Canvas>
    );
  },
);

Scene.displayName = "Scene";
