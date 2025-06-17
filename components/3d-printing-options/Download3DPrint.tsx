import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { downloadSTLEnclosure } from "../pf_editor/enclosureFunctions";

const Download3DPrint = (props: { enclosureDimensions: any; scene }) => {
  const { enclosureDimensions, scene } = props;

  return (
    <>
      <Box
        component="div"
        id="innerBox"
        /* sx={{ width: 3000, height: 100 }} */
        /* sx={{ minWidth: 275, minHeight: "15em", maxHeight: "20em" }} */
      >
        <Card
          id="innerCard"
          variant="outlined"
          sx={{ minWidth: "25%", minHeight: "25%" }}
        >
          <React.Fragment>
            <CardContent>
              <Typography
                sx={{ fontSize: 24 }}
                color="text.primary"
                gutterBottom
              >
                Download
              </Typography>
              <Typography variant="h5" component="div"></Typography>

              <Typography variant="body2">
                You can use this to produce an enclosure with a 3D printer you
                have access to. For more guidance on 3D printing, click below to
                see more details.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">
                <Link
                  href={
                    "https://www.bcn3d.com/the-beginners-guide-to-3d-printing-6-steps/"
                  }
                >
                  Learn More
                </Link>
              </Button>
              <Button
                size="medium"
                onClick={() => {
                  downloadSTLEnclosure(
                    {
                      height: enclosureDimensions.height,
                      width: enclosureDimensions.width,
                      depth: enclosureDimensions.depth,
                    },
                    scene
                  );
                }}
              >
                Download STL
              </Button>
            </CardActions>
          </React.Fragment>
        </Card>
      </Box>
    </>
  );
};

export default Download3DPrint;
