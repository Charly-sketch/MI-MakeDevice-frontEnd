import react, { Suspense, useEffect, useRef, useState } from "react";
import { Grid, NoSsr, Button } from "@mui/material";
import SVGTest from "../../models/SVGTest";
import PressFitBox from "../PressFitBox";
import Image from "next/image";
import SVG from "react-inlinesvg";

export default function Enclosure_TabbedBox(props: {
  tabbedBoxURL;
  handleRefreshPreview;
  svgArr: null;
}) {
  const svgTestString = ` <svg width="100.0002mm" height="100.0002mm" viewBox="0 0 100.0002 100.0002" fill="none" fill-rule="evenodd" stroke-width="0.1px" version="1.1" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <g>
                                <path fill="black" d="M0 0L7.7427 0L7.7427 3.0004L15.3352 3.0004L15.3352 0L23.127 0L23.127 3.0004L30.7195 3.0004L30.7195 0L38.512 0L38.512 3.0004L46.1045 3.0004L46.1045 0L53.8963 0L53.8963 3.0004L61.4889 3.0004L61.4889 0L69.2813 0L69.2813 3.0004L76.8732 3.0004L76.8732 0L84.6657 0L84.6657 3.0004L92.2582 3.0004L92.2582 0L100.0002 0L100.0002 7.7427L97.0005 7.7427L97.0005 15.3352L100.0002 15.3352L100.0002 23.127L97.0005 23.127L97.0005 30.7195L100.0002 30.7195L100.0002 38.512L97.0005 38.512L97.0005 46.1045L100.0002 46.1045L100.0002 53.8963L97.0005 53.8963L97.0005 61.4889L100.0002 61.4889L100.0002 69.2813L97.0005 69.2813L97.0005 76.8732L100.0002 76.8732L100.0002 84.6657L97.0005 84.6657L97.0005 92.2582L100.0002 92.2582L100.0002 100.0002L92.2582 100.0002L92.2582 97.0005L84.6657 97.0005L84.6657 100.0002L76.8732 100.0002L76.8732 97.0005L69.2813 97.0005L69.2813 100.0002L61.4889 100.0002L61.4889 97.0005L53.8963 97.0005L53.8963 100.0002L46.1045 100.0002L46.1045 97.0005L38.512 97.0005L38.512 100.0002L30.7195 100.0002L30.7195 97.0005L23.127 97.0005L23.127 100.0002L15.3352 100.0002L15.3352 97.0005L7.7427 97.0005L7.7427 100.0002L0 100.0002L0 92.2582L3.0004 92.2582L3.0004 84.6657L0 84.6657L0 76.8732L3.0004 76.8732L3.0004 69.2813L0 69.2813L0 61.4889L3.0004 61.4889L3.0004 53.8963L0 53.8963L0 46.1045L3.0004 46.1045L3.0004 38.512L0 38.512L0 30.7195L3.0004 30.7195L3.0004 23.127L0 23.127L0 15.3352L3.0004 15.3352L3.0004 7.7427L0 7.7427L0 0M90.8725 90.6947L90.8725 79.3814L84.8219 79.3814L79.0521 79.3814L79.0514 90.694L79.0521 90.694L79.0521 90.6947L90.8725 90.6947"/>
                                </g>
                            </svg>
                            `;

  const { tabbedBoxURL, handleRefreshPreview, svgArr } = props;
  const svgString = svgArr ? svgArr[0] : svgTestString;

  return (
    <Grid container direction="row">
      <Grid item xs={12}>
        <NoSsr>
          {tabbedBoxURL !== false && (
            <Suspense>
              {/* <SVGModelCard name='Tabbed box' color="#888"/> */}
              <div>
                <Grid container direction="row" spacing={6}>
                  {svgArr && (
                    <>
                      <Grid item xs={6}>
                        <SVG src={svgArr[0][0]}></SVG>
                      </Grid>
                      <Grid item xs={6}>
                        <SVG src={svgArr[1][0]}></SVG>
                      </Grid>
                      <Grid item xs={6}>
                        <SVG src={svgArr[2][0]}></SVG>
                      </Grid>
                      <Grid item xs={6}>
                        <SVG src={svgArr[3][0]}></SVG>
                      </Grid>
                      <Grid item xs={6}>
                        <SVG src={svgArr[4][0]}></SVG>
                      </Grid>
                      <Grid item xs={6}>
                        <SVG src={svgArr[5][0]}></SVG>
                      </Grid>
                    </>
                  )}
                </Grid>
              </div>
            </Suspense>
          )}
        </NoSsr>
      </Grid>
      <Grid item>
        <Button onClick={handleRefreshPreview}>Refresh preview</Button>
      </Grid>
    </Grid>
  );
}
