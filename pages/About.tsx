import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import CssBaseline from '@mui/material/CssBaseline';
import styles from '../styles/Home.module.css'
import PFHeaderBar from '../components/toolbar/PFHeaderBar';
import Image from 'next/image'
import { Container, Grid } from '@mui/material';
import { useState } from 'react';

const About: NextPage = () => {

    const myLoader = ({ src, width, quality }) => {
        return `${src}?w=${width}&q=${quality || 1000}`
      }


    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    }




    return (<>
        <div className={styles.container}>
            <Head>
                <title>MakeDevice | About</title>
            </Head>
            
            <header className={styles.header}>
                <PFHeaderBar page={'about'}></PFHeaderBar>
            </header>
            <Container sx={{ m: 0.5 }}>
                <Grid item >  
                    <h1>About</h1>
                    MakeDevice is a work-in-progress web tool allowing users to evolve their desktop, wired prorotypes into more robust enclosed devices using <a href={"https://microsoft.github.io/jacdac-docs/"}>Jacdac</a>.
                </Grid>                        
                <Grid item> 
                    <h3>TEI2023 WiP Paper</h3>
                    You can find the paper documenting this work here: <a href={"https://dl.acm.org/doi/10.1145/3569009.3573106"}>TEI2023 Paper</a>
                </Grid>

                <Grid item> 
                <h3>TEI2023 Poster</h3>
                    <Image
                        loader={myLoader}
                        src="/imgs/TEI23 PosterV3Final.png"
                        alt=""   
                        height={'23.4in'}
                        width={'33.1in'}
                        layout={'responsive'}
                        
                        /> 
                
                
                </Grid>
            </Container>
            
            <footer>Created by Kobi Hartley</footer>
        </div>
    
    </>)
}

export default About