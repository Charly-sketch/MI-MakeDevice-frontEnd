import { getModuleLocations } from "./editFunctions";

export function sendLocationData(scene) {
  let moduleLocations = getModuleLocations(scene);
  let boardSize = { x: 100, y: 100 };
  console.log("sending gerber file...");

  // let formdata = new FormData();
  //formdata.append("content", gerberBlob);
  // console.log("fd\n", formdata);

  const payload = {
    board: {
      name: "MakeDevice",
      size: boardSize,
      origin: { x: 0, y: 0 },
    },
    modules: moduleLocations,
  };

  return fetch(`http://localhost:8080/send`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
