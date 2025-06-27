import { CSG } from "three-csg-ts";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export const makeCase = async (
  jsonData,
  caseParams,
  setProgress,
  levels,
  levelGap,
  mountingDepth,
  models,
  setLidMesh,
  setCaseMesh,
) => {
  let startingTime = Date.now();
  let elapsedTime = startingTime;

  let totalPhases = 4;
  let totalSteps = 4;
  let phase = 0;
  let doneSteps = 0;

  console.log("Start initial setup: " + elapsedTime);
  updateProgress(phase, totalPhases, totalSteps, doneSteps++); // Phase 1 for initial setup

  if (!jsonData?.board?.size) return;

  let { x: sizeX, y: sizeY } = jsonData.board.size;

  //  Adjust sizeX and sizeY based on caseParams
  let xExtraThickness = caseParams.xWallThickness;
  let yExtraThickness = caseParams.yWallThickness;
  let zExtraThickness = caseParams.zWallThickness;

  // Calculate the total height of the case
  let Height = levelGap * levels + mountingDepth * 2;
  if (caseParams.mountOptions == 2) {
    Height += caseParams.screwHeight;
  }

  sizeX = sizeX + caseParams.xWallThickness + 3;
  sizeY = sizeY + caseParams.yWallThickness + 3;

  // create the outer mesh
  let outerGeom = new RoundedBoxGeometry(
    sizeX + xExtraThickness,
    sizeY + yExtraThickness,
    Height + zExtraThickness,
    caseParams.roundnessDetail,
    caseParams.roundness,
  );
  let outerMesh = new THREE.Mesh(outerGeom);

  updateProgress(phase, totalPhases, totalSteps, doneSteps++); // Phase 1 for initial setup

  // Create the inner meshes
  let innerGeom = new RoundedBoxGeometry(
    sizeX,
    sizeY,
    Height,
    caseParams.roundnessDetail,
    caseParams.roundness,
  );
  let innerMesh = new THREE.Mesh(innerGeom);

  // Position the outer mesh
  let caseCSG = CSG.subtract(outerMesh, innerMesh);

  updateProgress(phase, totalPhases, totalSteps, doneSteps++); // Phase 1 for initial setup

  // Set the position of the case based on caseParams
  if (caseParams.zOrigin != 0) {
    caseCSG.position.z = caseParams.zOrigin - 5;
  } else if (caseParams.zOrigin == 0 && caseParams.mountOptions != 0) {
    caseCSG.position.z = Height / 2 - caseParams.screwHeight - 5;
  } else {
    caseCSG.position.z = Height / 2 - 5;
  }
  caseCSG.position.y = caseParams.yOrigin;
  caseCSG.position.x = caseParams.xOrigin;
  caseCSG.updateMatrix();

  updateProgress(phase, totalPhases, totalSteps, doneSteps++); // Phase 1 for initial setup

  // CSG manipulation on with STLS and case.
  elapsedTime = Date.now() - startingTime;
  console.log("Start Load STL models and apply CSG operations: " + elapsedTime);
  totalSteps = models.reduce((acc, mod) => acc + mod.stlUrls.length, 0) || 1;
  phase = 1; // Set phase to 1 for STL loading
  doneSteps = 0;

  // Load each STL model and apply CSG operations
  // const mountMeshes = [];
  const subtractMeshes = [];

  for (const mod of models) {
    const rotationY = -THREE.MathUtils.degToRad(mod.rotation);
    const position = mod.position;

    for (let i = 0; i < mod.stlUrls.length; i++) {
      const stl = mod.stlUrls[i];
      const geometry = mod._loadedStls[i];

      // Skip if geometry is not loaded or not visible
      if (!geometry || !stl.visible) {
        updateProgress(phase, totalPhases, totalSteps, doneSteps++); // Phase 1 for initial setup
        await new Promise((r) => setTimeout(r, 0)); // to let the UI update
        continue;
      }

      const mesh = new THREE.Mesh(geometry);
      mesh.rotation.set(-Math.PI / 2, rotationY, 0);
      mesh.position.set(position.x, position.y, position.z);

      mesh.updateMatrixWorld(true);

      subtractMeshes.push(mesh);
      updateProgress(phase, totalPhases, totalSteps, doneSteps++); // Phase 1 for initial setup
      await new Promise((r) => setTimeout(r, 0)); // to let the UI update
    }
  }

  // Batch CSG union and subtract
  console.log("CSFG operations on case and STLs");
  const batchSize = caseParams.batchSize || 7; // Variable to control batch size

  phase = 2; // Set phase to 2 for CSG operations
  totalSteps = Math.ceil(subtractMeshes.length / batchSize);
  doneSteps = 0;

  // Union mountMeshes in batches
  // console.log(
  //   `Processing ${mountMeshes.length} mount meshes in batches of ${batchSize}`,
  // );
  // for (let i = 0; i < mountMeshes.length; i += batchSize) {
  //   let group = mountMeshes.slice(i, i + batchSize);
  //   let merged = group[0];
  //   for (let j = 1; j < group.length; j++) {
  //     merged = CSG.union(merged, group[j]);
  //   }
  //   caseCSG = CSG.union(caseCSG, merged);
  //   updateProgress(2); // Phase 2 for mount meshes
  //   await new Promise((r) => setTimeout(r, 0)); // to let the UI update
  // }

  // Subtract subtractMeshes in batches
  console.log(`Subtract ${subtractMeshes.length} meshes in ${batchSize}`);
  for (let i = 0; i < subtractMeshes.length; i += batchSize) {
    updateProgress(phase, totalPhases, totalSteps, doneSteps++); // Phase 1 for initial setup
    await new Promise((r) => setTimeout(r, 0)); // to let the UI update
    let group = subtractMeshes.slice(i, i + batchSize);
    let merged = group[0];
    for (let j = 1; j < group.length; j++) {
      merged = CSG.union(merged, group[j]);
    }
    caseCSG = CSG.subtract(caseCSG, merged);
  }

  elapsedTime = Date.now() - startingTime;
  console.log("Start splitting case: " + elapsedTime);
  phase = 3; // Set phase to 3 for splitting case into lid and base
  totalSteps = 7;
  doneSteps = 0;

  updateProgress(phase, totalPhases, totalSteps, doneSteps++);

  // split the case into a lid and base
  let outerSplitZ =
    caseCSG.position.z +
    (Height + zExtraThickness) -
    (Height + zExtraThickness) * 0.9;

  let lidTop = new RoundedBoxGeometry(
    sizeX + xExtraThickness + 100,
    sizeY + yExtraThickness + 100,
    Height + zExtraThickness - outerSplitZ,
    1,
    0, //caseParams.roundness
  );
  let lidTopMesh = new THREE.Mesh(lidTop);
  lidTopMesh.position.z =
    Height + zExtraThickness - (Height + zExtraThickness - outerSplitZ) / 2;
  lidTopMesh.position.y = caseCSG.position.y;
  lidTopMesh.position.x = caseCSG.position.x;
  lidTopMesh.updateMatrix();

  let lidCSG = CSG.intersect(lidTopMesh, caseCSG);
  let baseCSG = CSG.subtract(caseCSG, lidTopMesh);

  updateProgress(phase, totalPhases, totalSteps, doneSteps++);

  // screw holes at each corner of the base
  let screwHoleGeom = new THREE.CylinderGeometry(1, 1, 3, 5);
  screwHoleGeom.rotateX(Math.PI / 2);
  let screwSupportGeom = new THREE.CylinderGeometry(3, 3, 3, 5);
  screwSupportGeom.rotateX(Math.PI / 2);

  // get positions for the screw holes
  const halfX = (sizeX + xExtraThickness) / 2;
  const halfY = (sizeY + yExtraThickness) / 2;
  const offset = 10;

  const corners = [
    [-halfX + offset, -halfY + offset],
    [halfX - offset, -halfY + offset],
    [-halfX + offset, halfY - offset],
    [halfX - offset, halfY - offset],
  ];

  for (const [x, y] of corners) {
    let screwHoleMesh = new THREE.Mesh(screwHoleGeom.clone());
    let screwSupportMesh = new THREE.Mesh(screwSupportGeom.clone());
    let screwSupport = CSG.subtract(screwSupportMesh, screwHoleMesh);
    screwSupport.position.set(
      x,
      y,
      -outerSplitZ + caseParams.zWallThickness - 0.1,
    );
    screwSupport.updateMatrix();
    baseCSG = CSG.union(baseCSG, screwSupport);
    await new Promise((r) => setTimeout(r, 0)); // to let the UI update
    updateProgress(phase, totalPhases, totalSteps, doneSteps++);
  }

  // Set the materials for the base and lid
  baseCSG.material = new THREE.MeshStandardMaterial({
    color: "yellow", //"#ccccFF",
    transparent: true,
    opacity: caseParams.caseOpacity, //0.6,
  });
  setLidMesh(lidCSG);

  lidCSG.material = new THREE.MeshStandardMaterial({
    color: "blue", //"#ccFFcc",
    transparent: true,
    opacity: caseParams.lidOpacity, //0.6,
  });

  setLidMesh(lidCSG);
  setCaseMesh(baseCSG);

  elapsedTime = Date.now() - startingTime;
  console.log("Total time to make case: " + elapsedTime);
  updateProgress(phase, totalPhases, totalSteps, doneSteps++);

  setProgress(100);
  console.log("-> Case creation complete!");

  // Function to update progress bar
  async function updateProgress(
    phase = 1,
    totalPhases = 2,
    totalSteps = 1,
    doneSteps = 0,
  ) {
    doneSteps++;
    let phaseSize = 100 / totalPhases; // Size of each phase in percentage
    let percent = (doneSteps / totalSteps) * phaseSize;
    percent += phase * phaseSize; // Adjust percent based on phase
    setProgress(percent);
    console.log(`-> Progress: ${percent.toFixed(2)}% (Phase ${phase})`);
    await new Promise((r) => setTimeout(r, 1)); // to let the UI update
  }
};
