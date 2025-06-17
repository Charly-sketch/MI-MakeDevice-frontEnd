import { Grid, Button, Box, Tabs, Tab, Typography } from "@mui/material";
import React from "react";
//import Button from "../ui/Button";
import ModuleList from "./ModuleList";

//import AddIcon from "@mui/icons-material/Add";

export default function AddModule(props: { addModule: (string) => any }) {
  const { addModule } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (module: any) => {
    addModule(module);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box component="div" sx={{ overflowY: "scroll", height: "100vh" }}>
        <Tabs value={0} textColor="primary" indicatorColor="primary">
          <Tab label="Add Modules" />
        </Tabs>
        <Box
          component={"div"}
          style={{ maxHeight: "40em", overflow: "scroll" }}
        >
          <ModuleList handleSelection={handleClick}></ModuleList>
        </Box>
      </Box>
    </>
  );
}
