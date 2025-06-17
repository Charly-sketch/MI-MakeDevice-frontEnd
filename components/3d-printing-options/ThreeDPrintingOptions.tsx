import Download3DPrint from "./Download3DPrint";

const ThreeDPrintingOptions = (props: { enclosureDimensions; scene }) => {
  const { enclosureDimensions, scene } = props;

  return (
    <>
      <Download3DPrint
        enclosureDimensions={enclosureDimensions}
        scene={scene}
      />
    </>
  );
};

export default ThreeDPrintingOptions;
