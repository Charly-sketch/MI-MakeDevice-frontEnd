import { Button } from "@mui/material"
//import Link from "next/link"
import React from "react"


export default function EnclosureButton(props: {setEnclosureOptionsOpen}){

    const {setEnclosureOptionsOpen} = props;

    return (
        <>
            <Button onClick={() => {setEnclosureOptionsOpen(true)}}>Enclosure Preview</Button>
        </>
    )
}