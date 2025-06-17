## Aron's contributions to virtual modules and Gerber snippets in MakeDevice

In this branch `virtual-modules` I (Aron) will be doing a complete revamp and reorganisation for how the modules are added, stored, and accessed.

Throughout my work I will keep in mind the next steps for adding full Gerber snippet support.

### [OLD] Steps for adding a new Jacdac/virtual modules

Prerequisites

- KiCAD 7+
- Blender - https://www.blender.org/download/
- CAD Assistant - https://www.opencascade.com/products/cad-assistant/

1. Export module from KiCad in VRML format
   a. Check origins are correct before export
2. Open VRML file (extension `.wrl`) in CAD Assistant, then save as glb file
3. Open this glb file in blender
   a. Check origin is what you expect
   b. Go over to scripting tag, paste in python script, and run
   c. Export file as new glb file
4. Go to `https://gltf.pmnd.rs/`
   a. Drag and drop glb file just created into this page
   b. Open settings in top right corner, and check keep groups and meta
5. Create new file in `/components/models/`
   a. Name it `ModuleName.js`
   b. Paste in text generated from `https://gltf.pmnd.rs/`
   c. Add `/models/` to the start of the filepath at the top where `useGLTF()` is invoked, as well as at the final line of the file
   d. Make sure the `Model` object is the default export
6. Add the glb file generated from blender to `/public/models/`
7. Go to the file `/components/models/PF_Module.tsx`
   a. Import the default export object from the file generated in step 5
   b. Within the function `whichModule()`, define a new case for the new module, make sure to use lower case for the case condition, and return the object as a
   component
8. Go to the file `/components/pf_editor/ModuleList.tsx`
   a. In this file add a new entry for the module within the lis

### [NEW] Proposed changes to the flow of adding new Jacdac/virtual modules

1. Will think of a new flow as I work on this...

## Changelog

#### August 7, 2024

- Played around with the MakeDevice, looked at several features and attemmpted to backtrack some of the functionality
- Thanks to Kobi's helpful guide (the [OLD] steps for adding modules) I created my test module and managed to add it to MakeDevice
- Started thinking about potential improvements for how the flow is architected, and did some digging to find out better solutions to avoid using Blender and CAD Assistant - perhaps build our own "preparation" tool?

#### August 8, 2024

- Created this changelog to start documenting all relevant changes to this project and this branch
- Started to clean-up and delete unused files

## Other notes

- Clean-up 
- Proirotise hardware, and Gerber generation 
- Sepatate tool for preparing files for virtual modules, JSON
- Assign JACDAC data, + and - in KiCad, and and read them out in the custom tool
- Think about routing - how do we know where are we routing to and from?
- Steganography - hiding data in an image
- JSON map, with entries for each module, path to model, path to Gerber, ID, information, 
