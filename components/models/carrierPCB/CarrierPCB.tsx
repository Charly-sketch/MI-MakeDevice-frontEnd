import { Suspense, useState } from "react";
import { Shape, ExtrudeGeometry } from "three";
import { useEffect } from "react";

import { CSG } from "three-csg-ts";
import * as THREE from "three";
import { collectMountingHoleLocations } from "../../pf_editor/editFunctions";
import { useThree } from "@react-three/fiber";

type RoundedRectProps = {
  width: number;
  height: number;
  depth: number;
  radius: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  jdMountingHoleLocations: any[];
};

const RoundedRect: React.FC<RoundedRectProps> = ({
  width = 100,
  height = 100,
  depth = 2.54,
  radius = 3.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = "#001800", // Changed to standard PCB green color
  jdMountingHoleLocations,
}) => {
  const [geometry, setGeometry] = useState<any | null>(null);

  const [ringMeshes, setRingMeshes] = useState<any[]>([]);

  const { scene } = useThree();

  useEffect(() => {
    const shape = new Shape();
    const x = -width / 2;
    const y = -height / 2;

    // Start at top-left corner
    shape.moveTo(x + radius, y);

    // Top edge
    shape.lineTo(x + width - radius, y);
    // Top-right corner
    shape.bezierCurveTo(
      x + width - radius + radius * 0.552,
      y,
      x + width,
      y + radius - radius * 0.552,
      x + width,
      y + radius,
    );

    // Right edge
    shape.lineTo(x + width, y + height - radius);
    // Bottom-right corner
    shape.bezierCurveTo(
      x + width,
      y + height - radius + radius * 0.552,
      x + width - radius + radius * 0.552,
      y + height,
      x + width - radius,
      y + height,
    );

    // Bottom edge
    shape.lineTo(x + radius, y + height);
    // Bottom-left corner
    shape.bezierCurveTo(
      x + radius - radius * 0.552,
      y + height,
      x,
      y + height - radius + radius * 0.552,
      x,
      y + height - radius,
    );

    // Left edge
    shape.lineTo(x, y + radius);
    // Top-left corner
    shape.bezierCurveTo(
      x,
      y + radius - radius * 0.552,
      x + radius - radius * 0.552,
      y,
      x + radius,
      y,
    );

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: false,
    };

    const baseCarrierPCBGeometry = new ExtrudeGeometry(shape, extrudeSettings);
    setGeometry(baseCarrierPCBGeometry);

    // Create inner and outer rings for mounting holes
    // outer copper ring
    const outer = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.4, 2.6, 62),
      new THREE.MeshBasicMaterial({ color: 0xa26b31 }),
    );
    // inner drill hole
    const inner = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 2.6, 62),
      new THREE.MeshBasicMaterial({ color: 0xa26b31 }),
    );

    const offsetAmt = 3;
    const cornerMountingHoleCoordinates = [
      {
        z: -(height / 2) + offsetAmt,
        y: 0,
        x: -(width / 2) + offsetAmt,
        corner: true,
      },
      {
        z: -(height / 2) + offsetAmt,
        y: 0,
        x: width / 2 - offsetAmt,
        corner: true,
      },
      {
        z: height / 2 - offsetAmt,
        y: 0,
        x: -(width / 2) + offsetAmt,
        corner: true,
      },
      {
        z: height / 2 - offsetAmt,
        y: 0,
        x: width / 2 - offsetAmt,
        corner: true,
      },
    ];

    const allJacdacMHLocations = cornerMountingHoleCoordinates.concat(
      jdMountingHoleLocations,
    );

    console.log("allJacdacLocations", allJacdacMHLocations);

    const standOffGeos: THREE.Mesh[] = [];
    const localRingMeshes: THREE.Mesh[] = [];

    allJacdacMHLocations.forEach((coord) => {
      // drill hole to be removed from the baseCarrierPCBGeometry
      const drillHole = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 200, 62),
        new THREE.MeshBasicMaterial({ color: 0xffff00 }),
      );

      // Position and the drill hole

      drillHole.position.set(coord.x, coord.z, -2);
      drillHole.rotation.set(Math.PI / 2, 0, 0);

      drillHole.updateMatrix();
      standOffGeos.push(drillHole);

      // Create the via ring mesh
      const viaRingMesh = CSG.subtract(outer, inner);

      viaRingMesh.position.set(coord.x, coord.z, 1.5);
      viaRingMesh.rotation.set(Math.PI / 2, 0, 0);

      viaRingMesh.updateMatrix();
      //ringMeshes.push(viaRingMesh);

      localRingMeshes.push(
        <primitive
          position={[coord.x, coord.z, 1.25]}
          key={Math.random()}
          object={viaRingMesh}
        ></primitive>,
      );
    });

    //setRingMeshes(localRingMeshes);
    const baseCarrierPCBMesh = new THREE.Mesh(baseCarrierPCBGeometry);

    // Subtract all the meshes in boxes from the baseCarrierPCBMesh
    /* let subtractResult = baseCarrierPCBMesh;
    standOffGeos.forEach((drillHole) => {
      subtractResult = CSG.subtract(subtractResult, drillHole);
    });

    subtractResult.updateMatrix();
    setGeometry(subtractResult.geometry); */

    // Clean up temporary geometries
  }, [width, height, depth, radius, scene, jdMountingHoleLocations]);

  if (!geometry) return null;

  return (
    <Suspense fallback={null}>
      <group name={"carrierPCB"} userData={{ height: height, width: width }}>
        <mesh position={position} rotation={rotation}>
          <primitive object={geometry} attach="geometry" />
          <meshStandardMaterial
            color="#4f7c69" // Lighter PCB green color
            roughness={1.3}
            metalness={0.3}
          />
          {ringMeshes}
        </mesh>
      </group>
    </Suspense>
  );
};

export default RoundedRect;
