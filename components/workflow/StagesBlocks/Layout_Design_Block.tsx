"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Layout_Design from "../Layout_Design";
import PCB_Assembly from "../PCB_Assembly";
import Enclosure from "../Enclosure";
import { Fade } from "@mui/material";

export default function Layout_Design_Block(props: {}) {
  return <></>;
}

/**  <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          variants={{
            visible: { opacity: 1, scale: 1 },
            hidden: { opacity: 0, scale: 0 },
          }}
        > }
        <Paper sx={{ p: 1 }} elevation={3}>
          <Layout_Design />
        </Paper>
        </motion.div>
        <Paper sx={{ p: 1 }} elevation={3}>
          <PCB_Assembly />
        </Paper>
        <Paper sx={{ p: 1 }} elevation={3}>
          <Enclosure />
        </Paper> */
