import { Button, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import ConnectComp from "../jacdac-react/DynamicConnext";

export default function PFToolPanelSecondLevel(props: { objects: any }) {
  const { objects } = props;

  function handleFlatten() {
    // call flatten
    objects.forEach((obj) => {
      console.log("obj: ", obj);
    });
  }

  return (
    <>
      <Box component={"div"} alignItems={"center"}></Box>
      <Grid container direction="row" spacing={1}>
        <Grid item xs={3} display={"inline"}>
          <ConnectComp />
          <Button variant="outlined" onClick={handleFlatten}>
            Flatten
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
