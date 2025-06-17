import { Button, Box, Grid, Paper } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const StageSelect = (props: {
  stage: number;
  setStage: (number) => void;
}) => {
  const { stage, setStage } = props;

  const nextClick = () => {
    if (stage !== 1) {
      setStage(stage + 1);
    }
    console.log("stage: ", stage);
  };

  const prevClick = () => {
    if (stage !== 0) {
      setStage(stage - 1);
    }
  };

  return (
    <>
      <Box component="div" sx={{ width: "100%" }}>
        <Grid container spacing={3}>
          <Grid xs={1}></Grid>
          <Grid xs={1}>
            <Item>
              <Button onClick={prevClick}>Previous</Button>
            </Item>
          </Grid>

          <Grid xs={8}></Grid>

          <Grid xs={1}>
            <Item>
              <Button onClick={nextClick}>Next</Button>
            </Item>
          </Grid>
          <Grid xs={1}></Grid>
        </Grid>
      </Box>
    </>
  );
};
