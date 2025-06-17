import react, {Suspense, useEffect} from "react";
import {Grid, NoSsr, Button} from "@mui/material"
import STLModelCard from "../../models/STLModelCard"

export default function Enclosure_3dModel(props: {lidURL, baseURL, handleRefreshPreview}){

    const {lidURL, baseURL, handleRefreshPreview} = props;



    return (
    
        <Grid container direction='row'>
            <Grid item xs={6}>
                  <NoSsr>
                          
                    {lidURL &&
                        <Suspense>
                        <STLModelCard name='Lid' url={lidURL} color="#888"/>
                      </Suspense>
                    }
                </NoSsr>

            </Grid>
            <Grid item xs={6}>
            <NoSsr>
                    {baseURL &&
                      <Suspense>
                        <STLModelCard name='Base' url={baseURL} color="#888"/>
                      </Suspense>
                    }   
            </NoSsr>         
            </Grid>
            <Grid item>
                <Button onClick={handleRefreshPreview}>Refresh preview</Button>
            </Grid>
        </Grid>
    
    )
}