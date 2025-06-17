import { useLoader, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { blob } from "stream/consumers";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import STLModel from "../models/STLModel";
import { getSTLBlob } from "./enclosureFunctions";

export default function Enclosure(props: {
  height;
  width;
  depth;
  enclosureDimensions;
  enclosureVisible;
}) {
  const { height, width, depth, enclosureDimensions, enclosureVisible } = props;

  const { scene } = useThree();

  let [enclosureBlobs, setEnclosureBlobs] = useState<any>(null);

  const [baseURL, setBaseURL] = useState<string | null>(null);
  const [lidURL, setLidURL] = useState<string | null>(null);

  const getBlobs = async () => {
    if (enclosureVisible) {
      const blobs = await getSTLBlob(enclosureDimensions, scene);
      // // console.log('blobs : ', blobs)
      setEnclosureBlobs(blobs).then(() => {
        setBaseURL(window.URL.createObjectURL(enclosureBlobs!.base));
      });
    }
  };

  useEffect(() => {
    getBlobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enclosureDimensions]);

  const wallThickness = 2;

  const enclosure: any = useRef();

  return (
    <>
      {enclosureVisible && baseURL !== null && (
        <STLModel url={baseURL as string} color={"grey"} />
      )}
    </>
  );
}
