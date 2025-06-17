import JSZip from "jszip";
import {
  primitives,
  transforms,
  booleans,
  extrusions,
  modifiers,
} from "@jscad/modeling";
import svgSerializer from "@jscad/svg-serializer";
import { downloadBlob } from "./enclosureFunctions";

const { project } = extrusions;
const { union, subtract } = booleans;
const { cuboid } = primitives;
const { rotate, translate } = transforms;
const { generalize } = modifiers;

export function downloadSVGEnclosure(enclosureDimensions, scene) {
  getSVGBlob();
}

export function getSVGBlob() {
  const jszip = new JSZip();

  const enclosureSides = jszip.folder("sides");

  const allSides = getLaserCutGeo();

  for (const side in allSides) {
    const sideGeo = allSides[side];

    const rawData = svgSerializer.serialize({ unit: "mm" }, sideGeo);

    //in browser (with browserify etc)
    const blob = new Blob(rawData);

    enclosureSides.file(`${side.toString()}.svg`, blob, {});
  }

  jszip.generateAsync({ type: "blob" }).then(function (content) {
    downloadBlob(content, "laser_cut_enclosure.zip");
  });
}

const height = 80;
const width = 100;
const depth = 50;
const thickness = 1;

const layout = true;
/**
 * Create a rounded cuboid with the supplied parameters
 * @param {Number} params.width - The cuboid's width.
 * @param {Number} params.depth - The cuboid's depth.
 * @param {Number} params.height - The cuboid's height.
 * @param {Number} params.rounded - 1 if the cuboid should be rounded, 0 otherwise.
 * @param {Number} params.radius - The cuboid's corner radius.
 * @returns {geometry}
 */
const getLaserCutGeo = () => {
  //return layout? layoutFlat(sides(height, width, depth)) : subtract(renderCube(sides(height, width, depth)), intersections())

  if (layout) {
    const allSides = layoutFlat(sides(height, width, depth));
    for (const side in allSides) {
      const sideGeo = allSides[side];
      allSides[side] = generalize(
        { snap: true, simplify: true, triangulate: true },
        project({ axis: [0, 0, 1] }, sideGeo)
      );
    }
    return allSides;
  } else {
    return subtract(renderCube(sides(height, width, depth)), intersections());
  }
};

const intersections = () => {
  return union(cuboid({ size: [30, 30, 30], center: [50, 40, 40] }));
};

const layoutFlat = (sides) => {
  const downSide = translate([0, 0, 0], subtract(sides.down, intersections()));

  const upSide = translate(
    [0, -width, -depth + thickness * 2],
    subtract(sides.up, intersections())
  );

  const leftSide = translate(
    [height * 2, 0, thickness],
    rotate([-1.5708, -1.5708, 0], subtract(sides.left, intersections()))
  );

  const rightSide = translate(
    [height * 2, -height / 2, width + thickness],
    rotate([1.5708, 1.5708, 0], subtract(sides.right, intersections()))
  );

  const topSide = translate(
    [height * 3.5, 0, 0],
    rotate([-1.5708, 0, 0], subtract(sides.top, intersections()))
  );

  const bottomSide = translate(
    [height * 3.5, -width * 1, height - thickness],
    rotate([-1.5708, 0, 0], subtract(sides.bottom, intersections()))
  );

  return {
    down: downSide,
    up: upSide,
    left: leftSide,
    right: rightSide,
    top: topSide,
    bottom: bottomSide,
  };
};

const sides = (height, width, depth) => {
  const thickness = 1;

  const leftSide = cuboid({
    size: [thickness, height, depth],
    center: [0, height / 2, depth / 2],
  });

  const rightSide = translate(
    [width, 0, 0],
    cuboid({
      size: [thickness, height, depth],
      center: [0, height / 2, depth / 2],
    })
  );

  const upSide = translate(
    [width / 2, height / 2, depth - thickness],
    cuboid({ size: [width + thickness * 2, height, 1], center: [0, 0, 0] })
  );

  const downSide = translate(
    [width / 2, height / 2, thickness],
    cuboid({ size: [width + thickness * 2, height, 1], center: [0, 0, 0] })
  );

  const topSide = rotate(
    [1.5708, 0, 0],
    translate(
      [width / 2, depth / 2, 0],
      cuboid({ size: [width, depth, 1], center: [0, 0, 0] })
    )
  );

  const bottomSide = translate(
    [0, height - thickness, 0],
    rotate(
      [1.5708, 0, 0],
      translate(
        [width / 2, depth / 2, 0],
        cuboid({ size: [width, depth, 1], center: [0, 0, 0] })
      )
    )
  );

  return {
    left: leftSide,
    right: rightSide,
    up: upSide,
    down: downSide,
    top: topSide,
    bottom: bottomSide,
  };
};

const renderCube = (sides) => {
  let cubeToRender = undefined;

  for (const side in sides) {
    const sideGeo = sides[side];

    if (cubeToRender === undefined) {
      cubeToRender = union(sideGeo);
    } else {
      cubeToRender = union(cubeToRender, sideGeo);
    }
  }
  return cubeToRender;
};
