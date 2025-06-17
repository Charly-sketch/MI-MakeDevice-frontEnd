import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

import { parse } from "gltfjsx";

const Model = ({
  url,
  rotation,
  onLoad,
}: {
  url: string;
  rotation: [number, number, number];
  onLoad: (scene: THREE.Scene) => void;
}) => {
  const { scene } = useGLTF(url);
  console.log("scene:", scene);

  useEffect(() => {
    // Compute the bounding box of the scene
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());

    // Adjust the position of the scene to center it at the world origin
    scene.position.set(-center.x, -center.y, -center.z);

    //const parsedResult = parse(scene);
    //console.log("parsedResult:", parsedResult);

    // Notify that the scene is loaded
    //onLoad(scene);

    // Print the origin of the model to the console
    console.log("Model origin:", scene.position);
  }, [scene, onLoad]);

  return <primitive rotation={rotation} object={scene} />;
};

const GLTFDropzone: React.FC = () => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([
    Math.PI / 2,
    0,
    0,
  ]);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [modelScene, setModelScene] = useState<THREE.Scene | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("dropped");

    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);

      // Clean up the previous object URL to prevent memory leaks
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noDragEventsBubbling: true,
    onDrop,
    accept: {
      "model/gltf+json": [".gltf"],
      "model/gltf-binary": [".glb"],
    },
    multiple: false,
    disabled: !!modelUrl, // Disable dropzone when a model is loaded
  });

  const downloadGLB = () => {
    if (!scene || !modelScene) return;

    // Add the model scene to the main scene
    scene.add(modelScene);

    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (result) => {
        const blob = new Blob([result as BlobPart], {
          type: "model/gltf-binary",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "scene.glb";
        link.click();

        // Remove the model scene from the main scene after export
        scene.remove(modelScene);
      },
      { binary: true },
    );
  };

  return (
    <>
      <div style={{ width: "80vw", height: "80vh" }}>
        <div
          {...getRootProps({
            className: "dropzone",
            onDrop: (event) => event.stopPropagation(),
          })}
          style={{
            border: "2px dashed #cccccc",
            borderRadius: "4px",
            padding: "20px",
            textAlign: "center",
            height: "100%",
            cursor: "pointer",
          }}
        >
          <input {...getInputProps()} />
          {modelUrl ? (
            <Canvas
              camera={{ position: [0, 0, 5] }}
              onCreated={({ scene }) => setScene(scene)}
            >
              <axesHelper visible={!modelUrl} args={[200]} />
              <ambientLight intensity={1} />
              <directionalLight
                intensity={1}
                castShadow
                shadow-mapSize-height={1512}
                shadow-mapSize-width={1512}
              />
              <Model
                url={modelUrl}
                rotation={modelRotation}
                onLoad={setModelScene}
              />
              <OrbitControls
                makeDefault
                target={[0, 0, 0]}
                enableDamping={true}
                autoRotate={false}
              />
            </Canvas>
          ) : (
            <p>
              {isDragActive
                ? "Drop the GLTF file here..."
                : "Drag and drop a GLTF file here, or click to select one"}
            </p>
          )}
        </div>
      </div>

      <div>
        {modelUrl && (
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <button onClick={() => setModelRotation([Math.PI / 2, 0, 0])}>
              Front
            </button>
            <button onClick={() => setModelRotation([0, Math.PI / 2, 0])}>
              Side
            </button>
            <button onClick={() => setModelRotation([0, 0, 0])}>Top</button>
            <button onClick={downloadGLB}>Download GLB</button>
          </div>
        )}
      </div>
    </>
  );
};

export default GLTFDropzone;
