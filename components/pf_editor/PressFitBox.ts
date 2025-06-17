import { createElement } from "react";
import { downloadBlob, importSVG } from "./enclosureFunctions";
import { PointArray, Svg } from "@svgdotjs/svg.js";


export const boxSideOrder = [
    "bottom", 
    "top", 
    "front", 
    "back", 
    "left_side", 
    "right_side"
]

export interface boxOptions {
    width: number, 
    height: number, 
    depth: number, 
    tabs: number, 
    thickness: number, 
    backlash: number
}

let layer: any;

let svgResultString: any;

function setSVGResultString(s){
    svgResultString = s;
}
export default function PressFitBox(boxOptions: boxOptions): string  | undefined{


    if (typeof window === 'object'){
        // console.log('window loaded!')
        return generate_box(boxOptions)
    }

    
}

// Taken from 


function generate_box(boxOptions: boxOptions): string  | undefined {
   
   if (window){
        try {

                let rootSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
           
                layer = document.createElementNS("http://www.w3.org/1999/xhtml", "g")
                layer.setAttribute("id", "layer");
                rootSVG.appendChild(layer)

                let TabTools = {
                    /**
                * Generates the elements of a polygon
                * svg for notches of approximately
                * <tab_width>, on a length of <length>,
                * for a material of thickness <thickness>.
                *
                *Options:
                * - direction: 0 top of the face, 1 right of the face, 2 bottom of the face, 3 left of the face.
                * - firstUp: Indicates whether we start at the top of a slot (true) or at the bottom of the slot (false - default)
                * - lastUp: Indicates whether you end at the top of a slot (true) or at the bottom of the slot (false - default)
                **/
                    tabs: function (length, tab_width, thickness, options) {
                
                        //options management
                        let opt = {
                            direction: 0,
                            firstUp: false,
                            lastUp: false,
                            inverted: false,
                            backlash: 0,
                            cutOff: false
                
                        };
                        if (typeof options === 'object') {
                            for (const k in options) {
                                opt[k] = options[k];
                            }
                        }
                        if (typeof opt.backlash != 'number') {
                            opt.backlash = 0;
                        }
                
                        //Calcultate tab size and number
                        let nb_tabs = Math.floor(length / tab_width);
                        nb_tabs = nb_tabs - 1 + (nb_tabs % 2);
                        let tab_real_width = length / nb_tabs;
                
                        //Check if no inconsistency on tab size and number
                        // console.debug(["For a width of", length, "and notches ", tab_width, "=> Number of notches :", nb_tabs, "Notch width : ", tab_real_width].join(" "));
                
                        if (tab_real_width <= thickness * 1.5) {
                            let msg = ["Attention the resulting notches are not wide enough in view of the thickness of your materials (", largeur_encoche, " &lt; ", materiau, "). Please use a notch size consistent with your box"].join(" ");
                            alert(msg);
                            throw (msg);
                        }
                
                        if (nb_tabs <= 1) {
                            let msg = ["Attention you will have no notch on this length, it is a bad idea!!! Specify correct nock size for your box size"].join(" ");
                            alert(msg);
                            throw (msg);
                        }
                
                        return TabTools._rotate_path(TabTools._generate_tabs_path(tab_real_width, nb_tabs, thickness, options), opt.direction);
                
                    },
                
                    _generate_tabs_path: function (tab_width, nb_tabs, thickness, options) {
                        // console.debug((options.cutOff ? "generate path with cuttof" : "generate path without cutoff"));
                        //Generate path
                        let points: number[][] = [];
                        for (let i = 1; i <= nb_tabs; i++) {
                            if (options.inverted) {
                                if (i % 2 == 1) { //gap
                                    if (i != 1 || !options.firstUp) {
                                        points.push([0, thickness]);
                                    }
                                    if (i == 1 || i == nb_tabs) {
                                        points.push([tab_width - (options.cutOff ? thickness : 0) - (0.5 * options.backlash), 0]);
                                    } else {
                                        points.push([tab_width - options.backlash, 0]);
                                    }
                                    if (i != nb_tabs || !options.lastUp) {
                                        points.push([0, -thickness]);
                                    }
                                } else { //tab
                                    points.push([tab_width + options.backlash, 0]);
                                }
                
                            } else {
                                if (i % 2 == 1) { //tab
                                    if (i != 1 || !options.firstUp) {
                                        points.push([0, -thickness]);
                                    }
                                    if (i == 1 || i == nb_tabs) {
                                        points.push([tab_width - (options.cutOff ? thickness : 0) + (0.5 * options.backlash), 0]);
                                    } else {
                                        points.push([tab_width + options.backlash, 0]);
                                    }
                                    if (i != nb_tabs || !options.lastUp) {
                                        points.push([0, thickness]);
                                    }
                                } else { //gap
                                    points.push([tab_width - options.backlash, 0]);
                                }
                            }
                
                        }
                        return points;
                    },
                
                    _rotate_path: function (points, direction) {
                        switch (direction) {
                        case 1:
                            return points.map(function (point) {
                                return [-point[1], point[0]];
                            });
                        case 2:
                            return points.map(function (point) {
                                return [-point[0], -point[1]];
                            });
                        case 3:
                            return points.map(function (point) {
                                return [point[1], -point[0]];
                            });
                        default:
                            return points;
                        }
                    }
                };
                let SvgTools = {
                    mm2px: function (arr) {
                        // console.log(typeof arr);
                        if (typeof arr == 'array' || typeof arr == 'object') {
                            return arr.map(function (point) {
                              //  // console.log('pressBox: ', point)
                                return point.map(function (coord) {

                                    return coord * 90 / 25.4;
                                    //return coord;
                                });
                            });
                        }
                        if (typeof arr == 'number') {
                            return arr * 90 / 25.4;
                           // return arr
                        }
                
                    },
                
                    toPathString: function (arr) {
                        return arr.map(function (point) {
                            return point.join(",")
                        }).join(" ");
                    },
                    addPath: function (str, id, _x, _y) {
                        // console.debug('layer after: ', layer)
                        let shape = document.createElement("path");
                        shape.setAttribute("style", "fill:#ffffff;stroke:#ff0000");
                        shape.setAttribute("id", id);
                        shape.setAttribute("transform", "translate(" + SvgTools.mm2px(_x) + "," + (SvgTools.mm2px(_y)) + ")");
                        shape.setAttribute("d", "m " + str + " z");
                        layer.appendChild(shape);

                        
                    },
                
                    downloadLink: function (width, depth, height, thickness) {
                     
                        let aFileParts = [new XMLSerializer().serializeToString(rootSVG)];

                        // console.log('fileparts: ', aFileParts)
                        setSVGResultString(aFileParts[0]);

                        importSVG(aFileParts[0]);

                        let oMyBlob = new Blob(aFileParts, {
                            type: 'image/svg+xml '
                        });
                      //  // console.log('trying to download')
                      //  downloadBlob(oMyBlob, 'PressFitBox.svg')
                    /*  let out = document.getElementById("out");
                        out.innerHTML = "";
                        let link = document.createElement("a");
                        link.innerHTML = (["⎘ Télécharger le fichier pour une boite de", width, "x", depth, "x", height, "en", thickness, "mm d'epaisseur"].join(" "));
                        link.setAttribute("href", URL.createObjectURL(oMyBlob));
                        link.setAttribute("download", ["box_", width, "x", depth, "x", height, "_", thickness, "mm.svg"].join(""));
                        out.appendChild(link);
                        link.click(); */
                    },
                 setDocumentSize: function (width, depth, height, thickness) {
                        rootSVG.setAttribute("height", SvgTools.mm2px(depth + 2 * height + 4 * thickness));
                        rootSVG.setAttribute("width", SvgTools.mm2px(2 * Math.max(width, depth) + 3 * thickness));
                    } 
                };
                
                let Box = {
                    _bottom: function (width, depth, tab_width, thickness, backlash) {
                        // console.debug("_bottom");
                        let points = [[0, 0]];
                        points.push.apply(points, TabTools.tabs(width, tab_width, thickness, {
                            direction: 0,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true
                        }));
                        points.push.apply(points, TabTools.tabs(depth, tab_width, thickness, {
                            direction: 1,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true
                        }));
                        points.push.apply(points, TabTools.tabs(width, tab_width, thickness, {
                            direction: 2,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true
                        }));
                        points.push.apply(points, TabTools.tabs(depth, tab_width, thickness, {
                            direction: 3,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true
                        }));
                        return points;
                    },
                    _front_without_top: function (width, height, tab_width, thickness, backlash) {
                        // console.debug("_front_without_top");
                        let points = [[0, 0], [width, 0]];
                        points.push.apply(points, TabTools.tabs(height - thickness, tab_width, thickness, {
                            direction: 1,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true
                        }));
                        points.push.apply(points, TabTools.tabs(width, tab_width, thickness, {
                            direction: 2,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true,
                            inverted: true
                        }));
                        points.push.apply(points, TabTools.tabs(height - thickness, tab_width, thickness, {
                            direction: 3,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true
                        }));
                        return points;
                    },
                    _front_with_top: function (width, height, tab_width, thickness, backlash) {
                        // console.debug("_front_with_top");
                        let points = [[0, thickness]];
                
                        points.push.apply(points, TabTools.tabs(width, tab_width, thickness, {
                            direction: 0,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true,
                            inverted: true
                        }));
                        points.push.apply(points, TabTools.tabs(height - (thickness * 2), tab_width, thickness, {
                            direction: 1,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true
                        }));
                        points.push.apply(points, TabTools.tabs(width, tab_width, thickness, {
                            direction: 2,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true,
                            inverted: true
                        }));
                        points.push.apply(points, TabTools.tabs(height - (thickness * 2), tab_width, thickness, {
                            direction: 3,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true
                        }));
                        return points;
                    },
                    _side_without_top: function (depth, height, tab_width, thickness, backlash) {
                        // console.debug("_side_without_top");
                        let points = [[thickness, 0], [depth - (4 * thickness), 0]];
                        points.push.apply(points, TabTools.tabs(height - thickness, tab_width, thickness, {
                            direction: 1,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true,
                            inverted: true
                        }));
                        points.push.apply(points, TabTools.tabs(depth, tab_width, thickness, {
                            direction: 2,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true,
                            inverted: true,
                            cutOff: true
                        }));
                        points.push.apply(points, TabTools.tabs(height - thickness, tab_width, thickness, {
                            direction: 3,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true,
                            inverted: true
                        }));
                        return points;
                    },
                    _side_with_top: function (depth, height, tab_width, thickness, backlash) {
                        // console.debug("_side_with_top");
                        let points = [[thickness, thickness]];
                        points.push.apply(points, TabTools.tabs(depth, tab_width, thickness, {
                            direction: 0,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true,
                            inverted: true,
                            cutOff: true
                        }));
                        points.push.apply(points, TabTools.tabs(height - (2 * thickness), tab_width, thickness, {
                            direction: 1,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true,
                            inverted: true
                        }));
                        points.push.apply(points, TabTools.tabs(depth, tab_width, thickness, {
                            direction: 2,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true,
                            inverted: true,
                            cutOff: true
                        }));
                        points.push.apply(points, TabTools.tabs(height - (2 * thickness), tab_width, thickness, {
                            direction: 3,
                            backlash: backlash,
                            firstUp: true,
                            lastUp: true,
                            inverted: true
                        }));
                        return points;
                    },
                    withTop: function (width, depth, height, tab_size, thickness, backlash) {
                        
                    //  SvgTools.clearPathAndLink();
                        SvgTools.addPath(SvgTools.toPathString(SvgTools.mm2px(Box._bottom(width, depth, tab_size, thickness, backlash))), 'bottom', (1 * thickness), (1 * thickness));
                        SvgTools.addPath(SvgTools.toPathString(SvgTools.mm2px(Box._bottom(width, depth, tab_size, thickness, backlash))), 'top', (2 * thickness + width), (1 * thickness));
                        SvgTools.addPath(SvgTools.toPathString(SvgTools.mm2px(Box._front_with_top(width, height, tab_size, thickness, backlash))), 'front', (2 * thickness + width), (2 * thickness + depth));
                        SvgTools.addPath(SvgTools.toPathString(SvgTools.mm2px(Box._front_with_top(width, height, tab_size, thickness, backlash))), 'back', (1 * thickness), (2 * thickness + depth));
                        SvgTools.addPath(SvgTools.toPathString(SvgTools.mm2px(Box._side_with_top(depth, height, tab_size, thickness, backlash))), 'left_side', (2 * thickness + depth), (3 * thickness + depth + height));
                        SvgTools.addPath(SvgTools.toPathString(SvgTools.mm2px(Box._side_with_top(depth, height, tab_size, thickness, backlash))), 'right_side', (1 * thickness), (3 * thickness + depth + height));
                        SvgTools.setDocumentSize(width, depth, height, thickness);
                        SvgTools.downloadLink(width, depth, height, thickness);
                       
                    },
                    withoutTop: function (width, depth, height, tab_size, thickness, backlash) {
                    // SvgTools.clearPathAndLink();
                        SvgTools.addPath(SvgTools.toPathString(SvgTools.mm2px(Box._bottom(width, depth, tab_size, thickness, backlash))), 'bottom', (1 * thickness), (1 * thickness));
                        SvgTools.addPath(SvgTools.toPathString(SvgTools.mm2px(Box._front_without_top(width, height, tab_size, thickness, backlash))), 'front', (2 * thickness + width), (2 * thickness + depth));
                        SvgTools.addPath(SvgTools.toPathString(SvgTools.mm2px(Box._front_without_top(width, height, tab_size, thickness, backlash))), 'back', (1 * thickness), (2 * thickness + depth));
                        SvgTools.addPath(SvgTools.toPathString(SvgTools.mm2px(Box._side_without_top(depth, height, tab_size, thickness, backlash))), 'left_side', (2 * thickness + depth), (3 * thickness + depth + height));
                        SvgTools.addPath(SvgTools.toPathString(SvgTools.mm2px(Box._side_without_top(depth, height, tab_size, thickness, backlash))), 'right_side', (1 * thickness), (3 * thickness + depth + height));
                     SvgTools.setDocumentSize(width, depth, height, thickness);
                        SvgTools.downloadLink(width, depth, height, thickness);
                    }
                };
    
            //  Box.withTop(value_of('width'), value_of('depth'), value_of('height'), value_of('tabs'), value_of('thickness'), value_of('backlash'));
            // console.log('BOX OPTIONS: ');
            // console.log(boxOptions)
           
            const boxRes = Box.withTop(
                    boxOptions.width,
                    boxOptions.height,
                    boxOptions.depth,
                    boxOptions.tabs,
                    boxOptions.thickness,
                    boxOptions.backlash,
                )

               // // console.log('boxRes: ', svgResultString)
            return svgResultString;

        } catch (e) {
            // console.log('caught an errror');
            // console.log(e)
        }
    }
}




/* function value_of(id) {
    let v = parseFloat(document.getElementById(id).value);
    if (isNaN(v)) {
        throw (id + " is not a number : " + document.getElementById(id).value);
    } else {
        return v;
    }
} */

