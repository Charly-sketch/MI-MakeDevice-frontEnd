import { IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { arrange } from "./arrangeFunctions";
import { route } from "./editFunctions";

export const MoreMenu = (props: {
  scene: THREE.Scene;
  setTraces;
  setCarrierPCBDimensions;
  enclosureDimensions;
  setEnclosureDimensions;
}) => {
  const {
    scene,
    setTraces,
    setCarrierPCBDimensions,
    enclosureDimensions,
    setEnclosureDimensions,
  } = props;

  const options = ["Arrange", "Route", "Reset"];

  const ITEM_HEIGHT = 48;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);

    const selectedText = event.currentTarget.innerText.toLowerCase();

    switch (selectedText) {
      case "arrange":
        const arrangedModules = arrange(scene);
        //setTraces(arrangedModules.traces);
        // console.log('dimensions h: ', arrangedModules.dimensions.height)
        // console.log('dimensions w: ', arrangedModules.dimensions.width)

        setCarrierPCBDimensions({
          width: arrangedModules.dimensions.width + 4,
          height: arrangedModules.dimensions.height + 4,
        });

        setEnclosureDimensions({
          height: arrangedModules.dimensions.height + 4,
          width: arrangedModules.dimensions.width + 4,
          depth: enclosureDimensions.depth,
        });

        try {
          setTraces(
            route(
              scene,
              {
                width: arrangedModules.dimensions.width + 4,
                height: arrangedModules.dimensions.height + 4,
              },
              false
            )
          );
        } catch (e) {
          // console.error(e)
        }

        //setTraces({data: [], power: []})
        break;
      case "route":
        setTraces(route(scene));
        break;
      case "reset":
        break;
    }
  };

  return (
    <div style={{ display: "inline" }}>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === "Pyxis"}
            onClick={handleClose}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
