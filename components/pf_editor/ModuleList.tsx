// @ts-nocheck

import * as React from "react";
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
import { Box, Divider, Typography } from "@mui/material";
import DeviceData from "@/public/MakeDeviceDevices.json";
import MakeDeviceDevices from "../spec/MakeDeviceDevices.json";

// Import JSON data for devices

export default function ModuleList(props: { handleSelection }) {
  const { handleSelection } = props;

  const [kittenBotOpen, setKittenBotOpen] = React.useState(true);
  const [replicateBotOpen, setReplicateBotOpen] = React.useState(true);

  const handleClickKittenbotMenu = () => {
    setKittenBotOpen(!kittenBotOpen);
  };

  const handleClickReplicateMenu = () => {
    setReplicateBotOpen(!replicateBotOpen);
  };

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Available Devices
        </ListSubheader>
      }
    >
      {MakeDeviceDevices.map((device, index) => (
        <ListItemButton key={index} onClick={() => handleSelection(device)}>
          <ListItemText primary={device.name} />
        </ListItemButton>
      ))}
    </List>
  );
}
