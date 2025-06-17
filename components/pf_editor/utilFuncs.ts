import { Vector3, Box3 } from "three";
import { Module } from "./FabricationSettingsModal";

export function getModulesFromScene(scene: any): Module[] {
  const mhLocations: any[] = [];
  // console.log('scene in mod from scene: ', scene);

  scene.traverse((obj) => {
    if (obj.userData.isModule) {
      const moduleName = obj.userData.name;
      console.log("moduleName: ", moduleName);
      const moduleID = obj.userData.moduleData.id;
      console.log("moduleID: ", moduleID);
      const position = obj.parent.position;
      console.log("position: ", position);
      const rotation = obj.rotation;
      console.log("rotation: ", rotation);
      const footprintID = obj.userData.footprintID;
      console.log("footprintID: ", footprintID);
      const model_name = obj.userData.model_name;
      console.log("model_name: ", model_name);

      console.log();

      mhLocations.push({
        position: { x: position.z, y: position.x },
        rotation: JSON.parse(
          JSON.stringify(Math.abs(rotation.y * (180 / Math.PI) + 90)),
        ),
        name: footprintID ? footprintID : moduleName,
        model_name: model_name ? model_name : "none" // c'est là que le nom du module est récupéré 
      });
    }
  });

  return mhLocations;
}

/** Gets the size of an object3d passed as parameter */
export function getObjectSize(object) {
  // console.log('objedt in size: ', object);

  let size = new Vector3(0, 0, 0);

  let boundingBox = new Box3().setFromObject(object);
  boundingBox.getSize(size);

  return size;
}

/**
 * Rounds a number to the nearest step value.
 * @param value The value to round
 * @param step The step size to round to (e.g., 0.5, 0.25, etc.)
 * @returns The value rounded to the nearest step with the same precision as the step parameter
 */
export function roundToStep(value: number, step: number): number {
  if (step === 0) return value;

  // Round to the nearest step
  const invStep = 1 / step;
  const result = Math.round(value * invStep) / invStep;

  // Handle floating point precision issues
  const stepStr = step.toString();
  // Correctly determine precision from step
  const precision = stepStr.includes(".") ? stepStr.split(".")[1].length : 0;

  // Always format to the precision of the step
  if (precision > 0) {
    return parseFloat(result.toFixed(precision));
  }

  return result;
}
