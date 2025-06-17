const clientID = "PySwIg1D9NGM4xwPSHDQv38MGD1Ro4FcAoik3Cf0AgQy1Qenus";
const clientSecret = "ZrsyfwS4yw2bGN3m8jC07AdFEza7Ej4c269X7SH6R82PTie63G";

const url = new URL("https://api.shapeways.com/oauth2/token");

export default function APIRequest() {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientID);
  params.append("client_secret", clientSecret);

  url.search = params.toString();

  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/x-www-form-urlencoded",
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log("url data back: ", data));
}
