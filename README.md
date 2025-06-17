# MakeDevice

MakeDevice is a tool to...

![image](https://github.com/user-attachments/assets/7e46eba9-7fb2-46dc-b6a7-e3045a7cf149)


### Setting up the developer environment

- Front-end service (MakeDevice)

1. Install all dependencies with `yarn install`
2. `yarn run dev`

The webapge will be available at `localhost:3000`

- Backend server (MakeDevice-backed submodule)

1. Ensure all dependencies are installed with `pip install -r requirements.txt`
2. Start the server with `python3 server.py`

The server will be availble at `localhost:3333`

### Adding a new placeable device/model

1. Aquire .glb model (e.g `vm_rp2040_brain_0.1.glb`)
2. Run the command `npx gltfjsx vm_rp2040_brain_0.1.glb -i` to optimize the model through instancing
3. Store the transformed .glb in `/public/models/virtual_modules/`, filename following existing pattern
4. Upload the transformed model to https://gltf.pmnd.rs/
5. Copy the generated Javascript to `/components/models/virtual_modules/`, filename following pattern
6. In the Javascript file change `export function Model` to `export default function Model`
7. After `dispose={null}` paste `rotation={[Math.PI / 2, 0, Math.PI]}`
8. Change the path in both places where `useGLTF(` shows up to `/models/virtual_modules/<name>`
9. Javascript file changes finished
10. Update `/components/spec/MakeDeviceDevices.json` to include the new device, following pattern
11. Update `/components/models/PF_Module.tsx` at the top and bottom following the patterns

### Acknowledgements

### License
