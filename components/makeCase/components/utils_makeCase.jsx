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
    setCaseMesh
) => {
    let startingTime = Date.now();
    let elapsedTime = startingTime;

    if (!jsonData?.board?.size) return;

    let { x: sizeX, y: sizeY } = jsonData.board.size;

    if (caseParams.x != 0) { sizeX = caseParams.x; }
    if (caseParams.y != 0) { sizeY = caseParams.y; }
    if (!sizeX || !sizeY) return;

    setProgress(0); //console.log("Progress: 0%");

    //  Adjust sizeX and sizeY based on caseParams
    let xExtraThickness = caseParams.xWallThickness;
    let yExtraThickness = caseParams.yWallThickness;
    let zExtraThickness = caseParams.zWallThickness;

    // Calculate the total height of the case
    let Height = levelGap * levels + mountingDepth * 2;
    if (caseParams.mountOptions == 2) { Height = Height + caseParams.screwHeight; }

    // Adjust the height based on caseParams
    let outerGeom = new RoundedBoxGeometry(
        sizeX + xExtraThickness,
        sizeY + yExtraThickness,
        Height + zExtraThickness,
        1,
        caseParams.roundness
    );

    // Create the outer and inner meshes
    let outerMesh = new THREE.Mesh(outerGeom);
    let innerGeom = new THREE.BoxGeometry(sizeX, sizeY, Height);
    let innerMesh = new THREE.Mesh(innerGeom);

    // Position the outer mesh
    let caseCSG = CSG.subtract(outerMesh, innerMesh);

    // Set the position of the case based on caseParams
    if (caseParams.zOrigin != 0) {
        caseCSG.position.z = caseParams.zOrigin;
    } else if (caseParams.zOrigin == 0 && caseParams.mountOptions != 0) {
        caseCSG.position.z = Height / 2 - caseParams.screwHeight;
    } else {
        caseCSG.position.z = Height / 2;
    }
    caseCSG.position.y = caseParams.yOrigin;
    caseCSG.position.x = caseParams.xOrigin;
    caseCSG.updateMatrix();

    // CSG manipulation on with STLS and case.
    let totalSteps = models.reduce((acc, mod) => acc + mod.stlUrls.length, 0) || 1;
    let doneSteps = 0;

    // -10seconds

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
                await new Promise(r => setTimeout(r, 0)); // to let the UI update
                continue;
            }

            const isMountBack = stl.model_name.includes("_mount_back.stl");
            const isMountFront = stl.model_name.includes("_mount_front.stl");
            const isMount = isMountBack || isMountFront;

            const mesh = new THREE.Mesh(geometry);
            mesh.rotation.set(-Math.PI / 2, rotationY, 0);
            mesh.position.set(position.x, position.y, position.z);

            if (isMount) {
                const isBack = isMountBack;
                let offset =
                    caseParams.mountOptions === 0
                        ? isBack
                            ? -(Height / 2) + zExtraThickness / 2 - 0.25
                            : Height / 2 - zExtraThickness * 2 - 2.25
                        : isBack
                            ? Height / 2 - zExtraThickness * 2 - 4.25
                            : -(Height / 2) + zExtraThickness / 2 - 4.25;

                if (caseParams.mountOptions === 2) {
                    const screw = caseParams.screwHeight;
                    offset += isBack
                        ? screw / 2 + 0.4 * screw + 0.65
                        : -screw / 2 - 0.6 * screw - 0.25;
                }

                mesh.position.z = caseCSG.position.z + offset;
            }

            mesh.updateMatrixWorld(true);

            if (isMount) {
                mountMeshes.push(mesh);
            } else {
                subtractMeshes.push(mesh);
            }

            updateProgress(1); // Phase 1 for STL loading
            await new Promise(r => setTimeout(r, 0)); // to let the UI update
        }
    }

    // Batch CSG union and subtract
    
    const batchSize = caseParams.batchSize || 7; // Variable to control batch size
    totalSteps = Math.ceil(mountMeshes.length / batchSize) + Math.ceil(subtractMeshes.length / batchSize); // Recalculate total steps after batching for 50% to 100%
    doneSteps = 0;
    
    // Union mountMeshes in batches
    console.log(`Processing ${mountMeshes.length} mount meshes in batches of ${batchSize}`);
    for (let i = 0; i < mountMeshes.length; i += batchSize) {
        let group = mountMeshes.slice(i, i + batchSize);
        let merged = group[0];
        for (let j = 1; j < group.length; j++) {
            merged = CSG.union(merged, group[j]);
        }
        caseCSG = CSG.union(caseCSG, merged);
        updateProgress(2); // Phase 2 for mount meshes
        await new Promise(r => setTimeout(r, 0)); // to let the UI update

    }

    // Subtract subtractMeshes in batches
    console.log(`Processing ${subtractMeshes.length} subtract meshes in batches of ${batchSize}`);
    for (let i = 0; i < subtractMeshes.length; i += batchSize) {
        let group = subtractMeshes.slice(i, i + batchSize);
        let merged = group[0];
        for (let j = 1; j < group.length; j++) {
            merged = CSG.union(merged, group[j]);
        }
        caseCSG = CSG.subtract(caseCSG, merged);
        updateProgress(2); // Phase 2 for subtract meshes
        await new Promise(r => setTimeout(r, 0)); // to let the UI update
    }

    // if (mountMeshes.length > 0) {
    //     const mergedMounts = mountMeshes.reduce((acc, m, i) =>
    //         i === 0 ? m : CSG.union(acc, m)
    //     );
    //     caseCSG = CSG.union(caseCSG, mergedMounts);
    // }

    // if (subtractMeshes.length > 0) {
    //     const mergedSubtracts = subtractMeshes.reduce((acc, m, i) =>
    //         i === 0 ? m : CSG.union(acc, m)
    //     );
    //     caseCSG = CSG.subtract(caseCSG, mergedSubtracts);
    // }

    // Helper function
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
        (Height + zExtraThickness) * 0.65;
    let innerSplitZ =
        caseCSG.position.z +
        (Height + zExtraThickness) -
        (Height + zExtraThickness) * 0.85;

    let sep = new THREE.BoxGeometry(
        sizeX + xExtraThickness / 2 - 0.1,
        sizeY + yExtraThickness / 2 - 0.1,
        outerSplitZ - innerSplitZ + 0.2
    );

    let innersep = new THREE.BoxGeometry(
        sizeX + xExtraThickness / 2 + 0.1,
        sizeY + yExtraThickness / 2 + 0.1,
        outerSplitZ - innerSplitZ + 0.2
    );

    outerMesh = new THREE.Mesh(sep);
    innerMesh = new THREE.Mesh(innersep);

    let horizontalSplit = CSG.subtract(outerMesh, innerMesh);
    horizontalSplit.position.z = (outerSplitZ - innerSplitZ) / 2 + innerSplitZ;
    horizontalSplit.position.y = caseCSG.position.y;
    horizontalSplit.position.x = caseCSG.position.x;
    horizontalSplit.updateMatrix();

    // Lid steal
    let lidInner = new THREE.BoxGeometry(
        sizeX + xExtraThickness / 2 - 0.1,
        sizeY + yExtraThickness / 2 - 0.1,
        outerSplitZ - innerSplitZ + 0.5
    );
    let lidInnerMesh = new THREE.Mesh(lidInner);
    lidInnerMesh.position.z = (outerSplitZ - innerSplitZ) / 2 + innerSplitZ;
    lidInnerMesh.position.y = caseCSG.position.y;
    lidInnerMesh.position.x = caseCSG.position.x;
    lidInnerMesh.updateMatrix();

    let lidTop = new THREE.BoxGeometry(
        sizeX + xExtraThickness + 0.1,
        sizeY + yExtraThickness + 0.1,
        Height + zExtraThickness - outerSplitZ + 0.2
    );
    let lidTopMesh = new THREE.Mesh(lidTop);
    lidTopMesh.position.z =
        Height + zExtraThickness - (Height + zExtraThickness - outerSplitZ) / 2;
    lidTopMesh.position.y = caseCSG.position.y;
    lidTopMesh.position.x = caseCSG.position.x;
    lidTopMesh.updateMatrix();
    let stealLid = CSG.union(lidInnerMesh, lidTopMesh);

    let lidCSG = CSG.intersect(stealLid, caseCSG);
    caseCSG = CSG.subtract(caseCSG, stealLid);

    elapsedTime = Date.now() - startingTime;
    console.log("Split case into lid and base in : " + elapsedTime);

    caseCSG.material = new THREE.MeshStandardMaterial({
        color: "#ccccFF",
        transparent: true,
        opacity: 0.9,
    });
    setLidMesh(lidCSG);

    lidCSG.material = new THREE.MeshStandardMaterial({
        color: "#ccFFcc",
        transparent: true,
        opacity: 0.5,
    });
    setCaseMesh(caseCSG);

    setProgress(100);
    console.log("Progress: 100%");

    elapsedTime = Date.now() - startingTime;
    console.log("Total time to make case: " + elapsedTime);
};