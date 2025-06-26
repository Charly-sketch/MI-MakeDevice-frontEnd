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

  if (!jsonData?.board?.size) return;

  let { x: sizeX, y: sizeY } = jsonData.board.size;

  if (caseParams.x != 0) {
    sizeX = caseParams.x;
  }
  if (caseParams.y != 0) {
    sizeY = caseParams.y;
  }
  if (!sizeX || !sizeY) return;

  setProgress(0); //console.log("Progress: 0%");

  //  Adjust sizeX and sizeY based on caseParams
  let xExtraThickness = caseParams.xWallThickness;
  let yExtraThickness = caseParams.yWallThickness;
  let zExtraThickness = caseParams.zWallThickness;

  // Calculate the total height of the case
  let Height = levelGap * levels + mountingDepth * 2;
  if (caseParams.mountOptions == 2) {
    Height = Height + caseParams.screwHeight;
  }

  sizeX = sizeX + caseParams.xWallThickness + 3;
  sizeY = sizeY + caseParams.xWallThickness + 3;

  // create the outer mesh
  let outerGeom = new RoundedBoxGeometry(
    sizeX + xExtraThickness,
    sizeY + yExtraThickness,
    Height + zExtraThickness,
    caseParams.roundnessDetail,
    caseParams.roundness,
  );
  let outerMesh = new THREE.Mesh(outerGeom);

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

  // CSG manipulation on with STLS and case.
  let totalSteps =
    models.reduce((acc, mod) => acc + mod.stlUrls.length, 0) || 1;
  let doneSteps = 0;

  // Load each STL model and apply CSG operations
  const mountMeshes = [];
  const subtractMeshes = [];

  for (const mod of models) {
    const rotationY = -THREE.MathUtils.degToRad(mod.rotation);
    const position = mod.position;

    for (let i = 0; i < mod.stlUrls.length; i++) {
      const stl = mod.stlUrls[i];
      const geometry = mod._loadedStls[i];

      // Skip if geometry is not loaded or not visible
      if (!geometry || !stl.visible) {
        updateProgress(1); // Phase 1 for STL loading
        await new Promise((r) => setTimeout(r, 0)); // to let the UI update
        continue;
      }

      const mesh = new THREE.Mesh(geometry);
      mesh.rotation.set(-Math.PI / 2, rotationY, 0);
      mesh.position.set(position.x, position.y, position.z);

      mesh.updateMatrixWorld(true);

      subtractMeshes.push(mesh);
      updateProgress(1); // Phase 1 for STL loading
      await new Promise((r) => setTimeout(r, 0)); // to let the UI update
    }
  }

  // Batch CSG union and subtract
  const batchSize = caseParams.batchSize || 7; // Variable to control batch size
  totalSteps =
    Math.ceil(mountMeshes.length / batchSize) +
    Math.ceil(subtractMeshes.length / batchSize); // Recalculate total steps after batching for 50% to 100%
  doneSteps = 0;

  // Union mountMeshes in batches
  console.log(
    `Processing ${mountMeshes.length} mount meshes in batches of ${batchSize}`,
  );
  for (let i = 0; i < mountMeshes.length; i += batchSize) {
    let group = mountMeshes.slice(i, i + batchSize);
    let merged = group[0];
    for (let j = 1; j < group.length; j++) {
      merged = CSG.union(merged, group[j]);
    }
    caseCSG = CSG.union(caseCSG, merged);
    updateProgress(2); // Phase 2 for mount meshes
    await new Promise((r) => setTimeout(r, 0)); // to let the UI update
  }

  // Subtract subtractMeshes in batches
  console.log(
    `Processing ${subtractMeshes.length} subtract meshes in batches of ${batchSize}`,
  );
  for (let i = 0; i < subtractMeshes.length; i += batchSize) {
    let group = subtractMeshes.slice(i, i + batchSize);
    let merged = group[0];
    for (let j = 1; j < group.length; j++) {
      merged = CSG.union(merged, group[j]);
    }
    caseCSG = CSG.subtract(caseCSG, merged);
    updateProgress(2); // Phase 2 for subtract meshes
    await new Promise((r) => setTimeout(r, 0)); // to let the UI update
  }

  function updateProgress(phase = 1) {
    doneSteps++;
    let percent = (doneSteps / totalSteps) * 49;
    if (phase === 2) {
      percent += 49; // Add 49% for the second phase
    }
    setProgress(percent);
    console.log(`Progress: ${percent}% (${doneSteps}/${totalSteps})`);
  }

  elapsedTime = Date.now() - startingTime;
  console.log("Load STL model in : " + elapsedTime);

  // split the case into a lid and base
  let outerSplitZ =
    caseCSG.position.z +
    (Height + zExtraThickness) -
    (Height + zExtraThickness) * 0.9;

  let lidTop = new RoundedBoxGeometry(
    sizeX + xExtraThickness + 0.1,
    sizeY + yExtraThickness + 0.1,
    Height + zExtraThickness - outerSplitZ + 0.2,
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
  let baseCSG = CSG.subtract(caseCSG, lidCSG);

  elapsedTime = Date.now() - startingTime;
  console.log("Split case into lid and base in : " + elapsedTime);

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

  setProgress(100);
  console.log("Progress: 100%");

  elapsedTime = Date.now() - startingTime;
  console.log("Total time to make case: " + elapsedTime);
};
