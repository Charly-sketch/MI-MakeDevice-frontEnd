import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { stlToggle } from "./utils_stl";

// React cannot just "see" what files are present so model_names and paths need to be specified.
// Paths where STL and GLB files are searched for
const MODEL_PATHS = [
  "MakeDevice-modules-main/models/",
  "MakeDevice-modules-main/models/",
];
const FILE_ENDINGS = ["_1", "_2", "_3"];

/**
 * Loads models from a list of module model_names from JSON config.
 * For each module, it searches for associated GLB and STL files.
 * Returns an array of models with metadata.
 */
export const loadModelsFromJson = async (modules, levelGap = 0, onProgress) => {
  if (onProgress) onProgress(0);
  const models = [];

  for (const mod of modules) {
    let i = 0;
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
              i++;
              return {
                meta: {
                  url: stlUrl,
                  model_name: `${mod.model_name}${suffix}.stl`,
                  visible: i === 1, // Only the first STL is visible by default
                  position: mod.position ? { ...mod.position } : null,
                  axis: "x",
                  moveAmount: 0,
                  scaleFactor: 1,
                },
                geometry,
              };
            }
            return null;
          }),
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
        console.warn(
          `Error loading model for ${mod.model_name} at ${path}`,
          err,
        );
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
      () => resolve(null),
    );
  });
};
