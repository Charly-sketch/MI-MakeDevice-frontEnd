// @ts-nocheck
import { Grid, Button } from "@mui/material";
import React, { useEffect } from "react";
import Menu from "@mui/material/Menu";
import { MenuItem } from "@mui/material";
import { downloadSVGEnclosure } from "./stencilFunctions";
import { rotateX, flip, deleteObject } from "./editFunctions";

import { MenuItems } from "./PFToolbarMenuItems";

import Object3D from "three";
import { downloadSTLEnclosure } from "./enclosureFunctions";
import { generateGerber } from "./generators/generateGerber";
import CarrierPCB from "./CarrierPCB";

export default function PF_Toolbar(props: {
  scene: any;
  carrierPCBDimensions: { height: number; width: number };
  traces: { power: []; data: [] };
  enclosureDimensions: { height: number; width: number; depth: number };
  lastClicked;
  objectRefs;
  setEnclosureOptionsOpen;
}) {
  const {
    scene,
    carrierPCBDimensions,
    traces,
    enclosureDimensions,
    lastClicked,
    objectRefs,
    setEnclosureOptionsOpen,
  } = props;

  // interaction
  const [anchorEl, setAnchorEl] = React.useState(null);

  // remove this in favour of handle select
  const handleClick = (index, event) => {
    setAnchorEl({ [index]: event.currentTarget });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //TODO: use object store for this
  const handleSelect = (index: string) => {
    switch (index.toLowerCase().replace(/\s/g, "")) {
      case "new":
        return;
      case "open":
        return;
      case "newcarrierpcb":
        return;

      // etc TODO: complete menu item to function binding

      case "rotate":
        lastClicked.current && rotateX(lastClicked.current);
        handleClose();
        return;
      case "flip":
        lastClicked.current && flip(lastClicked.current);
        handleClose();
        return;
      case "delete":
        lastClicked.current && deleteObject(lastClicked.current, objectRefs);
        handleClose();
        return;

      case "enclosure":
        // console.log('enclosure clicked!....')
        setEnclosureOptionsOpen(true);
        generateGerber(scene, traces, carrierPCBDimensions);
        //downloadSTLEnclosure({height: enclosureDimensions.height, width: enclosureDimensions.width, depth: enclosureDimensions.depth}, scene)
        handleClose();
        return;

      case "gerber":
        generateGerber(scene, traces, carrierPCBDimensions);
    }
  };

  return (
    <>
      <Grid container>
        {Object.keys(MenuItems).map((item, index) => (
          <>
            <Grid item>
              <Button color="inherit" onClick={(e) => handleClick(index, e)}>
                {item} <i className="fas fa-caret-down" />
              </Button>
              <Menu
                anchorEl={anchorEl && anchorEl[index]}
                keepMounted
                open={anchorEl && Boolean(anchorEl[index])}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                {MenuItems[item].map((menuitem, menuindex) => (
                  <MenuItem
                    id={menuitem.title}
                    key={menuindex}
                    selected={menuitem === item}
                    onClick={(e) => {
                      handleSelect(menuitem.title, e);
                    }}
                  >
                    {menuitem.title}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
          </>
        ))}
      </Grid>
    </>
  );
}
