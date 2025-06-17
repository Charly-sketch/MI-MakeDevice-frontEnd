import { Box, Typography } from "@mui/material";

function EditorFooter() {
  return (
    <>
      <Box
        component={"div"}
        style={{
          padding: "2em",
          backgroundColor: "lightgrey",
          width: "100%",
          height: "100%",
          textAlign: "center",
        }}
      >
        <Typography
          fontWeight={"bold"}
          variant="h6"
          display="inline"
          gutterBottom
        >
          MakeDevice
        </Typography>
        <Typography display="inline" fontStyle="oblique">
          {" "}
          - Create products from prototypes with Jacdac.
        </Typography>
      </Box>
    </>
  );
}

export default EditorFooter;
