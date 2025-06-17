import React, { lazy, Suspense } from "react";

import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  NoSsr,
} from "@mui/material";
import PressFitBox from "../pf_editor/PressFitBox";

const ModelViewer = lazy(() => import("../models/ModelViewer"));
const SVGModel = lazy(() => import("../models/SVGModel"));

export default function SVGModelCard(props: {
  name: string;

  color: string;
}) {
  const { name, color } = props;

  const testBox = PressFitBox({
    height: 200, //enclosureDimensions.height,
    width: 100, // enclosureDimensions.width,
    depth: 50, //enclosureDimensions.depth,
    tabs: 7,
    thickness: 3,
    backlash: 0.1,
  });

  // console.log('my boxx', testBox)

  const tabbedBoxBlob = new Blob([testBox as string], {
    type: "image/svg+xml",
  });

  const url = window.URL.createObjectURL(tabbedBoxBlob);

  const fn = `${name}.SVG`;
  return (
    <NoSsr>
      <Card>
        <CardHeader title={fn} />
        <CardMedia>
          <Suspense>
            <ModelViewer
              responsive={true}
              style={{
                position: "relative",
                height: "20rem",
                width: "100%",
              }}
            >
              <SVGModel url={url} color={color} />
            </ModelViewer>
          </Suspense>
        </CardMedia>
        <CardActions>
          <Button href={url} variant="outlined" download={fn}>
            Download
          </Button>
        </CardActions>
      </Card>
    </NoSsr>
  );
}
