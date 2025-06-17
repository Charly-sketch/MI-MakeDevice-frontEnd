import JSZip from "jszip";
import * as THREE from "three";
import {
  primitives,
  transforms,
  booleans,
  utils,
  extrusions,
  modifiers,
} from "@jscad/modeling";
import { Geom3, Geom2 } from "@jscad/modeling/src/geometries/types";
import stlDeserializer from "@jscad/stl-deserializer";
import stlSerializer from "@jscad/stl-serializer";
import svgSerializer from "@jscad/svg-serializer";
import svgDeserializer from "@jscad/svg-deserializer";
import dxfSerializer from "@jscad/dxf-serializer";

//const { booleans, primitives, transforms, utils } = jscad;
const { union, subtract } = booleans;
const { cylinder, roundedCuboid } = primitives;
const { rotate, rotateX, translate, scale } = transforms;
const { degToRad } = utils;
const { project } = extrusions;
const { generalize } = modifiers;

import { buttonSTL } from "../models/modelExtrusions/button.js";
import { keyswitchSTL } from "../models/modelExtrusions/keyswitch.js";
import { sliderSTL } from "../models/modelExtrusions/slider.js";
import { slider_v2 } from "../models/modelExtrusions/slider_v2";
import { rgbledringSTL } from "../models/modelExtrusions/rgbledring.js";
import { adapter_with_microbit } from "../models/modelExtrusions/adapter_with_microbit.js";
import { rotarySTL } from "../models/modelExtrusions/rotary.js";
import { rotary_v2 } from "../models/modelExtrusions/rotary_v2.js";
import { adapterSTL } from "../models/modelExtrusions/adapter.js";
import { esp32STL } from "../models/modelExtrusions/esp32.js";
import { ultrasonicSTL } from "../models/modelExtrusions/ultrasonic.js";
import { powerSTL } from "../models/modelExtrusions/power.js";
import { REPLICATE_rotary } from "../models/modelExtrusions/REPLICATE_potentiometer_rotary.js";
import { REPLICATE_cherry_mx } from "../models/modelExtrusions/REPLICATE_cherry_mx.js";
import { REPLICATE_neopixel_strip } from "../models/modelExtrusions/REPLICATE_neopixel_strip.js";
import { REPLICATE_tact_button } from "../models/modelExtrusions/REPLICATE_tact_button.js";
import { REPLICATE_slider_15mm } from "../models/modelExtrusions/REPLICATE_slider_15mm.js";
import { collectMountingHoleLocations } from "./editFunctions";
import { rotateZ } from "@jscad/modeling/src/operations/transforms";
import { getModulesFromScene } from "./utilFuncs";
import cuboid from "@jscad/modeling/src/primitives/cuboid.js";
import PressFitBox from "./PressFitBox";
import geom2 from "@jscad/modeling/src/geometries/geom2/index.js";
import path2 from "@jscad/modeling/src/geometries/path2/index.js";

import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { Mesh, MeshBasicMaterial, MeshPhongMaterial } from "three";

export async function addEnclosureToScene(
  enclosureDimensions: any,
  scene: THREE.Scene
) {
  //add enclosure to scene
  let mainGeo: null | THREE.BufferGeometry = null;

  const enclosureBlobs = await getSTLBlob(enclosureDimensions, scene, [
    "3dModel",
    "stencil",
    "lasercutBox",
  ]);

  // // console.log('enclosure blobs in add enc: ', enclosureBlobs)

  const urls = {
    lid: URL.createObjectURL(enclosureBlobs.lid),
    base: URL.createObjectURL(enclosureBlobs.base),
  };

  const stlLoader = new STLLoader();

  stlLoader.load(urls.base, function (geometry) {
    mainGeo = geometry;
    const boxMesh = new Mesh(
      geometry,
      new MeshPhongMaterial({ color: 0x808080 })
    );

    boxMesh.rotateX(THREE.MathUtils.degToRad(-90));

    scene.add(boxMesh);
  });
}

let xSize = 0;
let ySize = 0;
let zSize = 0;

let xPCB = 0;
let yPCB = 0;
let zPCB = 0;

let myScene;

export const sizeBuffer = 16;

const standOffHeight = 12;

function whichModuleSTL(moduleName) {
  moduleName = moduleName.toLowerCase();
  console.log("mod name: ", moduleName);
  if (moduleName.includes("button")) {
    return buttonSTL;
  } else if (moduleName.includes("replicate_slider")) {
    // console.log('returning slider')
    //return sliderSTL
    return REPLICATE_slider_15mm;
  } else if (moduleName.includes("slider")) {
    // console.log('returning slider')
    //return sliderSTL
    return slider_v2;
  } else if (moduleName.includes("rgb led ring")) {
    return rgbledringSTL;
  } else if (moduleName.includes("microbit adapter")) {
    // console.log('adapter w. stl: ')
    // console.log(adapter_with_microbit)
    return adapterSTL;
  } else if (moduleName.includes("adapter")) {
    return adapterSTL;
  } else if (moduleName.includes("key switch")) {
    // console.log('found keyswitch')
    return keyswitchSTL;
  } else if (moduleName.includes("esp32")) {
    // console.log('returnign stl')
    return esp32STL;
  } else if (moduleName.includes("replicate_rotary")) {
    return REPLICATE_rotary;
  } else if (moduleName.includes("rotary")) {
    //   return rotarySTL
    return rotary_v2;
  } else if (moduleName.includes("ultrasonic")) {
    return ultrasonicSTL;
  } else if (moduleName.includes("power")) {
    return powerSTL;
  } else if (moduleName.includes("replicate_cherry")) {
    return REPLICATE_cherry_mx;
  } else if (moduleName.includes("replicate_neopixel_strip")) {
    return REPLICATE_neopixel_strip;
  } else if (moduleName.includes("replicate_tact")) {
    return REPLICATE_tact_button;
  } else {
    // console.log('here')
    return adapter_with_microbit;
  }
}

function deserialiseSTL(moduleName) {
  if (whichModuleSTL(moduleName)) {
    const geometry = stlDeserializer.deserialize(
      {
        filename: "stl",
        addMetaData: true,
        output: "geometry",
      },
      whichModuleSTL(moduleName)
    );
    return geometry;
  } else {
    return undefined;
  }
}

function deserializeSVG(svgStr: string) {
  return svgDeserializer.deserialize({ output: "geometry" }, svgStr);
}

export function importSVG(svgStr: string) {
  const svgGeometry = deserializeSVG(svgStr);

  // console.log('svggeo: ', svgGeometry);

  return svgGeometry;
}

export function moduleStandOffs(scene) {
  const mountingHoleData: any[] = collectMountingHoleLocations(scene);
  const moduleStandOffGeo: Geom3 = union(
    cylinder({ radius: 4, height: zSize / 4 }),
    translate([0, 0, 3], cylinder({ radius: 1.5, height: zSize / 4 }))
  );

  let standOffGeoToReturn: Geom3 | undefined = undefined;

  mountingHoleData.forEach((mountingHole) => {
    const position = mountingHole.mountingHolePosition;

    if (standOffGeoToReturn !== undefined) {
      standOffGeoToReturn = union(
        translate([-position.x, position.z, -zSize / 4], moduleStandOffGeo),
        standOffGeoToReturn
      );
    } else {
      standOffGeoToReturn = translate(
        [-position.x + sizeBuffer, position.z + sizeBuffer, -zSize / 4],
        moduleStandOffGeo
      );
    }
  });

  return standOffGeoToReturn;
}

export function getIntersectingObjects(enclosureLid, scene) {}

export async function downloadSTLEnclosure(
  enclosureDimensions,
  scene?,
  genCarrierPCB?
) {
  const jszip = new JSZip();
  const enclosureSTLs = jszip.folder("enclosure models");

  myScene = scene;

  const plasticStandOffs = true;

  const enclosureBlobs = await getSTLBlob(enclosureDimensions, scene, [
    "3dModel",
    "stencil",
  ]);

  // console.log('ENCLOSURE BLOBS');
  // console.log(enclosureBlobs)

  for (const lidOrBase in enclosureBlobs) {
    if (lidOrBase === "lid") {
      enclosureSTLs!.file("lid.stl", enclosureBlobs[lidOrBase]);
    } else {
      enclosureSTLs!.file("base.stl", enclosureBlobs[lidOrBase]);
    }
  }

  jszip.generateAsync({ type: "blob" }).then(function (content) {
    downloadBlob(content, "Enclosure.zip");
  });
}

export function get3DModel(
  enclosureDimensions,
  scene?,
  enclosureOptions?
): { lid: Geom3; base: Geom3 } {
  const myEnclosure = generate(enclosureDimensions, scene);
  return myEnclosure;
}

export async function getLidSVG(enclosureDimensions, scene) {
  const svgArr = [];

  // console.log('im in getlidsvg');
  const myEnclosure = generate(enclosureDimensions, scene);

  const tabBox = PressFitBox({
    height: xSize, //enclosureDimensions.height,
    width: ySize, // enclosureDimensions.width,
    depth: zSize, //enclosureDimensions.depth,
    tabs: 7,
    thickness: 3,
    backlash: 0.1,
  }) as string;

  const svgGeo = importSVG(tabBox);

  //  const flattenedGeo = translate([0,0,0], project({axis: [0,0,1]}, translate([0,-Math.abs(25+6+6+(sizeBuffer/2)),0], myEnclosure.base)));

  //const flattenedSVG = project({axis: [1,0,0]}, svgGeo);

  /* // console.log('flattenedGeo: ', flattenedGeo);
      // console.log('flattenedSVG: ', flattenedSVG); */

  let geoToCombine;

  // console.log('orig: ', svgGeo[0])
  /* console.log('orig SVG: ', svgSerializer.serialize(
        { unit: 'mm' }, 
        //project({axis: [0,0,1]}, combinedGeo)
        svgGeo[0]
        )) */

  for (let i = 0; i < svgGeo.length; i++) {
    const geo = svgGeo[i];

    let convGeo = geom2.fromPoints(path2.toPoints(geo));

    // convGeo = union(flattenedGeo, convGeo)

    // console.log('scene at the moment: ', scene);

    if (i === 0) {
      convGeo = addComponentApertures2D(scene, convGeo);
    }

    try {
      const svgRes = svgSerializer.serialize(
        { unit: "mm" },
        //project({axis: [0,0,1]}, combinedGeo)
        rotateX(THREE.MathUtils.degToRad(180), convGeo)
      );
      svgArr.push(svgRes);
    } catch {}

    // console.log('in for: ', svgRes);
    // console.log('another try: ', convGeo)

    if (i === 0) {
      geoToCombine = convGeo;
    } else {
      geoToCombine = union(geoToCombine, convGeo);
    }
  }
  /*  svgGeo.forEach(item => {
        // console.log('iteratign svg geo')
        if (geoToCombine === undefined){
            geoToCombine = geom2.fromPoints(path2.toPoints(item));
        } else {
            // console.log('should be 5')
            geoToCombine = union(geoToCombine, geom2.fromPoints(path2.toPoints(item)))
        }
      }) */

  // console.log('geo to combine: ', geoToCombine)

  const combinedGeo = geoToCombine; //union(geoToCombine)

  const rawLidData = svgSerializer.serialize(
    { unit: "mm" },
    //project({axis: [0,0,1]}, combinedGeo)
    combinedGeo
  );

  // console.log('raw lid data', rawLidData);

  // console.log('resulting Array: ', svgArr)

  return svgArr;
}

export async function get2DStencil(
  enclosureDimensions,
  scene?,
  enclosureOptions?
) {
  const myEnclosure = generate(enclosureDimensions, scene);

  const rawLidData = svgSerializer.serialize(
    { unit: "mm" },
    project({ axis: [0, 0, 1] }, myEnclosure.lid)
  );

  return rawLidData;
}

export async function getSTLBlob(
  enclosureDimensions,
  scene?,
  enclosureOptions?
) {
  // console.log('im in getstlblob');
  //getLidSVG(enclosureDimensions, scene)

  const myEnclosure = generate(enclosureDimensions, scene);
  let rawLidData, rawBaseData;

  if (!enclosureOptions) {
    rawLidData = stlSerializer.serialize({ binary: true }, myEnclosure.lid);
    /*   rawLidData = svgSerializer.serialize(
            { unit: 'mm' },
            generalize(
                { snap: true, simplify: true, triangulate: true },
                project({axis: [0,0,1]}, myEnclosure.lid))
        )  */
    rawBaseData = stlSerializer.serialize({ binary: true }, myEnclosure.base);

    // console.log('raw base data: ', rawBaseData)
    // console.log('raw lid data: ', rawLidData)
  } else {
    // console.log('my enclosure');
    // console.log(myEnclosure)
    const exportOptions = enclosureOptions.exportOptions;

    // console.log('heres my format in here');

    rawLidData = stlSerializer.serialize({ binary: false }, myEnclosure.lid);
    /* else if (format.lid.toLowerCase().includes('svg')){
            rawLidData = svgSerializer.serialize(
                { unit: 'mm' },
                generalize(
                    { snap: true, simplify: true, triangulate: true },
                    project({axis: [0,0,1]}, myEnclosure.base))
            )
        } */

    rawBaseData = await stlSerializer.serialize(
      { binary: false },
      myEnclosure.base
    );
    // console.log('got to stl, heres raw base data')
    // console.log(rawBaseData);
    /*  else if (format.base.toLowerCase().includes('svg')){
            rawBaseData = await svgSerializer.serialize(
                { unit: 'mm' },
                generalize(
                    { snap: true, simplify: true, triangulate: true },
                    project({axis: [0,0,1]}, myEnclosure.base)))
            
        } */
  }

  //in browser (with browserify etc)
  const lidBlob = new Blob(rawLidData);
  const baseBlob = new Blob(rawBaseData);

  return {
    lid: lidBlob,
    base: baseBlob,
  };
}

export function downloadBlob(blob, name = "file.txt") {
  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = data;
  link.download = name;

  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
    link.remove();
  }, 100);
}

export const generate = (enclosureDimensions?, scene?, pcbDimensions?) => {
  xSize = enclosureDimensions.height + sizeBuffer;
  ySize = enclosureDimensions.width + sizeBuffer;
  zSize = enclosureDimensions.depth; //+ sizeBuffer;

  if (!pcbDimensions) {
    xPCB = xSize;
    yPCB = ySize;
    zPCB = zSize;
  } else {
    xPCB = pcbDimensions.x;
    yPCB = pcbDimensions.y;
    zPCB = pcbDimensions.z;
  }

  return {
    lid: rotateZ(
      degToRad(90),
      union(
        translate(
          [0, -ySize * 1.1, 0],
          rotateX(
            degToRad(180),
            addComponentApertures(scene, enclosureTop(scene))
          )
        )
      )
    ),
    base: rotateZ(
      degToRad(180),
      union(addComponentApertures(scene, enclosureBottom(scene)))
    ),
  };
};

const mounts = (x, y) => {
  x = xSize + sizeBuffer / 2;
  y = ySize + sizeBuffer / 2;
  // divide to get 0 in center
  x /= 2;
  y /= 2;
  const tempSizeBuffer = sizeBuffer / 2 + 6;
  return union(
    standOff(x - tempSizeBuffer, y - tempSizeBuffer),
    standOff(x - tempSizeBuffer, -y + tempSizeBuffer),
    standOff(-x + tempSizeBuffer, y - tempSizeBuffer),
    standOff(-x + tempSizeBuffer, -y + tempSizeBuffer)
  );
};

const standOff = (x, y, d?) => {
  const standOffRadius = d ? d : 4;

  // console.log('putting stand off at: ', [x, y, ((standOffHeight))])
  return translate(
    [x, y, -standOffHeight],
    subtract(
      cylinder({ radius: standOffRadius, height: standOffHeight }),

      cylinder({ radius: 1.7, height: standOffHeight + zSize / 10 })
    )
  );
};

const enclosureShape = () => {
  // console.log([xSize,ySize,zSize])
  return roundedCuboid({ size: [xSize, ySize, zSize], roundRadius: 3 });
};

const enclosureBottom = (scene): Geom3 => {
  // let e = enclosure();
  const cutFraction = 0.25;
  const chopper = translate(
    [-xSize, -ySize, zSize * cutFraction],
    cuboid({
      size: [xSize * 2, ySize * 2, zSize * 2],
      center: [(xSize * 2) / 2, (ySize * 2) / 2, (zSize * 2) / 2],
      //roundRadius: 5,
    })
  );
  const outer = subtract(enclosure(), chopper);

  const standOffs = moduleStandOffs(scene);
  // console.log('stand offs: ', standOffs)

  const inner = subtract(enclosure(0.98), translate([0, 0, 3], chopper));

  const enclosureBottom = union(outer, inner, mounts(xSize, ySize));

  const returnMe = enclosureBottom; //union(standOffs as Geom3, enclosureBottom)

  return returnMe;
  // return addComponentApertures(scene, enclosureBottom);
};

const enclosure = (wallThickness?): Geom3 => {
  wallThickness = wallThickness || 0.93;
  const e = enclosureShape();
  const c = cuboid({ size: [xSize, ySize, zSize] });

  const cavity = scale([wallThickness, wallThickness, wallThickness], c);
  //const cavity = cuboid({size: [xSize-wallThickness/2, ySize-wallThickness/2, zSize-wallThickness/2]})
  // const cavity = roundedCuboid({size: [xSize-wallThickness, ySize-wallThickness, zSize-(wallThickness)], center: [0,0,0], roundRadius: 2, segments: 32 })

  return subtract(e, cavity);
};

// top is
const enclosureTop = (scene): Geom3 => {
  const enclosureTop = subtract(enclosure(), enclosureBottom(scene));
  //return addComponentApertures(scene, enclosureTop)
  return enclosureTop;
};

const addComponentApertures2D = (scene: THREE.Scene, enclosure: Geom2) => {
  // console.log('scen atm: ', scene)

  const componentLocations = getModulesFromScene(scene);

  scene.traverse((obj) => {
    if (obj.userData.isModule) {
      const moduleName = obj.userData.name;

      const position = obj.parent.position;
      const rotation = obj.rotation;

      componentLocations.push({
        position: JSON.parse(JSON.stringify(position)),
        rotation: JSON.parse(JSON.stringify(rotation)),
        moduleName: moduleName,
      });
    }
  });

  let geomToReturn = enclosure;

  /* console.log('enc in 2d: ', svgSerializer.serialize(
        { unit: 'mm' }, 
        //project({axis: [0,0,1]}, combinedGeo)
        geomToReturn
        )) */

  componentLocations.forEach((component) => {
    // console.log('rdding component: ', component)
    if (deserialiseSTL(component.moduleName)) {
      geomToReturn = union(
        //subtract
        geomToReturn,
        translate(
          [
            Math.abs(ySize / 2 + 0 + sizeBuffer / 2),
            -Math.abs(xSize / 2 + 0 + sizeBuffer / 2),
            0,
          ],

          translate(
            [
              component.position.z,
              component.position.x,
              0 /*  -(standOffHeight-component.position.y) */,
            ],
            rotate(
              [
                component.rotation._z,
                component.rotation._x,
                component.rotation._y - 1.5708 * 1,
              ],
              project({ axis: [0, 0, 1] }, deserialiseSTL(component.moduleName))
            )
          )
        )
      );
    }
  });

  /* console.log('returning: ', svgSerializer.serialize(
        { unit: 'mm' }, 
        //project({axis: [0,0,1]}, combinedGeo)
        geomToReturn
        )) */
  return geomToReturn;
};

const addComponentApertures = (scene, enclosureTop): Geom3 => {
  const componentLocations = getModulesFromScene(scene); //[]

  scene.traverse((obj) => {
    if (obj.userData.isModule) {
      const moduleName = obj.userData.name;

      const position = obj.parent.position;
      const rotation = obj.rotation;

      componentLocations.push({
        position: JSON.parse(JSON.stringify(position)),
        rotation: JSON.parse(JSON.stringify(rotation)),
        moduleName: moduleName,
      });
    }
  });

  let geomToReturn = enclosureTop;

  //if (componentLocations.length> 0){

  componentLocations.forEach((component) => {
    // console.log('rdding component: ', component)
    if (deserialiseSTL(component.moduleName)) {
      geomToReturn = subtract(
        //subtract
        geomToReturn,
        translate(
          [
            -component.position.x,
            component.position.z,
            -(standOffHeight - component.position.y),
          ],
          rotate(
            [
              component.rotation._z,
              component.rotation._x,
              component.rotation._y - 1.5708 * 2,
            ],
            // scale(
            //   [1000, 1000, 1000],
            deserialiseSTL(component.moduleName)
            //   )
          )
        )
      );
    }
  });

  return geomToReturn;
};
