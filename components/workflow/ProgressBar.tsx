import { LinearProgress, Box } from "@mui/material";
import React from "react";

export const ProgressBar = (props: { progress: number }) => {
  const { progress } = props;

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <LinearProgress
          variant="determinate"
          value={scaleStageToProgress(progress)}
        />
      </Box>
    </>
  );
};

function scaleStageToProgress(stage) {
  console.log("res: ", stage * 25);
  return stage * 25;
}
