import { BP2D } from "binpackingjs";
import { getModuleInfo, route } from "./editFunctions";
const { Bin, Box, Packer } = BP2D;

// have 2mm gap between autoplaced modules
const SIZE_BUFFER = 2;

export function arrange(scene) {
  const bin_1 = new Bin(100, 100);
  const boxes = [
    new Box(14, 10), // Should be added last (smaller)
    new Box(50, 44), // Fits in bin_2 better than in bin_1
    new Box(40, 40),
  ];
  const packer = new Packer([bin_1]);
  const packed_boxes = packer.pack(boxes);

  // console.log('packed boxes: ', packed_boxes);

  // console.log('scene in arrange: ', scene)

  let moduleInfo = getModuleInfo(scene);
  moduleInfo = moduleInfo.sort((a, b) => {
    b.size.x * b.size.y - a.size.x * a.size.y;
  });
  // console.log('mod info: ', moduleInfo);

  const range = [moduleInfo.length * 10, moduleInfo.length * 50];
  // see which size is smallest
  let myPacks: any[] = [];
  let myBins: any[] = [];

  for (let i = range[0]; i <= range[1]; i += 6) {
    for (let j = range[0]; j <= range[1]; j += 6) {
      const myBoxes = createBoxesArray(moduleInfo);
      //// console.log('my boxes: ', myBoxes);

      const myBin = generateBin(i, j);
      myBins.push(myBin);
      //// console.log('bins: ', myBin);
      const myPacker = new Packer(myBin);
      let packed = myPacker.pack(myBoxes);
      myPacks.push(packed);
      //// console.log('packer: ', myPacker.pack(myBoxes))
    }
  }

  // console.log('myPacked: ', myPacks);
  // console.log('myBins: ', myBins)

  let layout = undefined;
  let newWidth = 96;
  let newHeight = 96;

  for (let b = 0; b < myBins.length; b++) {
    const binToCheck = myBins[b][0];

    if (binToCheck.boxes.length === moduleInfo.length) {
      // console.log('found it');
      layout = binToCheck;
      newWidth = binToCheck.width;
      if (newWidth % 2 > 0) {
        newWidth += 1;
      }

      newHeight = binToCheck.height;
      if (newHeight % 2 > 0) {
        newHeight += 1;
      }
      break;
    }
  }

  let traces;
  let dimensions;
  if (layout !== undefined) {
    traces = layoutModules(layout, scene);
    dimensions = { width: newWidth, height: newHeight };
  }

  return { traces: traces, dimensions: dimensions };
}

function layoutModules(layout, scene) {
  let traces;

  let pcbHeight = layout.height;
  let pcbWidth = layout.width;

  layout.boxes.forEach((box) => {
    scene.traverse((obj) => {
      if (obj.uuid.toString() === box.id) {
        // console.log('found a match')

        /*    if ((box.x % 2) > 0){
                    box.x+=1;
                }
                if ((box.y % 2) > 0){
                    box.y+=1;
                } */

        obj.position.x = box.y + box.height / 2 - pcbHeight / 2;
        obj.position.z = box.x + box.width / 2 - pcbWidth / 2;

        //traces = route(scene);
      }
    });
  });

  return traces;
}

function createBoxesArray(moduleInfo) {
  const boxes: any[] = [];

  moduleInfo.forEach((module) => {
    let boxToPush = new Box(
      (Math.round(module.size.z) + SIZE_BUFFER) as number,
      (Math.round(module.size.x) + SIZE_BUFFER) as number,
    );

    boxToPush.constrainRotation = true;

    boxToPush.id = module.id;

    boxes.push(boxToPush);
  });
  return boxes;
}

function generateBin(x?, y?) {
  let bin = [new Bin(x ? x : 20, y ? y : 20)];

  return bin;
}

function sizeSort(a, b) {
  if (a.size.x * a.y < b.size.x * b.size.y) return -1;
  if (a.size.x * b.size.x > b.size.x * b.size.y) return 1;
  return 0;
}
