import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { CssBaseline } from "@mui/material";

const navItems = ["editor", "programming", "upload model", "guide"];

export default function PFHeaderBar(props: {
  page: string;
  MakeCodeFrameVisible?: boolean;
  setMakeCodeFrameVisible?: (boolean) => any | undefined;
}) {
  const { page, MakeCodeFrameVisible, setMakeCodeFrameVisible } = props;

  const isAbout = page === "about" ? true : false;

  const handleProgrammingPanelClick = () => {
    if (setMakeCodeFrameVisible !== undefined) {
      setMakeCodeFrameVisible(!MakeCodeFrameVisible);
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
        }}
        component="div"
      >
        <AppBar position="sticky">
          <Toolbar>
            <Link href="/">
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                MakeDevice
              </Typography>
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

/* 
{!isAbout && (
  <Button color="inherit" contained={page === "editor"}>
    <Link href="./tei2023Demo">Editor</Link>
  </Button>
)}

{!isAbout && (
  <Button color="inherit" contained={page === "programming"}>
    <Link href="./MakeCode">Programming</Link>
  </Button>
)}

{!isAbout && (
  <Button color="inherit" contained={page === "model upload"}>
    <Link href="./ModelUploader">Model Upload</Link>
  </Button>
)}

{!isAbout && (
  <Button color="inherit" contained={page === "guide"}>
    <Link href="./About">Guide</Link>
  </Button>
)} */
