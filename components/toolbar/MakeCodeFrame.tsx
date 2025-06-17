import React from "react";

export default function MakeCodeFrame(props: {
  MakeCodeVisible: "none" | "block";
}) {
  const { MakeCodeVisible } = props;

  return (
    <>
      <div id="iframeContainer" display={MakeCodeVisible}>
        <iframe src="https://makecode.microbit.org/#editor"> </iframe>
      </div>
    </>
  );
}
