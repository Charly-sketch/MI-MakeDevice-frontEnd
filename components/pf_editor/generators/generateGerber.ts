// @ts-nocheck
import JSZip from "jszip";
import {
  collectMountingHoleLocations,
  getModuleLocations,
} from "../editFunctions";
import { downloadBlob } from "../enclosureFunctions";
import generateSVG from "./generateSVG";
import { sendLocationData } from "../gerbonara";

//;Layer_Color=9474304
//;TYPE=NON_PLATED

/* ALL HEADERS FOR GERBER FILES */
let pointCount = 0;

const cornerDrillOffset = 3;
let cornerDrills;

const drillFileHeader = `M48
;FILE_FORMAT=3:5
;METRIC
;TYPE=PLATED
T1F00S00C3.10000
M95
G05
T01\n`;

const drillEOF = `M30`;

let gerberStr;

const boardOutlineHeader = `G04*
%FSAX25Y25*%
%MOMM*%
G71*
G01*
G75*
G04 Define outline aperture*
%ADD10C,0.2*%
`;
const gerberEOF = `\nM02*`;

let outlineStr = ``;

const tracesHeader = `G04*
%FSAX25Y25*%
%MOMM*%
G71*
G01*
G75*
%ADD10C,0.3*%
%ADD11C,5.0X3.1*%
G04 start trace generation*
D10*
`;

let traceStr = ``;

const bottomCopperHeader = `G04*
%FSAX25Y25*%
%MOMM*%
G71*
G01*
G75*
%ADD10C,0.3*%
%ADD11C,5.0X3.1*%
%AMTHERMAL80*
7,0,0,5.100,3.100,0.500,45*%
%ADD12THERMAL80*%
%ADD13C,6.5X5.0*%
%ADD14C,1.0*%
G04 start trace generation*
D11*
`;

let bottomCopperStr = ``;

const topSoldermaskHeader = `G04*
G04 #@! TF.FilePolarity,Negative*
%FSAX25Y25*%
%MOMM*%
G71*
G01*
G75*
G04 Define outline aperture*
%ADD10C,0.3*%
%ADD11C,5.0X3.1*%
%ADD14C,3.1*%`;

let topSoldermaskStr = ``;

const bottomSoldermaskHeader = `G04*
G04 #@! TF.FilePolarity,Positive*
%FSAX25Y25*%
%MOMM*%
G71*
G01*
G75*
G04 Define outline aperture*
%ADD10C,0.3*%
%ADD11C,5.0X3.1*%
%ADD14C,3.1*%`;

let bottomSoldermaskStr = ``;

export function saveScene(scene) {
  const scenejson = JSON.stringify(getModuleLocations(scene));

  let zip = new JSZip();

  let gerberFolder = zip.folder("MakeDevice Scene");

  gerberFolder.file("Scene.json", scenejson);

  zip.generateAsync({ type: "blob" }).then(function (content) {
    // sendGerberFile(content);
    downloadBlob(content, "MakeDevice Scene.zip");
  });
}

export function generateGerber(scene, traces, pcbDimensions) {
  generateSVG(scene, traces, pcbDimensions);
  const pcbHeight = pcbDimensions.height;
  const pcbWidth = pcbDimensions.width;
  cornerDrills = {
    power: [[pcbHeight - cornerDrillOffset, pcbWidth - cornerDrillOffset]],
    data: [[pcbHeight - cornerDrillOffset, cornerDrillOffset]],
    ground: [
      [cornerDrillOffset, cornerDrillOffset],
      [cornerDrillOffset, pcbWidth - cornerDrillOffset],
    ],
  };

  const mhLocations = collectMountingHoleLocations(scene);
  //// console.log(allLines)
  generateDrillFiles(mhLocations, pcbDimensions.height, pcbDimensions.width);
  //  download('PF_NC_Drill_MHs.TXT', gerberStr);

  generateTopSoldermask(mhLocations, pcbDimensions.height, pcbDimensions.width);
  //  download('PF_Soldermask_Top.GTS', topSoldermaskStr);

  generateBottomSoldermask(
    mhLocations,
    pcbDimensions.height,
    pcbDimensions.width
  );
  //  download('PF_Soldermask_Bottom.GBS', bottomSoldermaskStr);

  generateTopCopper(
    traces,
    mhLocations,
    pcbDimensions.height,
    pcbDimensions.width
  );
  //  download('PF_Top_Copper.GTL', traceStr);

  generateBottomCopper(mhLocations, pcbDimensions.height, pcbDimensions.width);
  //   download('PF_Bottom_Copper.GBL', bottomCopperStr);

  generateBoardOutline(pcbDimensions.height, pcbDimensions.width);
  //  download('PF_BoardOutline.GKO', outlineStr);

  let zip = new JSZip();

  let gerberFolder = zip.folder("Gerber/MC Drill");

  gerberFolder.file("PF_NC_Drill_MHs.TXT", gerberStr);
  gerberFolder.file("PF_Soldermask_Top.GTS", topSoldermaskStr);
  gerberFolder.file("PF_Soldermask_Bottom.GBS", bottomSoldermaskStr);
  gerberFolder.file("PF_Top_Copper.GTL", traceStr);
  gerberFolder.file("PF_Bottom_Copper.GBL", bottomCopperStr);
  gerberFolder.file("PF_BoardOutline.GKO", outlineStr);

  zip.generateAsync({ type: "blob" }).then(function (content) {
    // sendGerberFile(content);
    downloadBlob(content, "Gerber/MC Drill.zip");
  });

  zip.generateAsync({ type: "base64" }).then(function (content) {
    sendLocationData(scene);
    console.log("generating base64 string...");
    //console.log(content);
    //downloadBlob(content, "Gerber/MC Drill.zip");
  });
}

export function generateDrillFiles(mountingHoleBboxes, pcbHeight, pcbWidth) {
  const drillPositions = [];

  // add bottom left
  // ground
  drillPositions.push([cornerDrillOffset, cornerDrillOffset]);

  /*  cornerDrills.ground = [
        [cornerDrillOffset, cornerDrillOffset],
        [cornerDrillOffset, 
            pcbWidth-cornerDrillOffset]
    ] */

  // data
  drillPositions.push([pcbHeight - cornerDrillOffset, cornerDrillOffset]);

  /*  cornerDrills.data = [
        [ pcbHeight - cornerDrillOffset, 
            cornerDrillOffset]
    ] */
  // power
  drillPositions.push([
    pcbHeight - cornerDrillOffset,
    pcbWidth - cornerDrillOffset,
  ]);

  /*  cornerDrills.power = [
        [ pcbHeight - cornerDrillOffset, 
            pcbWidth - cornerDrillOffset]
    ] */

  // ground
  drillPositions.push([cornerDrillOffset, pcbWidth - cornerDrillOffset]);

  cornerDrills = JSON.parse(JSON.stringify(drillPositions));

  mountingHoleBboxes.forEach((bbox) => {
    const drillPos = [
      bbox.mountingHolePosition.x + pcbHeight / 2,
      bbox.mountingHolePosition.z + pcbWidth / 2,
    ];
    drillPositions.push(drillPos);
  });

  // console.log(drillPositions);

  gerberStr = ``;
  gerberStr += drillFileHeader;

  drillPositions.forEach((drillPos) => {
    const drillX = parseInt(drillPos[0].toFixed(5).replace(".", ""));
    const drillY = parseInt(drillPos[1].toFixed(5).replace(".", ""));

    let drillStr = ``;

    drillStr += `X${drillX}`;
    drillStr += `Y-${drillY}\n`;

    // console.log('adding drill hole')
    // console.log(drillStr);
    gerberStr += drillStr;
  });

  gerberStr += "\n";
  gerberStr += drillEOF;
  // console.log(gerberStr);

  //drillStr = gerberStr;

  // download('PF_NC_Drill_MHs.TXT', gerberStr);
}

export function generateTopSoldermask(mountingHoleBboxes, pcbHeight, pcbWidth) {
  topSoldermaskStr = ``;

  topSoldermaskStr += topSoldermaskHeader;

  //Fill the board area with solder mask
  let width = parseFloat(pcbWidth);
  let height = parseFloat(pcbHeight);
  // console.log(width);
  // console.log(height);
  width = parseInt(width.toFixed(5).replace(".", ""));
  height = parseInt(height.toFixed(5).replace(".", ""));

  topSoldermaskStr += `G04 Start Trace*
    %LPC*%
    D10*
    X0Y0D02*
    G36*
    X0000000Y-${height}D01*
    X${width}Y-${height}D01*
    X${width}Y-0000000D01*
    X0000000Y-0000000D01*
    G37* \n`;

  topSoldermaskStr += `%LPD*%
    D11*\n`;

  let drillPositions = [];
  drillPositions = drillPositions.concat([
    [pcbHeight - cornerDrillOffset, pcbWidth - cornerDrillOffset],

    [pcbHeight - cornerDrillOffset, cornerDrillOffset],

    [cornerDrillOffset, cornerDrillOffset],

    [cornerDrillOffset, pcbWidth - cornerDrillOffset],
  ]);

  //clear polarity over mounting hole apertures
  mountingHoleBboxes.forEach((bbox) => {
    //let centVec = new THREE.Vector3();

    // let drillPos = [(centVec.x + (window.pcbWidth / 2)), (centVec.z + (window.pcbHeight / 2))];
    const drillPos = [
      bbox.mountingHolePosition.x + pcbHeight / 2,
      bbox.mountingHolePosition.z + pcbWidth / 2,
    ];

    drillPositions.push(drillPos);
  });

  drillPositions.forEach((drillPos) => {
    const drillX = parseFloat(drillPos[0]).toFixed(5).replace(".", "");
    const drillY = parseFloat(drillPos[1]).toFixed(5).replace(".", "");

    // console.log(drillX);
    // console.log(drillY);

    let drillStr = ``;

    drillStr += `X${drillX}`;
    drillStr += `Y-${drillY}D03*\n`;

    topSoldermaskStr += drillStr;
  });

  topSoldermaskStr += gerberEOF;
}

export function generateBottomSoldermask(
  mountingHoleBboxes,
  pcbHeight,
  pcbWidth
) {
  bottomSoldermaskStr = ``;

  bottomSoldermaskStr += bottomSoldermaskHeader;

  //Fill the board area with solder mask
  let width = parseFloat(pcbWidth);
  let height = parseFloat(pcbHeight);
  // console.log(width);
  // console.log(height);
  width = parseInt(width.toFixed(5).replace(".", ""));
  height = parseInt(height.toFixed(5).replace(".", ""));

  bottomSoldermaskStr += ""; /* `G04 Start Trace*
    %LPD*%
    D10*
    X0Y0D02*
    G36*
    X0000000Y-${height}D01*
    X${width}Y-${height}D01*
    X${width}Y-0000000D01*
    X0000000Y-0000000D01*
    G37* \n`   */

  bottomSoldermaskStr += `%LPD*%
    D11*\n`;

  //const drillPositions = [];
  let drillPositions = [];
  drillPositions = drillPositions.concat([
    [pcbHeight - cornerDrillOffset, pcbWidth - cornerDrillOffset],

    [pcbHeight - cornerDrillOffset, cornerDrillOffset],

    [cornerDrillOffset, cornerDrillOffset],

    [cornerDrillOffset, pcbWidth - cornerDrillOffset],
  ]);

  // // console.log(mountingHoleBboxes);
  mountingHoleBboxes.forEach((bbox) => {
    /*  let centVec = new THREE.Vector3();

        bbox.box.getCenter(centVec); */

    const drillPos = [
      bbox.mountingHolePosition.x + pcbHeight / 2,
      bbox.mountingHolePosition.z + pcbWidth / 2,
    ];

    drillPositions.push(drillPos);
  });

  // console.log(drillPositions);
  drillPositions.forEach((drillPos) => {
    const drillX = parseFloat(drillPos[0]).toFixed(5).replace(".", "");
    const drillY = parseFloat(drillPos[1]).toFixed(5).replace(".", "");

    // console.log(drillX);
    // console.log(drillY);

    let drillStr = ``;

    drillStr += `X${drillX}`;
    drillStr += `Y-${drillY}D03*\n`;

    bottomSoldermaskStr += drillStr;
  });

  const offsetStr = ``; /* `D14*
    %LPD*%
    X0100000Y-0000000D02*
    G01*
    X${width - 100000}Y-0000000D01*
    G02X${width}Y-0100000I-0000000J-0100000*
    G01*
    X${width}Y-${height-100000}*
    G02X${width-100000}Y-${height}I-0100000J0000000*
    G01*
    X0100000Y-${height}D01*
    G02X0000000Y-${height-100000}I0000000J0100000*
    G01*
    X0000000Y-0100000D01*
    G02X0100000Y-0000000I0100000J0000000*
    G74*`  */

  bottomSoldermaskStr += offsetStr;

  bottomSoldermaskStr += gerberEOF;
}

export function generateBoardOutline(pcbWidth, pcbHeight) {
  outlineStr = ``;

  const width = parseFloat(pcbWidth);
  const height = parseFloat(pcbHeight);

  outlineStr += boardOutlineHeader;

  outlineStr += `G04 Start Trace*
%LPD*%
D10*
X0100000Y-0000000D02*
G01*
X${(width - 1).toFixed(5).replace(".", "")}Y-0000000D01*
G02X${width.toFixed(5).replace(".", "")}Y-0100000D01*
G01*
X${width.toFixed(5).replace(".", "")}Y-${(height - 1.0)
    .toFixed(5)
    .replace(".", "")}D01*
G02X${(width - 1).toFixed(5).replace(".", "")}Y-${height
    .toFixed(5)
    .replace(".", "")}D01*
G01*
X0100000Y-${height.toFixed(5).replace(".", "")}D01*
G02X0000000Y-${(height - 1).toFixed(5).replace(".", "")}D01*
G01*
X0000000Y-0100000D01*
G02X0100000Y-0000000*
G74*
M02*
`;

  outlineStr += gerberEOF;

  // console.log(`OUTLINE STRING \n ${outlineStr}`);
}

//GTL
export function generateTopCopper(
  allLines,
  mountingHoleBboxes,
  pcbHeight,
  pcbWidth
) {
  // console.log('allLines: ')
  // console.log(allLines)
  const powerLines = allLines.power;
  const dataLines = allLines.data;

  traceStr = ``; //reset output

  traceStr += tracesHeader;

  //power lines first
  powerLines.forEach((line) => {
    // console.log('LINE');
    // console.log(line);
    pointCount = 0;
    line.forEach((point) => {
      let pointToAdd = ``;
      //check if point[0] (x) is less than 10

      if (point[0] < 10) {
        pointToAdd += `X0${point[0]}00000`;
      } else {
        pointToAdd += `X${point[0]}00000`;
      }

      if (point[1] < 10) {
        pointToAdd += `Y-0${point[1]}00000D01*\n`;
      } else {
        pointToAdd += `Y-${point[1]}00000D01*\n`;
      }

      if (pointCount === 0) {
        //traceStr += pointToAdd.splice(pointToAdd.length - 3) + ``
        // console.log('FIRST POINT');
        //  // console.log(pointToAdd.slice(0, -3).concat(`2*\n`));
        traceStr += pointToAdd.slice(0, -3).concat(`2*\n`);
      }
      traceStr += pointToAdd;

      pointCount++;
    });
  });

  dataLines.forEach((line) => {
    // console.log('LINE');
    // console.log(line);
    pointCount = 0;
    line.forEach((point) => {
      let pointToAdd = ``;
      //check if point[0] (x) is less than 10

      if (point[0] < 10) {
        pointToAdd += `X0${point[0]}00000`;
      } else {
        pointToAdd += `X${point[0]}00000`;
      }

      if (point[1] < 10) {
        pointToAdd += `Y-0${point[1]}00000D01*\n`;
      } else {
        pointToAdd += `Y-${point[1]}00000D01*\n`;
      }

      if (pointCount === 0) {
        //traceStr += pointToAdd.splice(pointToAdd.length - 3) + ``
        // console.log('FIRST POINT');
        //  // console.log(pointToAdd.slice(0, -3).concat(`2*\n`));
        traceStr += pointToAdd.slice(0, -3).concat(`2*\n`);
      }
      traceStr += pointToAdd;

      pointCount++;
    });
  });

  //ADD COPPER PADS TO MOUNTING HOLES
  const drillPositions = [];
  // add bottom left
  drillPositions.push([cornerDrillOffset, cornerDrillOffset]);

  drillPositions.push([pcbHeight - cornerDrillOffset, cornerDrillOffset]);

  drillPositions.push([
    pcbHeight - cornerDrillOffset,
    pcbWidth - cornerDrillOffset,
  ]);

  drillPositions.push([cornerDrillOffset, pcbWidth - cornerDrillOffset]);
  mountingHoleBboxes.forEach((bbox) => {
    const drillPos = [
      bbox.mountingHolePosition.x + pcbHeight / 2,
      bbox.mountingHolePosition.z + pcbWidth / 2,
    ];

    drillPositions.push(drillPos);
  });
  // console.log('IM HERE');
  // console.log(drillPositions);

  traceStr += `D11*\n`; //select moutning hole aperture

  drillPositions.forEach((drillPos) => {
    const drillX = parseFloat(drillPos[0]).toFixed(5).replace(".", "");
    const drillY = parseFloat(drillPos[1]).toFixed(5).replace(".", "");

    // console.log(drillX);
    // console.log(drillY);

    let drillStr = ``;
    /* 
        if (drillPos[0] < 1){
            drillStr += `X00${drillX}`
        } else if (drillPos[0] < 10){
            drillStr += `X0${drillX}0`
        } else if (drillPos[0] > 10){
            drillStr += `X${drillX}`
        }

        if (drillPos[1] < 1){
            drillStr += `Y00${drillY}D03*\n`
        } else if (drillPos[1] < 10){
            drillStr += `Y0${drillY}0D03*\n`
        } else if (drillPos[1] > 10){
            drillStr += `Y${drillY}D03*\n`
        }  */

    drillStr += `X${drillX}`;
    drillStr += `Y-${drillY}D03*\n`;

    traceStr += drillStr;
  });

  traceStr += gerberEOF;
}

export function generateBottomCopper(mountingHoleBboxes, pcbHeight, pcbWidth) {
  let width = parseFloat(pcbWidth);
  let height = parseFloat(pcbHeight);
  // console.log(width);
  // console.log(height);
  width = parseInt(width.toFixed(5).replace(".", ""));
  height = parseInt(height.toFixed(5).replace(".", ""));

  const drillPositions = [];

  mountingHoleBboxes.forEach((bbox) => {
    const drillPos = [
      bbox.mountingHolePosition.x + pcbHeight / 2,
      bbox.mountingHolePosition.z + pcbWidth / 2,
    ];

    drillPositions.push(drillPos);
  });

  bottomCopperStr = ``;
  bottomCopperStr += bottomCopperHeader;

  bottomCopperStr += `G04 Start Trace*
%LPD*%
D10*
X0Y0D02*
G36*
X0000000Y${-width}D01*
X${height}Y${-width}D01*
X${height}Y0000000D01*
X0000000Y0000000D01*
G37* 
D11*
%LPC*%\n`;

  drillPositions.forEach((drillPos) => {
    const drillX = parseFloat(drillPos[0]).toFixed(5).replace(".", "");
    const drillY = parseFloat(drillPos[1]).toFixed(5).replace(".", "");

    //  The - is the mounting hole aperture + circle line thickness

    const drillXOffset = parseFloat(drillPos[0] - 1.7)
      .toFixed(5)
      .replace(".", "");
    const drillYOffset = parseFloat(drillPos[1] - 1.7)
      .toFixed(5)
      .replace(".", "");

    // console.log(drillX);
    // console.log(drillY);

    let drillStr = ``;

    drillStr += `%LPD*%\n
        D11*\n`;

    drillStr += `X${drillX}`;
    drillStr += `Y-${drillY}D03*`;

    bottomCopperStr += drillStr;
  });

  //place thermal ties on ground mounting holes
  bottomCopperStr += `D12*\n`; //switch to thermal primitive
  //bottomCopperStr += `G04 my thermal ties* \n`

  let thermalTiePositions = [];
  let nonGNDMHs = [];

  mountingHoleBboxes.forEach((bbox) => {
    if (bbox.mountingHoleNet.toLowerCase().includes("gnd")) {
      thermalTiePositions.push([
        bbox.mountingHolePosition.x + pcbHeight / 2,
        bbox.mountingHolePosition.z + pcbWidth / 2,
      ]);
    } else {
      nonGNDMHs.push([
        bbox.mountingHolePosition.x + pcbHeight / 2,
        bbox.mountingHolePosition.z + pcbWidth / 2,
      ]);
    }
  });

  // console.log('corner drills')
  // console.log(cornerDrills)

  nonGNDMHs = nonGNDMHs.concat([
    [pcbHeight - cornerDrillOffset, pcbWidth - cornerDrillOffset],
  ]);
  nonGNDMHs = nonGNDMHs.concat([
    [pcbHeight - cornerDrillOffset, cornerDrillOffset],
  ]);

  // console.log('nonGNDMHs: ', nonGNDMHs)

  thermalTiePositions = thermalTiePositions.concat([
    [cornerDrillOffset, cornerDrillOffset],
    [cornerDrillOffset, pcbWidth - cornerDrillOffset],
  ]);

  // console.log('thermalTiePositions: ', thermalTiePositions)

  thermalTiePositions.forEach((thermPos) => {
    const thermX = parseFloat(thermPos[0]).toFixed(5).replace(".", "");
    const thermY = parseFloat(thermPos[1]).toFixed(5).replace(".", "");

    let thermStr = ``;
    thermStr += `%LPC*%\n`;
    thermStr += `X${thermX}`;
    thermStr += `Y-${thermY}D03*\n`;

    bottomCopperStr += thermStr;

    // console.log('im a thermal tie')
  });

  nonGNDMHs.forEach((nonGNDHole) => {
    const holeX = parseFloat(nonGNDHole[0]).toFixed(5).replace(".", "");
    const holeY = parseFloat(nonGNDHole[1]).toFixed(5).replace(".", "");

    let holeStr = ``;

    holeStr += `%LPC*%\n
        D13*\n`;

    holeStr += `X${holeX}`;
    holeStr += `Y-${holeY}D03*\n`;

    holeStr += `G75*\n
                G03*\n`;

    bottomCopperStr += holeStr;
  });

  // console.log('THIS IS THE BOTTOM COPPER');
  // console.log(bottomCopperStr);

  //Add offset around edge of board

  const offset = 200000; //offset in mm for cut out in bottom copper fill

  const offsetStr = `D14*
    %LPC*%
    X0100000Y-0000000D02*
    G01*
    X${height - 100000}Y-0000000D01*
    G02X${height}Y-0100000I0000000J-0100000*
    G01*
    X${height}Y-${width - 100000}D01*
    G02X${height - 100000}Y-${width}I-0100000J0000000D01*
    G01*
    X0100000Y-${width}D01*
    G02X0000000Y-${width - 100000}I0000000J0100000D01*
    G01*
    X0000000Y-0100000D01*
    G02X0100000Y-0000000I0100000J0000000D01*
    G74*`;

  bottomCopperStr += offsetStr;

  bottomCopperStr += gerberEOF;
}

export function download(filename, text) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
