import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

// React cannot just "see" what files are present so model_names and paths need to be specified.
// Paths where STL and GLB files are searched for
const MODEL_PATHS = [
  "/MakeDevice-modules-main/mounted_modules/renders/",
  "/MakeDevice-modules-main/virtual_modules/renders/",
];

// Common suffixes for STL files associated with a module
const FILE_ENDINGS = [
  "_mount_back", "_mount_front", "_req", "_fun", "_microbit_slot", "_1", "_2", "_3", "_4", "_5", "_6",
  "_mesh_1", "_mesh_2", "_mesh_3", "_mesh_4", "_mesh_5", "_mesh_6", "_mesh_7", "_mesh_8", "_mesh_9", "_mesh_10", "_mesh_11", "_mesh_12", "_mesh_13", "_mesh_14", "_mesh_15", "_mesh_16", "_mesh_17", "_mesh_18",
];

/**
 * Loads models from a list of module model_names from JSON config.
 * For each module, it searches for associated GLB and STL files.
 * Returns an array of models with metadata.
 */
export const loadModelsFromJson = async (modules, levelGap = 0, onProgress) => {
  if (onProgress) onProgress(0);
  const models = [];

  for (const mod of modules) {
    for (const path of MODEL_PATHS) {
      const glbUrl = `${path}${mod.model_name}.glb`;
      try {
        const glbHead = await fetch(glbUrl, { method: "HEAD" });
        if (!glbHead.ok) continue;

        // Batch STL loading in parallel (no intermediate progress)
        const stlResults = await Promise.all(
          FILE_ENDINGS.map(async (suffix) => {
            const stlUrl = `${path}${mod.model_name}${suffix}.stl`;
            const geometry = await tryLoadSTL(stlUrl);
            if (geometry) {
              return {
                meta: {
                  url: stlUrl,
                  model_name: `${mod.model_name}${suffix}.stl`,
                  visible: true,
                  position: mod.position ? { ...mod.position } : null,
                  axis: "x",
                  moveAmount: 0,
                  scaleFactor: 1,
                },
                geometry,
              };
            }
            return null;
          })
        );
        const stlUrls = [];
        const stlGeometries = [];
        stlResults.forEach((result) => {
          if (result) {
            stlUrls.push(result.meta);
            stlGeometries.push(result.geometry);
          }
        });

        const scaledPosition = mod.position ? { ...mod.position } : null;
        if (scaledPosition && scaledPosition.z !== undefined) {
          scaledPosition.z *= levelGap;
        }
        stlUrls.forEach((stl) => {
          if (stl.position && stl.position.z !== undefined) {
            stl.position.z *= levelGap;
          }
        });

        models.push({
          glbUrl,
          stlUrls,
          _loadedStls: stlGeometries,
          model_name: mod.model_name,
          position: scaledPosition,
          rotation: mod.rotation,
        });
        break; // Stop searching other MODEL_PATHS for this module
      } catch (err) {
        console.warn(`Error loading model for ${mod.model_name} at ${path}`, err);
      }
    }
  }
  if (onProgress) onProgress(100);
  return models;
};

// Attempts to load an STL file from a URL, returns null if it fails
const tryLoadSTL = (url) => {
  return new Promise((resolve) => {
    // This could be set once above.
    const loader = new STLLoader();
    loader.load(
      url,
      (geometry) => resolve(geometry),
      // Ignore errors if happen, they should be caught in parent.
      undefined,
      () => resolve(null)
    );
  });
};