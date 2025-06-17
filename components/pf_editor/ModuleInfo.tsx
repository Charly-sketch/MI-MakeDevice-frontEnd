import * as THREE from 'three'
import React, { useEffect, useState } from "react"
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListItemText, ListItemButton, Typography, IconButton } from "@mui/material";
// import { DeviceCatalog } from 'jacdac-ts';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { offsetHeight } from './editFunctions';
import {useBus, useChange, useDevices, useRegister, useRegisterValue, useServices} from "react-jacdac";

import {SRV_ROTARY_ENCODER, JDService, RotaryEncoderReg, SRV_BUTTON, ButtonReg} from "jacdac-ts"






export default function ModuleInfo(props: { lastClicked }) {
    const { lastClicked } = props
    
    const posStr = `x:${lastClicked.current.parent.position.z.toFixed(2)}, y:${lastClicked.current.parent.position.x.toFixed(2)}, z:${lastClicked.current.parent.position.y.toFixed(2)}`;

    const rotStr = `x:${THREE.MathUtils.radToDeg(lastClicked.current.rotation.z).toFixed(0)}, y:${THREE.MathUtils.radToDeg(lastClicked.current.rotation.x).toFixed(0)}, z:${THREE.MathUtils.radToDeg(lastClicked.current.rotation.y).toFixed(0)}`;

    const sizeStr = 'Size: '

    const spec = lastClicked ? lastClicked.current.userData.spec : undefined

    const name = spec ? `${spec.name} ` : 'No name found'

    const moreInfoLink = spec ? `https://microsoft.github.io/jacdac-docs/devices/${spec.id.replace('-', '/')}` : 'No link found'

    const [heightOffset, setHeightOffset] =  useState(lastClicked.current.position.y);

    // fetch the bus from the jacdac context
    const bus = useBus();
    // fetch the connect state, useChange will trigger a re-render when connected changes
    const connected = useChange(bus, (_) => _.connected);

    const rotaryService = useServices({serviceClass: SRV_ROTARY_ENCODER})
    const positionRegister = useRegister(rotaryService[0], RotaryEncoderReg.Position);
     // read and decode the value
    const [position = 0] = useRegisterValue(positionRegister)
    //button
    const buttonService = useServices({serviceClass: SRV_BUTTON});
    const pressureReg = useRegister(buttonService[0], ButtonReg.Pressure);
    const [pressure = 0] = useRegisterValue(pressureReg);


    const openInfoPage = (url) => {
      window.open(url, '_blank')!.focus()
    }
   
    return <>
    <Box component='div' sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="secondary mailbox folders">
       {lastClicked !== null &&
        <List>
             <ListItem disablePadding>
            <ListItemButton>
                <Typography variant="body2">
                 <Box component='div' sx={{fontWeight: "bold"}}>Name:</Box>{name}
                </Typography>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
                <Typography variant="body2">
                <Box component='div' sx={{fontWeight:"bold"}}>Position: </Box>{posStr}
                </Typography>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
                <Typography variant="body2">
                    <Box component='div' sx={{fontWeight:"bold"}}>Height Offset: </Box>{heightOffset}mm
                </Typography>
            </ListItemButton>
            <IconButton color="primary" aria-label="increase height offset" component="label" onClick={() => {offsetHeight(lastClicked.current, 1, setHeightOffset)}}>
              <AddIcon />
            </IconButton>
            <IconButton color="primary" aria-label="decrease height offset" component="label" onClick={() => {offsetHeight(lastClicked.current, -1, setHeightOffset)}}>
              <RemoveIcon />
            </IconButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
                <Typography variant="body2">
                    <Box component='div' sx={{fontWeight:"bold"}}>Rotation: </Box>{rotStr}
                </Typography>
            </ListItemButton>

          </ListItem>



          

          {/* <ListItem disablePadding>
            <ListItemButton>
                <Typography variant="body2">
                <Box component='div' sx={{fontWeight:"bold"}}>Size: </Box>TODO
                </Typography>
            </ListItemButton>
          </ListItem> */}


          <ListItem disablePadding onClick={() => {openInfoPage(moreInfoLink)}}>
            <ListItemButton>
              <Typography variant="body2">
                <Box component='div' sx={{ fontWeight: "bold"}}>More: </Box>
               <Box component='div' sx={{color: "blue"}}> Jacdac-docs device page [link] </Box>
                
              </Typography>
             
            </ListItemButton>
          </ListItem>

          
          {connected && 
          <>
          <h4>Bus test</h4>
            <ListItem disablePadding>
            <ListItemButton>
                <Typography variant="body2">
                    <Box component='div' sx={{fontWeight:"bold"}}>RotaryPosition: </Box>{position}
                </Typography>
            </ListItemButton>

            <ListItemButton>
                <Typography variant="body2">
                    <Box component='div' sx={{fontWeight:"bold"}}>ButtonPressure: </Box>{pressure}
                </Typography>
            </ListItemButton>

          </ListItem>
          </>
          }


        </List>}
      </nav>
    </Box>
        
    </>
}
