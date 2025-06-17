"use client";

import React, { useRef } from "react";

const MakeCode = (props: { isHidden: boolean }) => {
  const { isHidden } = props;

  const iframeRef = useRef();

  let url = "/makecode/controller.html";

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
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          src={url}
        ></iframe>
      </div>
    </div>
  );
};

export default MakeCode;
