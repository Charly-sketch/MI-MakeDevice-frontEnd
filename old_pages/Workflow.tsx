/*

import type { NextPage } from "next";
import Head from "next/head";
import { JacdacProvider } from "react-jacdac";
import styles from "../styles/Home.module.css";
import PFHeaderBar from "../components/toolbar/PFHeaderBar";
import { Box, Button, CssBaseline } from "@mui/material";
import { useState } from "react";
import { ProgressBar } from "../components/workflow/ProgressBar";
import { StageSelect } from "../components/workflow/StageSelect";
import Welcome_Page from "../components/workflow/Welcome_Page";
import Layout_Design from "../components/workflow/Layout_Design";
import PCB_Assembly from "../components/workflow/PCB_Assembly";
import Enclosure from "../components/workflow/Enclosure";
import PFEditor from "./PFEditor";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Workflow: NextPage = () => {
  const [MakeCodeFrameVisible, setMakeCodeFrameVisible] = useState(false);

  const [stage, setStage] = useState(0);

  const [howManyModalOpen, setHowManyModalOpen] = useState(false);

  const handleNextClick = () => {
    if (stage === 1) {
      // display modal with response
      handleModalOpen();
    }
  };

  const handleOkClick = () => {
    setStage(stage + 1);
  };

  const handleModalOpen = () => {
    console.log("opening modal");
    setHowManyModalOpen(true);
  };

  const handleModalClose = () => {
    setHowManyModalOpen(false);
  };

  return (
    <JacdacProvider>
      <div className={styles.container}>
        <Head>
          <title>MakeDevice - Workflow</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header className={styles.header}>
          <PFHeaderBar
            page={"workflow"}
            MakeCodeFrameVisible={MakeCodeFrameVisible}
            setMakeCodeFrameVisible={setMakeCodeFrameVisible}
          />
          <br></br>
          <ProgressBar progress={stage} />
        </header>

        <CssBaseline />

        <main className={styles.main}>
          <Box component={"div"} sx={{ width: "75%", height: "5%" }}>
            {stage === 0 && <Welcome_Page />}

            {stage === 1 && (
              <>
                <Layout_Design />
                <PFEditor></PFEditor>

                {howManyModalOpen && (
                  <Dialog open={howManyModalOpen} onClose={handleModalClose}>
                    <DialogTitle>Subscribe</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        To subscribe to this website, please enter your email
                        address here. We will send updates occasionally.
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleModalClose}>Cancel</Button>
                      <Button onClick={handleOkClick}>Ok</Button>
                    </DialogActions>
                  </Dialog>
                )}
              </>
            )}

            {stage === 2 && <PCB_Assembly />}

            {stage === 3 && <Enclosure />}
          </Box>

          <StageSelect stage={stage} setStage={setStage} />
        </main>

        <footer className={styles.footer}></footer>
      </div>
    </JacdacProvider>
  );
};

export default Workflow;

*/
