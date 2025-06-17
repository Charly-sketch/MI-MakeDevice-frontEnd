// @ts-nocheck
import React, { lazy, Suspense, useEffect, useState } from "react"
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    Typography,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Box, 
    Tab,
    Tabs,
    Grid,
    FormGroup,
    InputLabel,
    MenuItem,
    NoSsr,
    Select,
    TextField,
    Paper,
    Card
} from "@mui/material"

const CarrierPCBOptions = (props: {
    CarrierPCBOptionsOpen: boolean 
    setCarrierPCBOptionsOpen
    
}) => {

    const {
        CarrierPCBOptionsOpen,
        setCarrierPCBOptionsOpen,
        
    } = props


    const handleClose = () => { setCarrierPCBOptionsOpen(false) };

    const handleCardClick = (type) => {}

  return (
    <Dialog open={CarrierPCBOptionsOpen} onClose={handleClose} fullScreen>
        <DialogTitle>Carrier PCB Export Options</DialogTitle>
        
        <DialogContent>

            <Box sx={{width: '100%'}} padding={6}>
                <Grid container direction='row' spacing={6}>

                    <Grid item xs={12}>
                        <h4>Please select one of the export options below, depending on your needs. You can find more information about what each export type can be used for <a href="">here</a></h4>
                    </Grid>

                    <Grid item xs={6} >
                        <Card onClick={() => {handleCardClick('gerber')}}>
                        <h5>Gerber</h5>
                        <p>Gerber is a file format used to describe the printed circuit board (PCB) design. It is used by PCB fabrication houses to manufacture printed circuit boards.</p>
                        </Card>
                    </Grid>

                    <Grid item xs={6}>
                        <Card onClick={() => {handleCardClick('svg')}} >
                        <h5>SVG</h5>
                        <p>SVG export can be used for purely visual purposes, but also used as a stencil or cricut in paper/carboard prototyping of your device.</p>
                        </Card>
                    </Grid>

                </Grid>

            </Box>
        </DialogContent>
    </Dialog>
  )
};

export default CarrierPCBOptions;