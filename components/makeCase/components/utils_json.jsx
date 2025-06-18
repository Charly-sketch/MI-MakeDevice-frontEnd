import { loadModelsFromJson } from "./utils_loader";

// Reads and parses the uploaded JSON file.
// Loads models described in it and calculates board levels.
export const handleJsonUpload = (
    event,
    setJsonData,
    setLevels,
    setModels,
    levelGap,
    setProgress,
    setCaseMesh,
    setLidMesh
) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const json = JSON.parse(e.target.result);
                // If board is empty, Keep errors caught outside of this!
                const board = json.board || {};
                const modules = (json.modules || []).map((mod) => ({
                    model_name: mod.model_name,
                    rotation: mod.rotation,
                    position: {
                        x: mod.position?.x ?? 0,
                        y: mod.position?.y ?? 0,
                        z: mod.position?.z ?? 0,
                    },
                }));
                setJsonData({ board, modules });

                const zValues = modules.map((mod) => mod.position?.z ?? 0);
                const minZ = Math.min(...zValues);
                const maxZ = Math.max(...zValues);
                // Find difference in levels to get height.
                const newLevels = Math.max(maxZ - minZ + 1, maxZ);
                setLevels(newLevels);

                // Pass setProgress to loadModelsFromJson for progress bar
                const loaded = await loadModelsFromJson(
                    modules,
                    levelGap,
                    setProgress
                );
                setModels(loaded);
            } catch (err) {
                console.error("JSON parse error:", err);
            }
        };
        setCaseMesh(null);
        setLidMesh(null);
        reader.readAsText(file);
    }
};

export const buildFromJson = async (
    encodedJson,
    setJsonData,
    setLevels,
    setModels,
    levelGap,
    setProgress,
    setCaseMesh,
    setLidMesh
) => {
    const decoded = decodeURIComponent(encodedJson);
    const json = JSON.parse(decoded);

    console.log("buildFromJson called with json:", json);

    // If board is empty, Keep errors caught outside of this!
    const board = json.board || {};
    const modules = (json.modules || []).map((mod) => ({
        model_name: mod.model_name,
        rotation: mod.rotation,
        position: {
            x: mod.position?.x ?? 0,
            y: mod.position?.y ?? 0,
            z: mod.position?.z ?? 0,
        },
    }));
    console.log("Parsed board:", board);
    console.log("Parsed modules:", modules);

    setJsonData({ board, modules });

    const zValues = modules.map((mod) => mod.position?.z ?? 0);
    const minZ = Math.min(...zValues);
    const maxZ = Math.max(...zValues);
    console.log("zValues:", zValues, "minZ:", minZ, "maxZ:", maxZ);

    // Find difference in levels to get height.
    const newLevels = Math.max(maxZ - minZ + 1, maxZ);
    console.log("Calculated newLevels:", newLevels);
    setLevels(newLevels);

    // Pass setProgress to loadModelsFromJson for progress bar
    const loaded = await loadModelsFromJson(
        modules,
        levelGap,
        setProgress
    );
    console.log("Loaded models:", loaded);
    setModels(loaded);

    setCaseMesh(null);
    setLidMesh(null);
    console.log("Case and lid mesh reset to null");
};