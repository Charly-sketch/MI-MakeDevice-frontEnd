// @ts-nocheck
import React, { useRef } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { Checkbox, Slider, TextField } from "@mui/material";

export default function PFSettings(props: {
  lockOrbit;
  setLockOrbit;
  snapAmount;
  setSnapAmount;
}) {
  const { lockOrbit, setLockOrbit, snapAmount, setSnapAmount } = props;

  const lockOrbitCheckbox = useRef();

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        /* subheader={
            <ListSubheader component="div" id="nested-list-subheader">
            Nested List Items
            </ListSubheader>
        } */
      >
        <ListItemButton onClick={handleClick}>
          <ListItemText primary="View" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Lock Orbit" />
              <Checkbox
                defaultChecked={true}
                ref={lockOrbitCheckbox}
                value={lockOrbitCheckbox}
                onChange={() => {
                  setLockOrbit(!lockOrbit);
                }}
              />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Camera view" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton onClick={handleClick}>
          <ListItemText primary="Modules" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Module Opacity" />
            </ListItemButton>
            <Slider
              size="small"
              defaultValue={70}
              aria-label="Small"
              valueLabelDisplay="auto"
            />

            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Camera view" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Snap Amount" />
              <TextField id="snapAmountField" label="mm" variant="standard" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </>
  );
}
