

import react, {Suspense, useEffect, useRef, useState} from "react"
import SVG from 'react-inlinesvg'
import {Grid} from "@mui/material"

export default function Enclosure_Stencil(props: {lidSVG}){

    const {lidSVG} = props

    return (
        <>
            <Grid container direction='row'>
            <Grid item xs={6}>
                {lidSVG &&
                    <SVG src={lidSVG}></SVG>
                }
            </Grid>
            
        </Grid>
        </>
    )

    
}