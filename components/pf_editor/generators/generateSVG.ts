import {SVG} from "@svgdotjs/svg.js"
import { collectMountingHoleLocations } from "../editFunctions";


const cornerDrillOffset = 3;

export default function generateSVG(scene, traces, pcbDimensions){


    /*  var canvas = SVG('drawing').size('100%', '100%').viewbox(0,0,800,1000)
        canvas.setAttribute('id', 'svgCanvas');

        // console.log('SVG: ', generateSVG)
        
    // let svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'SVG');


        let draw = SVG().addTo('svgCanvas').size('100%','100%');

        // add a green rect for pcb space
        const pcbRect = draw.rect(pcbDimensions.width, pcbDimensions.height);

        // add mounting holes in each corner
        const outerVia = draw.ellipse(6,6);
        const innerVia = draw.ellipse(3,3);

        //add traces 
        const copperTraces = svgCopperTraces(traces);
    */

    const pcbHeight = pcbDimensions.height;
    const pcbWidth = pcbDimensions.width;





    const rootSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    rootSVG.setAttribute('id', 'svgCanvas');
    rootSVG.setAttribute('width', '100%');
    rootSVG.setAttribute('height', '100%');
    rootSVG.setAttribute('viewBox', '0 0 200 200');

    const baseGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    baseGroup.setAttribute('id', 'baseGroup');
    rootSVG.appendChild(baseGroup);
    baseGroup.setAttribute('transform', `rotate(-90) translate(-${pcbWidth}, 0)`)

    const pcbRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    pcbRect.setAttribute('width', pcbDimensions.width);
    pcbRect.setAttribute('height', pcbDimensions.height);
    pcbRect.setAttribute('fill', 'green');
    pcbRect.setAttribute('stroke', 'black');
    pcbRect.setAttribute('stroke-width', '1');

    // append rect to svg
    baseGroup.appendChild(pcbRect);
    

    const cornerDrills = 
    [
        [cornerDrillOffset, cornerDrillOffset],
        
        [ pcbHeight - cornerDrillOffset, 
            cornerDrillOffset],

        [ pcbHeight - cornerDrillOffset, 
            pcbWidth - cornerDrillOffset],

        [cornerDrillOffset, 
            pcbWidth-cornerDrillOffset],
    ]

    // add mounting holes in each corner
    const outerVia = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    outerVia.setAttribute('rx', '3');
    outerVia.setAttribute('ry', '3');
    outerVia.setAttribute('fill', 'black'); 

    const innerVia = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    innerVia.setAttribute('rx', '1.5');
    innerVia.setAttribute('ry', '1.5');
    innerVia.setAttribute('fill', 'white');

    const via = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    via.appendChild(outerVia);
    via.appendChild(innerVia);
    via.setAttribute('id', 'via');

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.appendChild(via);
    baseGroup.appendChild(defs);

    cornerDrills.forEach(corner => {
        const viaClone = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        viaClone.setAttribute('href', '#via');
        viaClone.setAttribute('x', corner[0].toString());
        viaClone.setAttribute('y', corner[1].toString());
        baseGroup.appendChild(viaClone);
    });


    // add drill holes within the svg
    const mountingHoleLocations = collectMountingHoleLocations(scene);

    // console.log('mhlocs: ', mountingHoleLocations);

    mountingHoleLocations.forEach(mh => {
        const [positionX, positionY, positionZ] = mh.mountingHolePosition;

        const viaClone = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        viaClone.setAttribute('href', '#via');
        viaClone.setAttribute('x', (positionX + pcbWidth/2).toString());
        viaClone.setAttribute('y', (positionZ + pcbHeight/2).toString());
        baseGroup.appendChild(viaClone);
        // console.log('viaClone: ', positionX, positionY, positionZ);

    });



    // console.log('rootSVG: ', rootSVG);


    //add traces
    const copperTraces = svgCopperTraces(traces);
    baseGroup.appendChild(copperTraces);

}

function svgCopperTraces(traces: any){
 
    // console.log('traces: ', traces);
    const copperTraces = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    copperTraces.setAttribute('id', 'copperTraces');


    traces.power.forEach(trace => {

        const powerPaths = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        for (let p=0; p<trace.length; p++){
            const point = trace[p];
            if (p==0){  
                powerPaths.setAttribute('d', `M ${point[0]} ${point[1]}`);
            } else {
                powerPaths.setAttribute('d', `${powerPaths.getAttribute('d')} L ${point[0]} ${point[1]}`);
            }
        }
        
        powerPaths.setAttribute('stroke', 'black');
        powerPaths.setAttribute('stroke-width', '1');
        powerPaths.setAttribute('fill', 'none');
        copperTraces.appendChild(powerPaths);


    });


    traces.data.forEach(trace => {
            
            const dataPaths = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            for (let p=0; p<trace.length; p++){
                const point = trace[p];
                if (p==0){  
                    dataPaths.setAttribute('d', `M ${point[0]} ${point[1]}`);
                } else {
                    dataPaths.setAttribute('d', `${dataPaths.getAttribute('d')} L ${point[0]} ${point[1]}`);
                }
            }

            dataPaths.setAttribute('stroke', 'black');
            dataPaths.setAttribute('stroke-width', '1');
            dataPaths.setAttribute('fill', 'none');
            copperTraces.appendChild(dataPaths);
    });

    return copperTraces;

}





