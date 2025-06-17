import type { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Box, Button, Grid, Typography } from "@mui/material";
import PFHeaderBar from "../components/toolbar/PFHeaderBar";

import Link from "next/link";

const Index: NextPage = () => {
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>MakeDevice</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <PFHeaderBar page={"editor"} />
          <Grid container component="main" sx={{ height: "100vh" }}>
            <Grid item xs={6}>
              <Box
                component={"div"}
                id="welcome_title"
                sx={{ paddingTop: "15%", paddingLeft: "20%" }}
              >
                <Typography variant="h1">Welcome to MakeDevice</Typography>
                <Typography variant="h3">
                  Explore, create & isotype Jacdac-based devices.
                </Typography>
                <Grid
                  id="button_container"
                  item
                  xs={12}
                  padding={"3em"}
                  justifyContent={"center"}
                >
                  <Box
                    id="button_container"
                    alignItems={"center"}
                    justifyContent={"center"}
                    display={"flex"}
                  >
                    <Button
                      size="large"
                      sx={{ fontSize: "1.5em" }}
                      variant={"contained"}
                      style={{}}
                    >
                      {" "}
                      <Link href="/home">Get started</Link>
                    </Button>
                  </Box>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Grid item width={"100%"} padding={"5em"}>
                <Image
                  fill={true}
                  width={600}
                  height={500}
                  alt="Image of modules within Kittenbot Kit A"
                  src="/imgs/kita.jpg"
                ></Image>
              </Grid>
            </Grid>
          </Grid>
        </main>
      </div>
    </>
  );
};

export default Index;
