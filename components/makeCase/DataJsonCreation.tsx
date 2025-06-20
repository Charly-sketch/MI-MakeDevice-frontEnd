import {
  FabricationSettings,
  defaultSettings,
} from "../pf_editor/FabricationSettingsModal";
import { getModulesFromScene, roundToStep } from "../pf_editor/utilFuncs";

interface GenerateCookieOptions {
  initialSettings?: FabricationSettings;
  editorScene?: any;
}

export function generateFabricationSettingsCookie({
  initialSettings,
  editorScene,
}: GenerateCookieOptions): FabricationSettings {
  // 1. Deep-merge des settings initiaux et des settings par défaut
  const settings: FabricationSettings = {
    ...JSON.parse(JSON.stringify(defaultSettings)),
    ...initialSettings,
    board: {
      ...defaultSettings.board,
      ...initialSettings?.board,
    },
    configuration: {
      ...defaultSettings.configuration,
      ...initialSettings?.configuration,
      routing_options: {
        ...defaultSettings.configuration?.routing_options,
        ...initialSettings?.configuration?.routing_options,
      },
    },
  };

  // 2. Si on nous passe une scène d'éditeur, on extrait et on nettoie les modules
  if (editorScene) {
    const modules = getModulesFromScene(editorScene);
    const resolution = settings.configuration.routing_options.resolution ?? 1;

    settings.modules = modules.map((m) => ({
      ...m,
      rotation: roundToStep(m.rotation, 90),
      position: {
        x: roundToStep(m.position.x, resolution),
        y: roundToStep(m.position.y, resolution),
      },
    }));
  } else {
    console.log("No editor scene provided, using default modules.");
  }

  // 3. Ajout automatique des connecteurs si activé dans les options
  const halfY = Math.abs(settings.board.size.y / 2);
  if (settings.configuration.fabrication_options.connectors.bottom) {
    settings.modules.push({
      name: "jacdac_connector_0.1",
      position: { x: 0, y: -halfY },
      rotation: 180,
    });
  }
  if (settings.configuration.fabrication_options.connectors.top) {
    settings.modules.push({
      name: "jacdac_connector_0.1",
      position: { x: 0, y: halfY },
      rotation: 0,
    });
  }

  // 4. Génération du JSON et stockage dans le cookie
  const json = JSON.stringify(settings);
  if (typeof window !== "undefined") {
    document.cookie = [
      `fabricationSettings=${encodeURIComponent(json)}`,
      "path=/",
      "max-age=31536000", // 1 an
    ].join("; ");
  }

  // 5. On retourne l’objet settings au cas où on veuille l’utiliser immédiatement
  return settings;
}

// if (editorScene === undefined) {
//     let initialSettings = undefined;
//     // let editorScene = useState(null);
//     console.log("TabSwitch props");
//     const handleGenerate = () => {
//       console.log("Generating fabrication settings...");
//       const settings = generateFabricationSettingsCookie({
//         initialSettings,
//         editorScene,
//       });
//       console.log("Fabrication settings generated:", settings);
//     };
//     handleGenerate();
//   } else {
//     console.log("editorScene is undefined, skipping generation.");
// }
