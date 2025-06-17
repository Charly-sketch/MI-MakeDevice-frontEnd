import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";

export function exportCaseAsStl(mesh) {
  if (!mesh) return;
  const exporter = new STLExporter();
  // Traverse the mesh, not the scene
  const stlString = exporter.parse(mesh);
  const blob = new Blob([stlString], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "case.stl";
  link.click();
}

export function exportLidAsStl(mesh) {
  if (!mesh) return;
  const exporter = new STLExporter();
  const stlString = exporter.parse(mesh);
  const blob = new Blob([stlString], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "lid.stl";
  link.click();
}

// Toggles the visibility of a specific STL file in the selected model.
export const stlToggle = (stlIdx, selectedModelIndex, setModels) => {
  if (selectedModelIndex === null) return;
  setModels((prevModels) => {
    const updated = prevModels.map((mod, idx) => {
      if (idx !== selectedModelIndex) return mod;
      const stlUrls = mod.stlUrls.map((stl, i) =>
        i === stlIdx ? { ...stl, visible: !stl.visible } : stl
      );
      return { ...mod, stlUrls };
    });
    return updated;
  });
};

// Uploads a new STL file and replaces the existing one at the specified index.
export const stlUpload = (event, stlIdx, selectedModelIndex, setModels) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const arrayBuffer = e.target.result;
    const loader = new STLLoader();
    const newGeometry = loader.parse(arrayBuffer);
    setModels((prevModels) => {
      const updated = prevModels.map((mod, idx) => {
        if (idx !== selectedModelIndex) return mod;
        const _loadedStls = mod._loadedStls.map((g, i) =>
          i === stlIdx ? newGeometry : g
        );
        const stlUrls = mod.stlUrls.map((meta, i) =>
          i === stlIdx
            ? {
                ...meta,
                model_name: file.model_name,
                position: meta.position || { x: 0, y: 0, z: 0 },
                moveAmount: 0,
                scaleFactor: 1,
              }
            : meta
        );
        return { ...mod, _loadedStls, stlUrls };
      });
      return updated;
    });
  };
  reader.readAsArrayBuffer(file);
};

// Saves the scale factor for a specific STL file in the selected model.
export const stlScaleSave = (stlIdx, factor, setModels, selectedModelIndex) => {
  setModels((prevModels) => {
    const updated = prevModels.map((mod, idx) => {
      if (idx !== selectedModelIndex) return mod;
      const stlUrls = mod.stlUrls.map((meta, i) =>
        i === stlIdx ? { ...meta, scaleFactor: factor } : meta
      );
      return { ...mod, stlUrls };
    });
    return updated;
  });
};

// Moves a specific STL file in the selected model by a given amount.
export const stlMove = (stlIdx, amount, setModels, selectedModelIndex) => {
  setModels((prevModels) => {
    const updated = prevModels.map((mod, idx) => {
      if (idx !== selectedModelIndex) return mod;
      const stlUrls = mod.stlUrls.map((meta, i) =>
        i === stlIdx ? { ...meta, moveAmount: amount } : meta
      );
      return { ...mod, stlUrls };
    });
    return updated;
  });
};

// Scales a specific STL file in the selected model by its scale factor.
export const stlScale = (modelIdx, stlIdx, setModels) => {
  setModels((prevModels) => {
    return prevModels.map((mod, idx) => {
      if (idx !== modelIdx) return mod;
      const scaleFactor = mod.stlUrls[stlIdx].scaleFactor || 1;
      const geometry = mod._loadedStls[stlIdx].clone();
      geometry.scale.set(scaleFactor, scaleFactor, scaleFactor);
      const _loadedStls = mod._loadedStls.map((g, i) =>
        i === stlIdx ? geometry : g
      );
      return { ...mod, _loadedStls };
    });
  });
};

// Adds a new STL file to the selected model.
export const stlAddNew = (event, selectedModelIndex, setModels) => {
  const file = event.target.files[0];
  if (!file || selectedModelIndex === null) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const arrayBuffer = e.target.result;
    const loader = new STLLoader();
    const geometry = loader.parse(arrayBuffer);
    setModels((prevModels) => {
      const updated = prevModels.map((mod, idx) => {
        if (idx !== selectedModelIndex) return mod;
        const newSTLMeta = {
          url: null,
          model_name: file.model_name,
          visible: true,
          position: { ...mod.position },
          axis: "x",
          moveAmount: 0,
          scaleFactor: 1,
        };
        return {
          ...mod,
          stlUrls: [...mod.stlUrls, newSTLMeta],
          _loadedStls: [...mod._loadedStls, geometry],
        };
      });
      return updated;
    });
  };
  reader.readAsArrayBuffer(file);
};

// Deletes the selected STL file from the selected model.
export const stlDeleteSelected = (
  selectedModelIndex,
  setModels,
  selectedStlIndex,
  setSelectedStlIndex
) => {
  if (selectedModelIndex === null || selectedStlIndex === null) return;
  setModels((prevModels) => {
    const updated = prevModels.map((mod, idx) => {
      if (idx !== selectedModelIndex) return mod;
      return {
        ...mod,
        stlUrls: mod.stlUrls.filter((_, i) => i !== selectedStlIndex),
        _loadedStls: mod._loadedStls.filter((_, i) => i !== selectedStlIndex),
      };
    });
    return updated;
  });
  setSelectedStlIndex(null);
};