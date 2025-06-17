"use client";

import React, { useRef } from "react";

const Testing = (props: { isHidden: boolean }) => {
  const { isHidden } = props;

  const iframeRef = useRef();

  let url = "https://microsoft.github.io/jacdac-docs/tools/device-tester/";

  return (
    <div hidden={isHidden}>
      <div
        style={{
          position: "relative",
          top: "-10em",
          width: "100vw",
          height: "100vh",
          zIndex: "0",
        }}
      >
        <iframe
          id="iframe"
          style={{
            top: 165,
            left: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
          src={url}
        ></iframe>
      </div>
    </div>
  );
};

export default Testing;
