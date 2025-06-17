import { Typography, Box, Paper, Grid } from "@mui/material";
import React, { Suspense } from "react";
// import Layout_Design_Block from "./StagesBlocks/Layout_Design_Block";
import { AnimatePresence, motion } from "framer-motion";
import Layout_Design from "./Layout_Design";
import PCB_Assembly from "./PCB_Assembly";
import Enclosure from "./Enclosure";

export default function Welcome_Page(props: {}) {
  const container = {
    hidden: {
      transition: {
        staggerChildren: 0.5,
        staggerDirection: -1,
      },
    },
    show: {
      transition: {
        staggerChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      transition: { type: "spring", bounce: 1.2 },
    },
    show: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.4 } },
  };

  const itemBoxHeight: any = "20vh";

  const numberOfSteps = 3;

  const items = Array.from(Array(numberOfSteps).keys()).map((i) => i + 1);

  return (
    <>
      <Box component="div" style={{ height: "85vh" }}>
        <Box component="div" style={{ height: "5vh" }}>
          <h1>Welcome to MakeDevice!</h1>
          <h3>Here are a few of the stages in device production...</h3>
        </Box>
        <Box component="div" style={{ minHeight: "80vh", minWidth: "80vh" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
            animate="show"
            className="item-list"
          >
            <Box component="div">
              <Grid
                padding="4em"
                id="lookforme"
                container
                spacing={3}
                direction={"row"}
                sx={{ height: "50%" }}
                justifyContent={"space-evenly"}
                alignItems={"center"}
              >
                <Grid item xs={2}>
                  <motion.div className="item" variants={itemVariants}>
                    <Paper
                      sx={{
                        p: 1,
                        display: "flex",
                        width: "150%",
                        height: itemBoxHeight,
                      }}
                      elevation={3}
                    >
                      <Layout_Design />
                    </Paper>
                  </motion.div>
                </Grid>

                <Grid item xs={2}>
                  <motion.div className="item" variants={itemVariants}>
                    <Paper
                      sx={{
                        p: 1,
                        display: "flex",
                        width: "150%",
                        height: itemBoxHeight,
                      }}
                      elevation={3}
                    >
                      <PCB_Assembly />
                    </Paper>
                  </motion.div>
                </Grid>

                <Grid item xs={2}>
                  <motion.div className="item" variants={itemVariants}>
                    <Paper
                      sx={{
                        p: 1,
                        display: "inside",
                        width: "150%",
                        height: itemBoxHeight,
                      }}
                      elevation={3}
                    >
                      <Enclosure />
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </>
  );
}
